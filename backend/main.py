"""SycnOps FastAPI backend — same routes as index.js, live GitHub data."""
from __future__ import annotations

import os
import re
import secrets
import time
from datetime import datetime, timezone
from typing import Any, Optional
from urllib.parse import quote

import httpx
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "backend.env"))
    load_dotenv()
except ImportError:
    pass

PORT = int(os.getenv("PORT", "5000"))
JWT_SECRET = os.getenv("JWT_SECRET") or secrets.token_hex(32)
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
GH_TIMEOUT = 12.0

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
users: list[dict] = []
workspaces: dict[str, dict] = {}
users_col = None


def connect_mongo():
    global users_col
    uri = os.getenv("MONGO_URI")
    if not uri:
        print("MONGO_URI not set — in-memory users.")
        return
    try:
        from pymongo import MongoClient
        client = MongoClient(uri, serverSelectionTimeoutMS=10000)
        client.admin.command("ping")
        db = None
        try:
            db = client.get_default_database()
        except Exception:
            db = None
        if db is None:
            db = client["sycnops"]
        users_col = db["users"]
        print("MongoDB connected")
    except Exception as err:
        print("MongoDB failed:", err, "— in-memory users.")


connect_mongo()


def mongo_to_user(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc.get("name"),
        "email": doc.get("email"),
        "password": doc.get("password"),
        "role": doc.get("role", "developer"),
        "authProvider": doc.get("authProvider", "local"),
        "createdAt": doc.get("createdAt"),
    }


def find_user_email(email: str) -> Optional[dict]:
    if users_col is not None:
        doc = users_col.find_one({"email": email})
        return mongo_to_user(doc) if doc else None
    return next((u for u in users if u["email"] == email), None)


def find_user_id(user_id: str) -> Optional[dict]:
    if users_col is not None:
        from bson import ObjectId
        try:
            doc = users_col.find_one({"_id": ObjectId(user_id)})
        except Exception:
            doc = None
        return mongo_to_user(doc) if doc else None
    return next((u for u in users if u["id"] == user_id), None)


def save_user(data: dict) -> dict:
    if users_col is not None:
        res = users_col.insert_one(data)
        data["id"] = str(res.inserted_id)
        return data
    data["id"] = data.get("id") or f"usr_{int(time.time() * 1000)}"
    users.append(data)
    return data

app = FastAPI(title="SycnOps Backend", version="2.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegisterBody(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "developer"


class LoginBody(BaseModel):
    email: EmailStr
    password: str


class SocialBody(BaseModel):
    provider: str
    email: EmailStr
    name: Optional[str] = None


class NameBody(BaseModel):
    name: str


class ImportBody(BaseModel):
    name: str


def make_token(user_id: str) -> str:
    return jwt.encode({"id": user_id, "exp": int(time.time()) + 7 * 24 * 3600}, JWT_SECRET, algorithm="HS256")


def format_user(user: dict) -> dict:
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "developer"),
        "createdAt": user.get("createdAt"),
    }


def workspace(user_id: str) -> dict:
    key = str(user_id)
    if key not in workspaces:
        workspaces[key] = {"repos": []}
    return workspaces[key]


def find_repo(repos: list, id_param: str) -> Optional[dict]:
    for r in repos:
        if str(r.get("id")) == str(id_param) or r.get("name") == id_param or r.get("fullName") == id_param:
            return r
    return None


def auth_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail={"success": False, "message": "Please log in."})
    try:
        payload = jwt.decode(authorization[7:], JWT_SECRET, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(status_code=401, detail={"success": False, "message": "Invalid or expired token."})
    user = find_user_id(str(payload.get("id") or ""))
    if not user:
        raise HTTPException(status_code=401, detail={"success": False, "message": "Please log in."})
    return user


def parse_github_repo(raw: str) -> Optional[dict]:
    if not raw or not raw.strip():
        return None
    cleaned = raw.strip().rstrip("/")
    url = re.match(
        r"(?:https?://)?(?:www\.)?github\.com/([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+?)(?:\.git)?$",
        cleaned,
        re.I,
    )
    if url:
        return {"owner": url.group(1), "repo": url.group(2)}
    slash = re.match(r"^([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)$", cleaned)
    if slash:
        return {"owner": slash.group(1), "repo": slash.group(2)}
    return None


def time_ago(iso: Optional[str]) -> str:
    if not iso:
        return ""
    try:
        dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        mins = max(0, int((datetime.now(timezone.utc) - dt).total_seconds() // 60))
    except Exception:
        return iso
    if mins < 60:
        return f"{mins}m ago"
    hours = mins // 60
    if hours < 24:
        return f"{hours}h ago"
    return f"{hours // 24}d ago"


def label_priority(labels: list) -> str:
    names = [(l.get("name") or "").lower() for l in labels]
    if any(re.search(r"critical|security|urgent|p0|bug|error|crash|high", n) for n in names):
        return "high"
    if names:
        return "medium"
    return "low"


def gh_headers() -> dict:
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "SycnOps-AI/2.0"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return headers


async def gh_fetch(path: str) -> Any:
    url = f"https://api.github.com{path}"
    async with httpx.AsyncClient(timeout=GH_TIMEOUT) as client:
        res = await client.get(url, headers=gh_headers())
    if res.status_code == 403:
        raise HTTPException(status_code=400, detail={"success": False, "message": "GitHub API rate limit reached. Add GITHUB_TOKEN and retry."})
    if res.status_code == 404:
        raise HTTPException(status_code=400, detail={"success": False, "message": "Not found on GitHub."})
    if res.status_code >= 400:
        raise HTTPException(status_code=400, detail={"success": False, "message": f"GitHub API HTTP {res.status_code}"})
    return res.json()


def map_repo(data: dict, extra: Optional[dict] = None) -> dict:
    extra = extra or {}
    return {
        "id": extra.get("id") or data.get("id"),
        "name": data.get("name"),
        "fullName": data.get("full_name"),
        "description": data.get("description") or "",
        "language": data.get("language") or "Unknown",
        "stars": data.get("stargazers_count") or 0,
        "forks": data.get("forks_count") or 0,
        "openIssues": data.get("open_issues_count") or 0,
        "visibility": "private" if data.get("private") else "public",
        "defaultBranch": data.get("default_branch") or "main",
        "owner": (data.get("owner") or {}).get("login"),
        "avatarUrl": (data.get("owner") or {}).get("avatar_url") or "",
        "htmlUrl": data.get("html_url") or "",
        "topics": data.get("topics") or [],
        "watchers": data.get("watchers_count") or 0,
        "size": data.get("size") or 0,
        "updatedAt": time_ago(data.get("updated_at")),
        "importedAt": extra.get("importedAt") or datetime.now(timezone.utc).isoformat(),
        "source": "github",
    }


def map_issue(issue: dict, repo_full: str) -> dict:
    labels = issue.get("labels") or []
    return {
        "id": issue.get("id"),
        "number": issue.get("number"),
        "title": issue.get("title"),
        "repo": repo_full,
        "priority": label_priority(labels if isinstance(labels, list) else []),
        "label": (labels[0].get("name") if labels and isinstance(labels[0], dict) else "issue"),
        "state": issue.get("state"),
        "assignee": (issue.get("assignee") or {}).get("login") or "unassigned",
        "htmlUrl": issue.get("html_url"),
        "createdAt": time_ago(issue.get("created_at")),
        "createdAtRaw": issue.get("created_at"),
    }


def map_pr(pr: dict, repo_full: str) -> dict:
    status = "merged" if pr.get("merged_at") else pr.get("state")
    return {
        "id": pr.get("id"),
        "number": pr.get("number"),
        "title": pr.get("title"),
        "repo": repo_full,
        "author": (pr.get("user") or {}).get("login") or "unknown",
        "status": status,
        "comments": pr.get("comments") or 0,
        "createdAt": time_ago(pr.get("created_at")),
        "htmlUrl": pr.get("html_url"),
        "draft": bool(pr.get("draft")),
    }


def map_commit(commit: dict, repo_full: str) -> dict:
    sha = commit.get("sha") or ""
    c = commit.get("commit") or {}
    author = c.get("author") or {}
    return {
        "id": sha[:7],
        "fullSha": sha,
        "message": (c.get("message") or "").split("\n")[0],
        "author": author.get("name") or (commit.get("author") or {}).get("login") or "unknown",
        "time": time_ago(author.get("date")),
        "date": author.get("date"),
        "htmlUrl": commit.get("html_url"),
        "avatar": (commit.get("author") or {}).get("avatar_url") or "",
        "repo": repo_full,
    }


async def fetch_repo_bundle(owner: str, repo: str) -> dict:
    o, r = quote(owner), quote(repo)
    meta = await gh_fetch(f"/repos/{o}/{r}")
    issues_raw, pulls_raw, commits_raw = [], [], []
    try:
        issues_raw = await gh_fetch(f"/repos/{o}/{r}/issues?state=open&per_page=50&sort=updated")
    except Exception:
        pass
    try:
        pulls_raw = await gh_fetch(f"/repos/{o}/{r}/pulls?state=open&per_page=50&sort=updated")
    except Exception:
        pass
    try:
        commits_raw = await gh_fetch(f"/repos/{o}/{r}/commits?per_page=30")
    except Exception:
        pass
    full = meta.get("full_name")
    issues = [map_issue(i, full) for i in issues_raw if isinstance(i, dict) and not i.get("pull_request")]
    pulls = [map_pr(p, full) for p in pulls_raw if isinstance(p, dict)]
    commits = [map_commit(c, full) for c in commits_raw if isinstance(c, dict)]
    return {"meta": meta, "issues": issues, "pulls": pulls, "commits": commits}


def json_error(status: int, message: str):
    raise HTTPException(status_code=status, detail={"success": False, "message": message})


@app.exception_handler(HTTPException)
async def http_exc_handler(_request, exc: HTTPException):
    from fastapi.responses import JSONResponse
    if isinstance(exc.detail, dict):
        return JSONResponse(status_code=exc.status_code, content=exc.detail)
    return JSONResponse(status_code=exc.status_code, content={"success": False, "message": str(exc.detail)})


@app.get("/")
def root():
    return {"message": "SycnOps Backend is running", "status": "online"}


@app.get("/api/health")
def health():
    return {
        "status": "online",
        "service": "SycnOps AI Backend",
        "version": "2.1.0",
        "database": "connected" if users_col is not None else "memory",
        "runtime": "fastapi",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/api/auth/register")
def register(body: RegisterBody):
    if len(body.password) < 6:
        json_error(400, "Password must be at least 6 characters.")
    email = body.email.lower().strip()
    if find_user_email(email):
        json_error(400, "An account with this email already exists.")
    user = save_user({
        "name": body.name.strip(),
        "email": email,
        "password": pwd.hash(body.password),
        "role": body.role or "developer",
        "authProvider": "local",
        "createdAt": datetime.now(timezone.utc).isoformat(),
    })
    return {"success": True, "token": make_token(user["id"]), "user": format_user(user)}


@app.post("/api/auth/login")
def login(body: LoginBody):
    email = body.email.lower().strip()
    user = find_user_email(email)
    if not user:
        json_error(401, "Invalid email or password.")
    if not user.get("password"):
        json_error(401, f"This account uses {user.get('authProvider') or 'social'} login.")
    if not pwd.verify(body.password, user["password"]):
        json_error(401, "Invalid email or password.")
    return {"success": True, "token": make_token(user["id"]), "user": format_user(user)}


@app.post("/api/auth/social")
def social_login(body: SocialBody):
    if body.provider not in ("google", "github"):
        json_error(400, "Provider must be google or github.")
    email = body.email.lower().strip()
    display = (body.name or "").strip() or email.split("@")[0]
    provider = "github" if body.provider == "github" else "google"
    user = find_user_email(email)
    if not user:
        user = save_user({
            "name": display,
            "email": email,
            "role": "developer",
            "authProvider": provider,
            "createdAt": datetime.now(timezone.utc).isoformat(),
        })
    elif users_col is not None:
        from bson import ObjectId
        users_col.update_one({"_id": ObjectId(user["id"])}, {"$set": {"name": display, "authProvider": provider}})
        user["name"] = display
    elif display and user["name"] != display:
        user["name"] = display
    return {"success": True, "message": f"Signed in with {body.provider}.", "token": make_token(user["id"]), "user": format_user(user)}


@app.get("/api/auth/me")
def me(user: dict = Depends(auth_user)):
    return {"success": True, "user": format_user(user)}


@app.put("/api/auth/me")
def update_me(body: NameBody, user: dict = Depends(auth_user)):
    name = (body.name or "").strip()
    if not name:
        json_error(400, "Name is required.")
    user["name"] = name
    if users_col is not None:
        from bson import ObjectId
        users_col.update_one({"_id": ObjectId(user["id"])}, {"$set": {"name": name}})
    return {"success": True, "user": format_user(user)}


@app.get("/api/repositories")
def list_repos(user: dict = Depends(auth_user)):
    repos = workspace(user["id"])["repos"]
    return {"success": True, "count": len(repos), "data": repos}


@app.post("/api/repositories/import")
async def import_repo(body: ImportBody, user: dict = Depends(auth_user)):
    parsed = parse_github_repo(body.name)
    if not parsed:
        json_error(400, "Enter a GitHub URL or owner/repo (example: facebook/react).")
    ws = workspace(user["id"])
    full = f"{parsed['owner']}/{parsed['repo']}".lower()
    if any((r.get("fullName") or "").lower() == full for r in ws["repos"]):
        json_error(400, f"Repository {parsed['owner']}/{parsed['repo']} is already imported.")
    bundle = await fetch_repo_bundle(parsed["owner"], parsed["repo"])
    repo = map_repo(bundle["meta"], {"importedAt": datetime.now(timezone.utc).isoformat()})
    repo["issues"] = bundle["issues"]
    repo["pulls"] = bundle["pulls"]
    repo["commits"] = bundle["commits"]
    ws["repos"].insert(0, repo)
    return {"success": True, "message": f"Imported {repo['fullName']} from GitHub.", "data": repo}


@app.get("/api/repositories/github-info/{owner}/{repo}")
async def github_info(owner: str, repo: str, user: dict = Depends(auth_user)):
    bundle = await fetch_repo_bundle(owner, repo)
    return {"success": True, "data": map_repo(bundle["meta"])}


@app.get("/api/repositories/{repo_id}/details")
async def repo_details(repo_id: str, user: dict = Depends(auth_user)):
    repo = find_repo(workspace(user["id"])["repos"], repo_id)
    if not repo:
        json_error(404, "Repository not found in your workspace.")
    owner, name = repo.get("owner"), repo.get("name")
    if repo.get("source") != "github" or not owner:
        return {"success": True, "data": {"repo": repo, "issues": [], "pulls": [], "commits": [], "languages": {}, "contributors": []}}
    o, n = quote(owner), quote(name)
    issues_raw = pulls_raw = commits_raw = contributors = []
    languages: dict = {}
    try:
        issues_raw = await gh_fetch(f"/repos/{o}/{n}/issues?state=open&per_page=15&sort=updated")
    except Exception:
        pass
    try:
        pulls_raw = await gh_fetch(f"/repos/{o}/{n}/pulls?state=open&per_page=15&sort=updated")
    except Exception:
        pass
    try:
        commits_raw = await gh_fetch(f"/repos/{o}/{n}/commits?per_page=20")
    except Exception:
        pass
    try:
        languages = await gh_fetch(f"/repos/{o}/{n}/languages")
    except Exception:
        languages = {}
    try:
        contributors = await gh_fetch(f"/repos/{o}/{n}/contributors?per_page=10")
    except Exception:
        contributors = []
    issues = [
        {
            "id": i.get("id"), "number": i.get("number"), "title": i.get("title"), "state": i.get("state"),
            "labels": [{"name": l.get("name"), "color": l.get("color")} for l in (i.get("labels") or []) if isinstance(l, dict)],
            "user": (i.get("user") or {}).get("login"), "avatar": (i.get("user") or {}).get("avatar_url"),
            "createdAt": i.get("created_at"), "htmlUrl": i.get("html_url"),
            "body": (i.get("body") or "")[:300],
        }
        for i in issues_raw if isinstance(i, dict) and not i.get("pull_request")
    ]
    pulls = [
        {
            "id": p.get("id"), "number": p.get("number"), "title": p.get("title"), "state": p.get("state"),
            "user": (p.get("user") or {}).get("login"), "htmlUrl": p.get("html_url"),
            "createdAt": p.get("created_at"), "draft": p.get("draft"),
        }
        for p in pulls_raw if isinstance(p, dict)
    ]
    commits = [map_commit(c, repo.get("fullName")) for c in commits_raw if isinstance(c, dict)]
    repo["issues"] = [
        {"id": i["id"], "number": i["number"], "title": i["title"], "repo": repo.get("fullName"),
         "priority": "medium", "label": (i["labels"][0]["name"] if i["labels"] else "issue"),
         "state": i["state"], "assignee": i.get("user") or "unassigned", "htmlUrl": i.get("htmlUrl")}
        for i in issues
    ]
    repo["pulls"] = [
        {"id": p["id"], "number": p["number"], "title": p["title"], "repo": repo.get("fullName"),
         "author": p.get("user"), "status": p.get("state"), "comments": 0, "htmlUrl": p.get("htmlUrl")}
        for p in pulls
    ]
    repo["commits"] = commits
    contrib = [
        {"login": c.get("login"), "avatar": c.get("avatar_url"), "contributions": c.get("contributions"), "htmlUrl": c.get("html_url")}
        for c in contributors if isinstance(c, dict)
    ]
    return {"success": True, "data": {"repo": repo, "issues": issues, "pulls": pulls, "commits": commits, "languages": languages, "contributors": contrib}}


@app.get("/api/repositories/{repo_id}/analysis")
async def repo_analysis(repo_id: str, user: dict = Depends(auth_user)):
    repo = find_repo(workspace(user["id"])["repos"], repo_id)
    if not repo:
        json_error(404, "Repository not found.")
    owner, name = repo.get("owner"), repo.get("name")
    if repo.get("source") != "github" or not owner:
        return {"success": True, "data": {"healthScore": 0, "findings": [], "insights": ["Import a GitHub repository to analyze it."], "recentCommits": []}}
    o, n = quote(owner), quote(name)
    issues = pulls = commits = []
    try:
        issues = await gh_fetch(f"/repos/{o}/{n}/issues?state=all&per_page=100")
    except Exception:
        issues = []
    try:
        pulls = await gh_fetch(f"/repos/{o}/{n}/pulls?state=all&per_page=100")
    except Exception:
        pulls = []
    try:
        commits = await gh_fetch(f"/repos/{o}/{n}/commits?per_page=100")
    except Exception:
        commits = []
    now = time.time() * 1000

    def ts(iso):
        try:
            return datetime.fromisoformat(iso.replace("Z", "+00:00")).timestamp() * 1000
        except Exception:
            return now

    def has_label(issue, pattern):
        return any(re.search(pattern, (l.get("name") or ""), re.I) for l in (issue.get("labels") or []) if isinstance(l, dict))

    open_issues = [i for i in issues if i.get("state") == "open" and not i.get("pull_request")]
    closed_issues = [i for i in issues if i.get("state") == "closed" and not i.get("pull_request")]
    bugs = [i for i in open_issues if has_label(i, r"bug|error|fix|crash|broken")]
    security = [i for i in open_issues if has_label(i, r"security|vulnerability|cve")]
    open_prs = [p for p in pulls if p.get("state") == "open"]
    merged = [p for p in pulls if p.get("merged_at")]
    total_iss = len(open_issues) + len(closed_issues)
    close_rate = round(len(closed_issues) / total_iss * 100) if total_iss else 0
    pr_total = len(open_prs) + len(merged) + len([p for p in pulls if p.get("state") == "closed" and not p.get("merged_at")])
    merge_rate = round(len(merged) / pr_total * 100) if pr_total else 0
    score = max(0, min(100, 60 + (12 if close_rate > 80 else 0) + (8 if merge_rate > 75 else 0) - (10 if security else 0)))
    findings = []
    if security:
        findings.append({"severity": "critical", "icon": "🚨", "category": "Security", "title": f"{len(security)} security issue(s) open", "detail": "From GitHub labels."})
    if bugs:
        findings.append({"severity": "medium", "icon": "🐛", "category": "Bugs", "title": f"{len(bugs)} open bugs", "detail": "From GitHub issue labels."})
    if not findings:
        findings.append({"severity": "low", "icon": "✅", "category": "Health", "title": "No major issues flagged", "detail": "Based on current GitHub labels."})
    recent = [
        {
            "sha": (c.get("sha") or "")[:7],
            "message": ((c.get("commit") or {}).get("message") or "").split("\n")[0],
            "author": ((c.get("commit") or {}).get("author") or {}).get("name") or "unknown",
            "date": ((c.get("commit") or {}).get("author") or {}).get("date"),
            "htmlUrl": c.get("html_url"),
        }
        for c in commits[:15]
    ]
    return {
        "success": True,
        "data": {
            "healthScore": score,
            "healthTier": "Good" if score >= 65 else "Fair",
            "issueCloseRate": close_rate,
            "prMergeRate": merge_rate,
            "openBugs": len(bugs),
            "securityIssues": len(security),
            "perfIssues": 0,
            "docIssues": 0,
            "openFeatureRequests": 0,
            "staleIssues": 0,
            "oldBugs": 0,
            "totalOpenIssues": len(open_issues),
            "totalClosedIssues": len(closed_issues),
            "openPRs": len(open_prs),
            "mergedPRs": len(merged),
            "closedPRs": 0,
            "draftPRs": 0,
            "stalePRs": 0,
            "recentCommits7d": 0,
            "recentCommits30d": len(commits),
            "daysSinceCommit": None,
            "lastCommitDate": None,
            "recentAuthors": [],
            "hasLicense": True,
            "findings": findings,
            "insights": [
                f"{len(bugs)} open bugs of {len(open_issues)} open issues.",
                f"{len(open_prs)} open PRs, merge rate {merge_rate}%.",
            ],
            "recentCommits": recent,
            "bugs": [{"number": i.get("number"), "title": i.get("title"), "htmlUrl": i.get("html_url"), "labels": i.get("labels") or [], "user": (i.get("user") or {}).get("login"), "daysOld": 0, "comments": i.get("comments") or 0} for i in bugs[:20]],
            "securityIssuesList": [],
            "recommendations": [{"priority": f["severity"], "text": f["title"]} for f in findings[:6]],
            "summary": {"criticalFindings": sum(1 for f in findings if f["severity"] == "critical"), "highFindings": 0, "mediumFindings": sum(1 for f in findings if f["severity"] == "medium"), "lowFindings": sum(1 for f in findings if f["severity"] == "low")},
        },
    }


@app.delete("/api/repositories/{repo_id}")
def delete_repo(repo_id: str, user: dict = Depends(auth_user)):
    ws = workspace(user["id"])
    before = len(ws["repos"])
    ws["repos"] = [r for r in ws["repos"] if str(r.get("id")) != str(repo_id) and r.get("name") != repo_id and r.get("fullName") != repo_id]
    if len(ws["repos"]) == before:
        json_error(404, "Repository not found.")
    return {"success": True, "message": "Repository removed."}


@app.get("/api/pull-requests")
def list_prs(user: dict = Depends(auth_user)):
    data = [p for r in workspace(user["id"])["repos"] for p in (r.get("pulls") or [])]
    return {"success": True, "count": len(data), "data": data}


@app.get("/api/issues")
def list_issues(user: dict = Depends(auth_user)):
    data = [i for r in workspace(user["id"])["repos"] for i in (r.get("issues") or [])]
    return {"success": True, "count": len(data), "data": data}


@app.get("/api/analytics")
def analytics(user: dict = Depends(auth_user)):
    repos = workspace(user["id"])["repos"]
    prs = [p for r in repos for p in (r.get("pulls") or [])]
    issues = [i for r in repos for i in (r.get("issues") or [])]
    commits = sorted([c for r in repos for c in (r.get("commits") or [])], key=lambda c: c.get("date") or "", reverse=True)
    days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    buckets = {d: {"day": d, "commits": 0, "prs": 0} for d in days}
    for c in commits:
        if not c.get("date"):
            continue
        try:
            d = datetime.fromisoformat(c["date"].replace("Z", "+00:00"))
            buckets[days[int(d.strftime("%w"))]]["commits"] += 1
        except Exception:
            pass
    recent = sum(1 for c in commits if c.get("date"))
    velocity = 0 if not repos else max(0, min(100, round(40 + min(recent, 20) * 2 + min(len(prs), 10))))
    return {
        "success": True,
        "data": {
            "totalCommits": len(commits),
            "mergedPRs": sum(1 for p in prs if p.get("status") == "merged"),
            "issuesClosed": sum(1 for i in issues if i.get("state") == "closed"),
            "codeReviewsCount": len(prs),
            "velocityScore": velocity,
            "dailyActivity": [buckets[d] for d in days],
        },
    }


@app.get("/api/dashboard")
def dashboard(user: dict = Depends(auth_user)):
    repos = workspace(user["id"])["repos"]
    prs = [p for r in repos for p in (r.get("pulls") or [])]
    issues = [i for r in repos for i in (r.get("issues") or [])]
    commits = sorted([c for r in repos for c in (r.get("commits") or [])], key=lambda c: c.get("date") or "", reverse=True)[:8]
    return {
        "success": True,
        "data": {
            "totalRepositories": len(repos),
            "activePullRequests": sum(1 for p in prs if p.get("status") == "open"),
            "openIssues": sum(1 for i in issues if i.get("state") == "open"),
            "recentCommits": commits,
        },
    }


if __name__ == "__main__":
    import uvicorn
    print(f"SycnOps FastAPI running at http://localhost:{PORT}")
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)

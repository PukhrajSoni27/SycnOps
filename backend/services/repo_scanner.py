"""
repo_scanner.py

Recursively scans repository folders and files.
Supports both remote GitHub repositories (via GitHub Git Trees API) and local project directories.
Filters ignored directories and extracts file metadata, line counts, and source samples safely.
"""

import os
import re
import httpx
from typing import Dict, List, Set, Any, Optional

from .language_detector import detect_language
from .file_classifier import classify_file, is_sensitive_file

IGNORED_DIRS = {
    "node_modules",
    ".git",
    ".idea",
    ".vscode",
    "dist",
    "build",
    ".venv",
    "venv",
    "env",
    "__pycache__",
    "coverage",
    ".next",
    ".cache",
    ".output",
    "target",
    "bin",
    "obj"
}


def is_vendor_path(path_str: str) -> bool:
    """Checks if a path belongs to an ignored or vendor directory."""
    normalized = path_str.replace("\\", "/").strip().lstrip("/")
    parts = normalized.split("/")
    for p in parts:
        if p.lower() in IGNORED_DIRS or p.startswith("."):
            if p not in {".github", ".gitignore"}:
                return True
    return False


def count_lines_safe(file_path: str) -> int:
    """Safely counts lines in a text file without loading the entire file into memory."""
    try:
        count = 0
        with open(file_path, "rb") as f:
            for line in f:
                count += 1
        return count
    except Exception:
        return 0


def read_content_sample(file_path: str, max_lines: int = 200, max_bytes: int = 65536) -> str:
    """Safely reads a snippet of the file content for dependency extraction and preview."""
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = []
            total_bytes = 0
            for line in f:
                total_bytes += len(line)
                lines.append(line)
                if len(lines) >= max_lines or total_bytes >= max_bytes:
                    break
            return "".join(lines)
    except Exception:
        return ""


async def scan_local_repository(root_dir: str) -> List[Dict[str, Any]]:
    """
    Recursively scans a local filesystem directory.
    Returns a list of file metadata dictionaries.
    """
    files: List[Dict[str, Any]] = []
    root_norm = os.path.abspath(root_dir)

    for dirpath, dirnames, filenames in os.walk(root_norm):
        # Prune ignored directories in-place
        dirnames[:] = [d for d in dirnames if d.lower() not in IGNORED_DIRS and not (d.startswith(".") and d != ".github")]

        rel_dir = os.path.relpath(dirpath, root_norm).replace("\\", "/")
        if rel_dir == ".":
            rel_dir = ""

        if rel_dir and is_vendor_path(rel_dir):
            continue

        for filename in filenames:
            rel_path = f"{rel_dir}/{filename}".lstrip("/") if rel_dir else filename

            if is_vendor_path(rel_path):
                continue

            abs_path = os.path.join(dirpath, filename)
            try:
                stat = os.stat(abs_path)
                size_bytes = stat.st_size
            except Exception:
                size_bytes = 0

            lang_meta = detect_language(rel_path)
            class_meta = classify_file(rel_path)

            lines_count = 0
            content = ""
            if not class_meta["is_sensitive"] and size_bytes < 1_500_000:
                # Only read line counts and content for non-sensitive, manageable files
                lines_count = count_lines_safe(abs_path)
                if lang_meta["is_code"] or class_meta["is_manifest"]:
                    content = read_content_sample(abs_path)

            files.append({
                "path": rel_path,
                "name": filename,
                "size": size_bytes,
                "lines": lines_count,
                "language": lang_meta["language"],
                "language_color": lang_meta["color"],
                "extension": lang_meta["extension"],
                "is_code": lang_meta["is_code"],
                "category": class_meta["category"],
                "role": class_meta["role"],
                "is_entry_point": class_meta["is_entry_point"],
                "is_manifest": class_meta["is_manifest"],
                "is_sensitive": class_meta["is_sensitive"],
                "content": content
            })

    return sorted(files, key=lambda f: f["path"])


async def scan_github_repository(
    owner: str,
    repo: str,
    default_branch: str = "main",
    token: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Recursively scans a remote GitHub repository using the Git Trees API.
    Fetches actual file paths, sizes, and downloads manifest/entry-point samples.
    """
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "SycnOps-AI/2.0"
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1"

    async with httpx.AsyncClient(timeout=15.0) as client:
        res = await client.get(tree_url, headers=headers)
        if res.status_code == 401 and "Authorization" in headers:
            # Token might be invalid or expired; try unauthenticated access for public repos
            headers.pop("Authorization", None)
            res = await client.get(tree_url, headers=headers)

        if res.status_code != 200:
            # Try 'master' branch fallback if 'main' returns 404
            if res.status_code == 404 and default_branch == "main":
                tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/master?recursive=1"
                res = await client.get(tree_url, headers=headers)

        if res.status_code != 200:
            if res.status_code == 403:
                try:
                    err_msg = res.json().get("message", "")
                    if "rate limit" in err_msg.lower():
                        raise RuntimeError("GitHub API rate limit exceeded. Please add a valid GITHUB_TOKEN in backend/.env to increase rate limits to 5,000 requests/hour.")
                except RuntimeError:
                    raise
                except Exception:
                    pass
                raise RuntimeError(f"GitHub access forbidden (HTTP 403) for '{owner}/{repo}'. Check repository permissions or token.")
            elif res.status_code == 404:
                raise RuntimeError(f"GitHub repository '{owner}/{repo}' or branch '{default_branch}' was not found.")
            elif res.status_code == 401:
                raise RuntimeError(f"GitHub authentication failed (HTTP 401) for '{owner}/{repo}'.")
            raise RuntimeError(f"GitHub Git Tree API returned status {res.status_code}")

        data = res.json()
        tree_items = data.get("tree", [])

        files: List[Dict[str, Any]] = []

        # Collect blobs (files)
        blobs = [item for item in tree_items if item.get("type") == "blob"]

        for item in blobs:
            path_str = item.get("path", "")
            if is_vendor_path(path_str):
                continue

            filename = path_str.split("/")[-1]
            size_bytes = item.get("size", 0)

            lang_meta = detect_language(path_str)
            class_meta = classify_file(path_str)

            # Heuristic line estimate if size is known (approx 35 bytes/line)
            estimated_lines = max(1, int(size_bytes / 35)) if size_bytes > 0 else 0

            files.append({
                "path": path_str,
                "name": filename,
                "size": size_bytes,
                "lines": estimated_lines,
                "language": lang_meta["language"],
                "language_color": lang_meta["color"],
                "extension": lang_meta["extension"],
                "is_code": lang_meta["is_code"],
                "category": class_meta["category"],
                "role": class_meta["role"],
                "is_entry_point": class_meta["is_entry_point"],
                "is_manifest": class_meta["is_manifest"],
                "is_sensitive": class_meta["is_sensitive"],
                "content": "",
                "sha": item.get("sha", "")
            })

        # Fetch key files (manifests, package.json, requirements.txt, entry files) for real dependency analysis
        key_files = [
            f for f in files
            if (f["is_manifest"] or f["is_entry_point"] or f["name"] in {"README.md", "index.ts", "index.js", "main.py"})
            and not f["is_sensitive"]
        ][:15]

        for kf in key_files:
            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/{kf['path']}"
            try:
                content_res = await client.get(raw_url, headers=headers)
                if content_res.status_code == 200:
                    kf["content"] = content_res.text[:40000]
                    actual_lines = len(content_res.text.splitlines())
                    kf["lines"] = actual_lines
            except Exception:
                pass

        return sorted(files, key=lambda f: f["path"])


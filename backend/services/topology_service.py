"""
topology_service.py

High-level orchestrator service for repository File Topology.
Integrates scanning, classification, dependency extraction, graph generation,
and database persistence with caching.
"""

import os
from typing import Any

from .repo_scanner import scan_github_repository, scan_local_repository
from .topology_graph_generator import generate_topology
from .topology_storage import get_topology, save_topology

# Root directory of the repository workspace
WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))


async def run_topology_analysis(
    repo_meta: dict[str, Any] | None,
    user_id: str,
    project_id: str,
    token: str | None = None,
    force_rescan: bool = False
) -> dict[str, Any]:
    """
    Performs full topology analysis on a repository (GitHub or local workspace)
    and saves the results into MongoDB / Firestore / cache.
    """
    # Check cache if not forcing rescan
    if not force_rescan:
        cached = get_topology(project_id, user_id)
        if cached:
            return cached

    repo_name = "SycnOps Workspace"
    commit_sha = ""
    files: list[dict[str, Any]] = []

    # Determine if this is a GitHub repository
    if repo_meta and repo_meta.get("source") == "github" and repo_meta.get("owner") and repo_meta.get("name"):
        owner = repo_meta["owner"]
        name = repo_meta["name"]
        repo_name = repo_meta.get("fullName") or f"{owner}/{name}"
        branch = repo_meta.get("defaultBranch") or "main"
        gh_token = token or repo_meta.get("githubToken") or os.getenv("GITHUB_TOKEN")
        commit_sha = (repo_meta.get("commits") or [{}])[0].get("id", "")

        files = await scan_github_repository(owner, name, branch, gh_token)
    else:
        # Fall back to scanning the local project directory
        repo_name = (repo_meta.get("name") if repo_meta else None) or "SycnOps Platform"
        files = await scan_local_repository(WORKSPACE_ROOT)

    # Generate hierarchical tree, React Flow nodes, edges, and dependencies
    topology_result = generate_topology(files, repo_name)

    # Persist results
    repo_id = str(repo_meta.get("id")) if (repo_meta and repo_meta.get("id")) else project_id
    saved = save_topology(
        project_id=project_id,
        user_id=user_id,
        repository_id=repo_id,
        topology_data=topology_result,
        commit_sha=commit_sha
    )

    return saved


def get_topology_tree_data(project_id: str, user_id: str) -> dict[str, Any] | None:
    """Retrieves only the hierarchical folder tree."""
    doc = get_topology(project_id, user_id)
    if not doc:
        return None
    return {
        "projectId": project_id,
        "analysisId": doc.get("analysisId"),
        "scanTimestamp": doc.get("scanTimestamp"),
        "summary": doc.get("summary", {}),
        "tree": doc.get("tree", {})
    }


def get_topology_dependencies_data(project_id: str, user_id: str) -> dict[str, Any] | None:
    """Retrieves dependencies, circular loops, and graph edges."""
    doc = get_topology(project_id, user_id)
    if not doc:
        return None
    summary = doc.get("summary", {})
    return {
        "projectId": project_id,
        "analysisId": doc.get("analysisId"),
        "scanTimestamp": doc.get("scanTimestamp"),
        "circularDependencies": summary.get("circularDependencies", []),
        "circularFilesCount": summary.get("circularFilesCount", 0),
        "manifests": summary.get("manifests", []),
        "edges": doc.get("edges", []),
        "totalEdges": len(doc.get("edges", []))
    }


def get_topology_file_metadata(project_id: str, file_id: str, user_id: str) -> dict[str, Any] | None:
    """Retrieves detailed file metadata, imports, exports, and dependency degree."""
    doc = get_topology(project_id, user_id)
    if not doc:
        return None

    files = doc.get("files", [])
    nodes = doc.get("nodes", [])

    # Match by fileId or path
    matched_file = None
    for f in files:
        if f["path"] == file_id or f["path"].endswith(file_id) or f["name"] == file_id:
            matched_file = f
            break

    matched_node = None
    for n in nodes:
        if n["id"] == file_id or n.get("data", {}).get("path") == file_id:
            matched_node = n
            break

    if not matched_file and not matched_node:
        return None

    data = matched_node["data"] if matched_node else matched_file

    # Find incoming dependencies (who imports this file)
    edges = doc.get("edges", [])
    incoming = []
    outgoing = []

    target_path = data.get("path") or file_id
    for e in edges:
        edge_data = e.get("data", {})
        if edge_data.get("targetPath") == target_path:
            incoming.append(edge_data.get("sourcePath"))
        if edge_data.get("sourcePath") == target_path:
            outgoing.append(edge_data.get("targetPath"))

    return {
        "projectId": project_id,
        "file": data,
        "incomingDependencies": sorted(list(set(incoming))),
        "outgoingDependencies": sorted(list(set(outgoing))),
        "inDegree": len(incoming),
        "outDegree": len(outgoing)
    }


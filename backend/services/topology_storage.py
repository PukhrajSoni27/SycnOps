"""
topology_storage.py

Persistence layer for File Topology analysis results.
Integrates with MongoDB Atlas (if MONGODB_URI is configured),
Firebase Firestore (collection `file_topology`), and local disk cache fallback.
"""

import json
import os
import time
from datetime import UTC, datetime
from typing import Any

# In-memory session cache for rapid lookups
_IN_MEMORY_TOPOLOGY: dict[str, dict[str, Any]] = {}

CACHE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_FILE = os.path.join(CACHE_DIR, ".topology_cache.json")


def _get_mongo_collection():
    """Returns MongoDB file_topology collection if MONGODB_URI is configured, else None."""
    mongo_uri = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")
    if not mongo_uri:
        return None
    try:
        from pymongo import MongoClient
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
        db_name = os.getenv("MONGODB_DB", "syncops")
        db = client[db_name]
        col = db["file_topology"]
        col.create_index([("projectId", 1), ("userId", 1)])
        return col
    except Exception as err:
        print(f"MongoDB connection notice: {err} — using Firestore/disk fallback.")
        return None


def _get_firestore_db():
    """Returns Firebase Firestore client if initialized."""
    try:
        import firebase_admin
        from firebase_admin import firestore
        if firebase_admin._apps:
            return firestore.client()
    except Exception:
        pass
    return None


def _load_disk_cache() -> dict[str, Any]:
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def _save_disk_cache(data: dict[str, Any]) -> None:
    try:
        existing = _load_disk_cache()
        existing.update(data)
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(existing, f, indent=2)
    except Exception as err:
        print(f"Disk cache write notice: {err}")


def save_topology(
    project_id: str,
    user_id: str,
    repository_id: str,
    topology_data: dict[str, Any],
    commit_sha: str = ""
) -> dict[str, Any]:
    """
    Persists topology analysis results with projectId, analysisId, and timestamps.
    """
    analysis_id = f"topo_{int(time.time() * 1000)}"
    timestamp = datetime.now(UTC).isoformat()

    doc = {
        "projectId": project_id,
        "repositoryId": str(repository_id),
        "analysisId": analysis_id,
        "userId": str(user_id),
        "scanTimestamp": timestamp,
        "commitSha": commit_sha,
        "summary": topology_data.get("summary", {}),
        "tree": topology_data.get("tree", {}),
        "nodes": topology_data.get("nodes", []),
        "edges": topology_data.get("edges", []),
        "files": topology_data.get("files", [])
    }

    cache_key = f"{user_id}:{project_id}"
    _IN_MEMORY_TOPOLOGY[cache_key] = doc
    _save_disk_cache({cache_key: doc, project_id: doc})

    # 1. MongoDB Atlas persistence
    col = _get_mongo_collection()
    if col is not None:
        try:
            col.update_one(
                {"projectId": project_id, "userId": str(user_id)},
                {"$set": doc},
                upsert=True
            )
        except Exception as err:
            print(f"MongoDB save notice: {err}")

    # 2. Firebase Firestore persistence
    fs_db = _get_firestore_db()
    if fs_db is not None:
        try:
            doc_id = f"{user_id}_{project_id}".replace("/", "_")
            fs_db.collection("file_topology").document(doc_id).set({
                "projectId": project_id,
                "repositoryId": str(repository_id),
                "analysisId": analysis_id,
                "userId": str(user_id),
                "scanTimestamp": timestamp,
                "summary": doc["summary"],
                "nodeCount": len(doc["nodes"]),
                "edgeCount": len(doc["edges"]),
                "fileCount": len(doc["files"])
            })
        except Exception as err:
            print(f"Firestore topology log notice: {err}")

    return doc


def get_topology(project_id: str, user_id: str = "") -> dict[str, Any] | None:
    """
    Retrieves topology analysis by projectId and optional userId.
    """
    cache_key = f"{user_id}:{project_id}" if user_id else project_id
    if cache_key in _IN_MEMORY_TOPOLOGY:
        return _IN_MEMORY_TOPOLOGY[cache_key]
    if project_id in _IN_MEMORY_TOPOLOGY:
        return _IN_MEMORY_TOPOLOGY[project_id]

    # Try MongoDB
    col = _get_mongo_collection()
    if col is not None:
        try:
            query = {"projectId": project_id}
            if user_id:
                query["userId"] = str(user_id)
            res = col.find_one(query, {"_id": 0})
            if res:
                _IN_MEMORY_TOPOLOGY[cache_key] = res
                return res
        except Exception:
            pass

    # Try disk cache
    disk = _load_disk_cache()
    if cache_key in disk:
        _IN_MEMORY_TOPOLOGY[cache_key] = disk[cache_key]
        return disk[cache_key]
    if project_id in disk:
        _IN_MEMORY_TOPOLOGY[project_id] = disk[project_id]
        return disk[project_id]

    return None


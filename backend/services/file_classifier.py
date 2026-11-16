"""
file_classifier.py

Classifies repository files into architectural layers, identifies entry points,
dependency manifests, and flags sensitive/configuration files.
"""

import re
from typing import Dict, Any

ENTRY_POINTS = {
    # Frontend entry points
    "main.tsx", "main.jsx", "index.tsx", "index.jsx", "app.tsx", "app.jsx", "index.html",
    # Backend entry points
    "main.py", "app.py", "index.js", "server.js", "app.js", "server.ts", "index.ts"
}

DEPENDENCY_MANIFESTS = {
    "package.json", "requirements.txt", "pyproject.toml", "pipfile",
    "go.mod", "cargo.toml", "pom.xml", "build.gradle", "gemfile"
}

SENSITIVE_PATTERNS = [
    r"^\.env(\..+)?$",
    r".*\.pem$",
    r".*\.key$",
    r".*serviceaccount.*\.json$",
    r".*secret.*",
    r".*credentials.*"
]


def is_sensitive_file(filename: str) -> bool:
    """Checks if a file name or path matches known secret/credential patterns."""
    lower = filename.lower()
    return any(re.match(pattern, lower) for pattern in SENSITIVE_PATTERNS)


def classify_file(file_path: str) -> Dict[str, Any]:
    """
    Classifies a file path into an architectural layer and extracts role metadata.
    """
    if not file_path:
        return {
            "category": "utilities",
            "is_entry_point": False,
            "is_manifest": False,
            "is_sensitive": False,
            "role": "General File"
        }

    normalized = file_path.replace("\\", "/").strip().lstrip("/")
    parts = normalized.lower().split("/")
    filename = parts[-1]
    ext = ("." + filename.split(".")[-1]) if "." in filename else ""

    is_sensitive = is_sensitive_file(filename)
    is_manifest = filename in DEPENDENCY_MANIFESTS
    is_entry = filename in ENTRY_POINTS

    # Check documentation first
    if filename in {"readme.md", "license", "contributing.md", "changelog.md"} or any(p in {"docs", "doc"} for p in parts) or ext in {".md", ".markdown"}:
        return {
            "category": "documentation",
            "is_entry_point": False,
            "is_manifest": False,
            "is_sensitive": is_sensitive,
            "role": "Documentation"
        }

    # Configuration and manifests
    if is_manifest or filename.startswith((".git", "tsconfig", "vite.config", "webpack", "eslint", "tailwind", "postcss", "babel", "jest", "next.config")) or filename in {"dockerfile", "docker-compose.yml", "docker-compose.yaml", ".gitignore"}:
        return {
            "category": "configuration",
            "is_entry_point": False,
            "is_manifest": is_manifest,
            "is_sensitive": is_sensitive,
            "role": "Project Manifest / Config" if is_manifest else "Build & Environment Config"
        }

    # Database / Models / Migrations
    if any(p in {"models", "schemas", "entities", "migrations", "db", "database", "prisma"} for p in parts) or any(k in filename for k in ["model", "schema", "migration", "firestore", "mongo", "postgres", "sqlite", "mysql"]):
        return {
            "category": "database",
            "is_entry_point": False,
            "is_manifest": False,
            "is_sensitive": is_sensitive,
            "role": "Database Schema / Model"
        }

    # Components
    if any(p in {"components", "widgets", "ui", "atoms", "molecules", "organisms", "views"} for p in parts):
        return {
            "category": "components",
            "is_entry_point": False,
            "is_manifest": False,
            "is_sensitive": is_sensitive,
            "role": "UI Component"
        }

    # Middleware
    if any(p in {"middleware", "middlewares", "interceptors", "guards"} for p in parts):
        return {
            "category": "middleware",
            "is_entry_point": False,
            "is_manifest": False,
            "is_sensitive": is_sensitive,
            "role": "Middleware / Interceptor"
        }

    # Utilities & helpers
    if any(p in {"utils", "util", "helpers", "helper", "lib", "common", "shared"} for p in parts):
        return {
            "category": "utilities",
            "is_entry_point": False,
            "is_manifest": False,
            "is_sensitive": is_sensitive,
            "role": "Utility / Helper Library"
        }

    # Frontend
    if parts[0] in {"frontend", "client", "web", "app"} or any(p in {"pages", "styles", "assets", "hooks"} for p in parts) or ext in {".tsx", ".jsx", ".vue", ".svelte", ".html", ".css", ".scss"}:
        return {
            "category": "frontend",
            "is_entry_point": is_entry,
            "is_manifest": False,
            "is_sensitive": is_sensitive,
            "role": "Frontend Entry" if is_entry else "Frontend View / Logic"
        }

    # Backend
    if parts[0] in {"backend", "server", "api"} or any(p in {"controllers", "routes", "services", "handlers"} for p in parts) or ext in {".py", ".go", ".rs", ".java", ".php"}:
        return {
            "category": "backend",
            "is_entry_point": is_entry,
            "is_manifest": False,
            "is_sensitive": is_sensitive,
            "role": "Backend Server Entry" if is_entry else "Backend Service / Endpoint"
        }

    return {
        "category": "utilities",
        "is_entry_point": is_entry,
        "is_manifest": False,
        "is_sensitive": is_sensitive,
        "role": "Source File"
    }


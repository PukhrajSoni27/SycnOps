"""
language_detector.py

Detects programming languages and file types for repository files.
Maps file extensions, filenames, and special patterns to clean language metadata.
"""

from typing import Dict, Any

LANGUAGE_MAP: Dict[str, Dict[str, Any]] = {
    ".ts": {"language": "TypeScript", "is_code": True, "color": "#3178C6"},
    ".tsx": {"language": "TypeScript (React)", "is_code": True, "color": "#2D79C7"},
    ".js": {"language": "JavaScript", "is_code": True, "color": "#F7DF1E"},
    ".jsx": {"language": "JavaScript (React)", "is_code": True, "color": "#E5A00D"},
    ".mjs": {"language": "JavaScript", "is_code": True, "color": "#F7DF1E"},
    ".cjs": {"language": "JavaScript", "is_code": True, "color": "#F7DF1E"},
    ".py": {"language": "Python", "is_code": True, "color": "#3572A5"},
    ".pyi": {"language": "Python", "is_code": True, "color": "#3572A5"},
    ".ipynb": {"language": "Jupyter Notebook", "is_code": True, "color": "#DA5B0B"},
    ".html": {"language": "HTML", "is_code": True, "color": "#E34F26"},
    ".htm": {"language": "HTML", "is_code": True, "color": "#E34F26"},
    ".css": {"language": "CSS", "is_code": True, "color": "#563D7C"},
    ".scss": {"language": "SCSS", "is_code": True, "color": "#C6538C"},
    ".sass": {"language": "SASS", "is_code": True, "color": "#A53B70"},
    ".less": {"language": "Less", "is_code": True, "color": "#1D365D"},
    ".json": {"language": "JSON", "is_code": False, "color": "#CBCB41"},
    ".md": {"language": "Markdown", "is_code": False, "color": "#083FA1"},
    ".markdown": {"language": "Markdown", "is_code": False, "color": "#083FA1"},
    ".yaml": {"language": "YAML", "is_code": False, "color": "#CB171E"},
    ".yml": {"language": "YAML", "is_code": False, "color": "#CB171E"},
    ".sql": {"language": "SQL", "is_code": True, "color": "#E38C00"},
    ".sh": {"language": "Shell", "is_code": True, "color": "#89E051"},
    ".bash": {"language": "Shell", "is_code": True, "color": "#89E051"},
    ".zsh": {"language": "Shell", "is_code": True, "color": "#89E051"},
    ".ps1": {"language": "PowerShell", "is_code": True, "color": "#012456"},
    ".go": {"language": "Go", "is_code": True, "color": "#00ADD8"},
    ".rs": {"language": "Rust", "is_code": True, "color": "#DEA584"},
    ".java": {"language": "Java", "is_code": True, "color": "#B07219"},
    ".c": {"language": "C", "is_code": True, "color": "#555555"},
    ".cpp": {"language": "C++", "is_code": True, "color": "#F34B7D"},
    ".h": {"language": "C/C++ Header", "is_code": True, "color": "#F34B7D"},
    ".hpp": {"language": "C++ Header", "is_code": True, "color": "#F34B7D"},
    ".rb": {"language": "Ruby", "is_code": True, "color": "#701516"},
    ".php": {"language": "PHP", "is_code": True, "color": "#4F5D95"},
    ".toml": {"language": "TOML", "is_code": False, "color": "#9C4221"},
    ".xml": {"language": "XML", "is_code": False, "color": "#0060AC"},
    ".svg": {"language": "SVG", "is_code": False, "color": "#FF9900"},
    ".graphql": {"language": "GraphQL", "is_code": True, "color": "#E10098"},
    ".gql": {"language": "GraphQL", "is_code": True, "color": "#E10098"},
    ".proto": {"language": "Protocol Buffers", "is_code": True, "color": "#4F8C9D"},
}

EXACT_FILENAME_MAP: Dict[str, Dict[str, Any]] = {
    "dockerfile": {"language": "Docker", "is_code": True, "color": "#384D54"},
    "docker-compose.yml": {"language": "Docker Compose", "is_code": False, "color": "#384D54"},
    "docker-compose.yaml": {"language": "Docker Compose", "is_code": False, "color": "#384D54"},
    "makefile": {"language": "Makefile", "is_code": True, "color": "#427819"},
    ".gitignore": {"language": "Git Config", "is_code": False, "color": "#F05032"},
    "package.json": {"language": "NPM Manifest", "is_code": False, "color": "#CB3837"},
    "requirements.txt": {"language": "Python Requirements", "is_code": False, "color": "#3572A5"},
    "pyproject.toml": {"language": "Python Project Config", "is_code": False, "color": "#3572A5"},
    "tsconfig.json": {"language": "TypeScript Config", "is_code": False, "color": "#3178C6"},
}


def detect_language(file_path: str) -> Dict[str, Any]:
    """
    Detects language, code status, and color for a given file path.
    """
    if not file_path:
        return {"language": "Unknown", "extension": "", "is_code": False, "color": "#78716C"}

    normalized = file_path.replace("\\", "/").strip()
    filename = normalized.split("/")[-1].lower()

    if filename in EXACT_FILENAME_MAP:
        meta = EXACT_FILENAME_MAP[filename]
        ext = "." + filename.split(".")[-1] if "." in filename else ""
        return {
            "language": meta["language"],
            "extension": ext,
            "is_code": meta["is_code"],
            "color": meta["color"],
        }

    dot_index = filename.rfind(".")
    if dot_index != -1:
        ext = filename[dot_index:]
        if ext in LANGUAGE_MAP:
            meta = LANGUAGE_MAP[ext]
            return {
                "language": meta["language"],
                "extension": ext,
                "is_code": meta["is_code"],
                "color": meta["color"],
            }
        return {
            "language": ext.upper().replace(".", "") or "Other",
            "extension": ext,
            "is_code": False,
            "color": "#78716C",
        }

    return {
        "language": "Text",
        "extension": "",
        "is_code": False,
        "color": "#78716C",
    }


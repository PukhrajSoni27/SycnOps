"""
dependency_extractor.py

Extracts imports, exports, and internal module dependency graphs from source files.
Resolves relative and aliased import specifiers to real repository file paths.
Performs Tarjan's SCC / DFS cycle detection to detect circular dependency loops.
"""

import posixpath
import re
from typing import Any

# Regex patterns for JavaScript / TypeScript imports and exports
JS_IMPORT_PATTERNS = [
    # import ... from 'specifier'
    re.compile(r"""(?:import\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"])"""),
    # import 'specifier'
    re.compile(r"""(?:import\s+['"]([^'"]+)['"])"""),
    # require('specifier')
    re.compile(r"""(?:require\s*\(\s*['"]([^'"]+)['"]\s*\))"""),
    # import('specifier')
    re.compile(r"""(?:import\s*\(\s*['"]([^'"]+)['"]\s*\))"""),
]

JS_EXPORT_PATTERNS = [
    re.compile(r"""export\s+default\s+(?:function|class|const|let|var)?\s*([a-zA-Z0-9_$]+)?"""),
    re.compile(r"""export\s+(?:const|let|var|function|class|interface|type|enum)\s+([a-zA-Z0-9_$]+)"""),
    re.compile(r"""export\s*\{([^}]+)\}"""),
    re.compile(r"""export\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]"""),
]

# Regex patterns for Python imports
PY_IMPORT_PATTERNS = [
    re.compile(r"""^\s*from\s+([a-zA-Z0-9_.]+)\s+import""", re.MULTILINE),
    re.compile(r"""^\s*import\s+([a-zA-Z0-9_.]+)""", re.MULTILINE),
]


def normalize_path(p: str) -> str:
    """Normalizes path to forward slashes with no leading/trailing slashes."""
    return p.replace("\\", "/").strip().strip("/")


def resolve_import_path(source_file: str, specifier: str, known_files: set[str]) -> tuple[str, bool]:
    """
    Resolves an import specifier from source_file against the known project files.
    Returns (resolved_path, is_external).
    """
    spec = specifier.strip()
    if not spec:
        return ("", True)

    # External library packages (e.g. 'react', 'express', 'lucide-react', 'os', 'fastapi')
    if not (spec.startswith(".") or spec.startswith("/") or spec.startswith("@/")):
        return (spec, True)

    source_dir = posixpath.dirname(normalize_path(source_file))

    # Handle alias @/ -> resolve to frontend/src/ or src/
    if spec.startswith("@/"):
        rel_spec = spec[2:]
        candidates = [
            f"frontend/src/{rel_spec}",
            f"src/{rel_spec}",
            rel_spec,
        ]
    else:
        # Relative path ./ or ../
        base = posixpath.normpath(posixpath.join(source_dir, spec))
        candidates = [base]

    possible_extensions = ["", ".ts", ".tsx", ".js", ".jsx", ".py", ".json", ".css"]
    index_files = ["/index.ts", "/index.tsx", "/index.js", "/index.jsx", "/__init__.py"]

    # Try resolving candidate paths
    for cand in candidates:
        cand_clean = cand.lstrip("/")
        # Direct extension match
        for ext in possible_extensions:
            probe = cand_clean + ext
            if probe in known_files:
                return (probe, False)

        # Index resolution
        for idx in index_files:
            probe = cand_clean + idx
            if probe in known_files:
                return (probe, False)

    # If unresolved but relative, return the cleaned relative path
    unresolved_target = candidates[0].lstrip("/")
    return (unresolved_target, False)


def extract_imports_and_exports(file_path: str, content: str, known_files: set[str]) -> dict[str, Any]:
    """
    Parses file content to extract imports, exports, and internal dependencies.
    """
    norm_path = normalize_path(file_path)
    lower = norm_path.lower()

    internal_deps: set[str] = set()
    external_deps: set[str] = set()
    exports: set[str] = set()

    if not content:
        return {
            "internal_dependencies": [],
            "external_dependencies": [],
            "exports": []
        }

    is_js_ts = any(lower.endswith(ext) for ext in [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"])
    is_py = any(lower.endswith(ext) for ext in [".py", ".pyi"])

    if is_js_ts:
        # Extract imports
        for pat in JS_IMPORT_PATTERNS:
            for match in pat.finditer(content):
                spec = match.group(1)
                resolved, is_ext = resolve_import_path(norm_path, spec, known_files)
                if is_ext:
                    external_deps.add(resolved)
                elif resolved and resolved != norm_path:
                    internal_deps.add(resolved)

        # Extract exports
        for pat in JS_EXPORT_PATTERNS:
            for match in pat.finditer(content):
                g = match.group(1)
                if g:
                    if "{" in g or "," in g:
                        parts = [p.strip().split(" as ")[-1].strip() for p in g.split(",") if p.strip()]
                        exports.update(parts)
                    else:
                        exports.add(g.strip())

    elif is_py:
        # Extract Python imports
        for pat in PY_IMPORT_PATTERNS:
            for match in pat.finditer(content):
                mod = match.group(1).strip()
                # Check if it corresponds to an internal module
                mod_path = mod.replace(".", "/")
                resolved, is_ext = resolve_import_path(norm_path, mod_path, known_files)
                if is_ext:
                    top_pkg = mod.split(".")[0]
                    external_deps.add(top_pkg)
                elif resolved and resolved != norm_path:
                    internal_deps.add(resolved)

        # Extract functions/classes as exports
        for match in re.finditer(r"^(?:def|class)\s+([a-zA-Z0-9_]+)", content, re.MULTILINE):
            name = match.group(1)
            if not name.startswith("_"):
                exports.add(name)

    return {
        "internal_dependencies": sorted(list(internal_deps)),
        "external_dependencies": sorted(list(external_deps)),
        "exports": sorted(list(exports))
    }


def find_circular_dependencies(adj_list: dict[str, list[str]]) -> list[list[str]]:
    """
    Detects circular dependency cycles using Depth-First Search (DFS) with path tracking.
    Returns a list of cycles, e.g. [['a.ts', 'b.ts', 'a.ts']].
    """
    visited: set[str] = set()
    rec_stack: list[str] = []
    cycles: list[list[str]] = []
    seen_cycle_fingerprints: set[tuple[str, ...]] = set()

    def dfs(node: str):
        visited.add(node)
        rec_stack.append(node)

        for neighbor in adj_list.get(node, []):
            if neighbor not in visited:
                dfs(neighbor)
            elif neighbor in rec_stack:
                # Found a cycle!
                cycle_start_index = rec_stack.index(neighbor)
                cycle = rec_stack[cycle_start_index:] + [neighbor]

                # Create normalized fingerprint to avoid duplicate representations
                cycle_nodes = cycle[:-1]
                if len(cycle_nodes) > 1:
                    min_idx = cycle_nodes.index(min(cycle_nodes))
                    fingerprint = tuple(cycle_nodes[min_idx:] + cycle_nodes[:min_idx])
                    if fingerprint not in seen_cycle_fingerprints:
                        seen_cycle_fingerprints.add(fingerprint)
                        cycles.append(cycle)

        rec_stack.pop()

    for n in list(adj_list.keys()):
        if n not in visited:
            dfs(n)

    return cycles


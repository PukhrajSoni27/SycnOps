"""
topology_graph_generator.py

Constructs the Hierarchical Repository Tree and React Flow Architecture Graph
from scanned files and extracted dependencies.
Generates comprehensive summary metrics, language breakdowns, and layout coordinates.
"""

import hashlib
from typing import Any

from .dependency_extractor import (
    extract_imports_and_exports,
    find_circular_dependencies,
)


def sanitize_id(path_str: str) -> str:
    """Creates a deterministic alphanumeric node ID from a file path."""
    clean = path_str.replace("/", "_").replace(".", "_").replace("-", "_")
    digest = hashlib.md5(path_str.encode("utf-8")).hexdigest()[:8]
    return f"node_{clean}_{digest}"


def build_hierarchical_tree(files: list[dict[str, Any]], repo_name: str) -> dict[str, Any]:
    """
    Constructs a nested tree of folders and files from a flat file list.
    Calculates cumulative line counts and sizes for every directory level.
    """
    root: dict[str, Any] = {
        "id": "root",
        "name": repo_name or "Repository",
        "path": "",
        "isDirectory": True,
        "children": {},
        "fileCount": 0,
        "folderCount": 0,
        "totalLines": 0,
        "totalSize": 0,
    }

    for f in files:
        path_parts = f["path"].split("/")
        curr = root

        for idx, part in enumerate(path_parts):
            is_file = (idx == len(path_parts) - 1)
            curr_path = "/".join(path_parts[:idx + 1])

            if part not in curr["children"]:
                if is_file:
                    curr["children"][part] = {
                        "id": sanitize_id(f["path"]),
                        "name": part,
                        "path": f["path"],
                        "isDirectory": False,
                        "extension": f.get("extension", ""),
                        "language": f.get("language", "Text"),
                        "languageColor": f.get("language_color", "#78716C"),
                        "category": f.get("category", "utilities"),
                        "role": f.get("role", "Source File"),
                        "sizeBytes": f.get("size", 0),
                        "linesCount": f.get("lines", 0),
                        "isEntryPoint": f.get("is_entry_point", False),
                        "isManifest": f.get("is_manifest", False),
                        "isSensitive": f.get("is_sensitive", False),
                        "inDegree": f.get("inDegree", 0),
                        "outDegree": f.get("outDegree", 0),
                        "hasCircularDep": f.get("hasCircularDep", False),
                        "imports": f.get("imports", []),
                        "exports": f.get("exports", [])
                    }
                else:
                    curr["children"][part] = {
                        "id": sanitize_id(curr_path),
                        "name": part,
                        "path": curr_path,
                        "isDirectory": True,
                        "children": {},
                        "fileCount": 0,
                        "folderCount": 0,
                        "totalLines": 0,
                        "totalSize": 0,
                    }

            curr = curr["children"][part]

    # Recursive post-processing to compute cumulative stats and convert children dicts to sorted lists
    def compute_stats(node: dict[str, Any]) -> tuple[int, int, int, int]:
        if not node.get("isDirectory"):
            return (1, 0, node.get("linesCount", 0), node.get("sizeBytes", 0))

        file_count = 0
        folder_count = 0
        total_lines = 0
        total_size = 0

        sorted_children = []
        # Sort folders first alphabetically, then files alphabetically
        raw_children = list(node["children"].values())
        raw_children.sort(key=lambda c: (0 if c.get("isDirectory") else 1, c["name"].lower()))

        for child in raw_children:
            fc, dc, lines, size = compute_stats(child)
            file_count += fc
            folder_count += (1 if child.get("isDirectory") else 0) + dc
            total_lines += lines
            total_size += size
            sorted_children.append(child)

        node["children"] = sorted_children
        node["fileCount"] = file_count
        node["folderCount"] = folder_count
        node["totalLines"] = total_lines
        node["totalSize"] = total_size

        return (file_count, folder_count, total_lines, total_size)

    compute_stats(root)
    return root


def generate_topology(files: list[dict[str, Any]], repo_name: str) -> dict[str, Any]:
    """
    Main generator: extracts dependencies, resolves cycles, builds hierarchical tree,
    and generates React Flow graph nodes and edges.
    """
    known_files = {f["path"] for f in files}
    files_by_path: dict[str, dict[str, Any]] = {f["path"]: f for f in files}

    # 1. Extract imports and exports
    adj_list: dict[str, list[str]] = {}
    in_degrees: dict[str, int] = {f["path"]: 0 for f in files}

    for f in files:
        path = f["path"]
        content = f.get("content", "")
        extracted = extract_imports_and_exports(path, content, known_files)

        f["imports"] = extracted["internal_dependencies"]
        f["external_dependencies"] = extracted["external_dependencies"]
        f["exports"] = extracted["exports"]
        f["outDegree"] = len(extracted["internal_dependencies"])

        adj_list[path] = extracted["internal_dependencies"]

        for target in extracted["internal_dependencies"]:
            if target in in_degrees:
                in_degrees[target] += 1

    for f in files:
        f["inDegree"] = in_degrees.get(f["path"], 0)

    # 2. Cycle detection
    circular_cycles = find_circular_dependencies(adj_list)
    circular_file_set: set[str] = set()
    for cyc in circular_cycles:
        circular_file_set.update(cyc)

    for f in files:
        f["hasCircularDep"] = f["path"] in circular_file_set

    # 3. Build summary statistics
    total_files = len(files)
    total_lines = sum(f.get("lines", 0) for f in files)
    total_size = sum(f.get("size", 0) for f in files)

    languages_stats: dict[str, dict[str, Any]] = {}
    categories_stats: dict[str, int] = {}

    for f in files:
        lang = f.get("language", "Other")
        if lang not in languages_stats:
            languages_stats[lang] = {"count": 0, "lines": 0, "color": f.get("language_color", "#78716C")}
        languages_stats[lang]["count"] += 1
        languages_stats[lang]["lines"] += f.get("lines", 0)

        cat = f.get("category", "utilities")
        categories_stats[cat] = categories_stats.get(cat, 0) + 1

    # Add percentages
    for lang_data in languages_stats.values():
        lang_data["percentage"] = round((lang_data["count"] / max(1, total_files)) * 100, 1)

    entry_points = [f["path"] for f in files if f.get("is_entry_point")]
    manifests = [f["path"] for f in files if f.get("is_manifest")]

    # 4. Generate Hierarchical Tree
    tree = build_hierarchical_tree(files, repo_name)
    total_folders = tree.get("folderCount", 0)

    # 5. Generate React Flow Graph Nodes & Edges
    # Group nodes by category to establish spatial columns
    CATEGORY_COLUMNS = {
        "configuration": 0,
        "database": 1,
        "backend": 2,
        "middleware": 2,
        "utilities": 3,
        "components": 4,
        "frontend": 5,
        "documentation": 6,
    }

    category_counters: dict[str, int] = {k: 0 for k in CATEGORY_COLUMNS}
    nodes: list[dict[str, Any]] = []

    # Map for quick path -> node ID lookup
    path_to_node_id: dict[str, str] = {}

    for f in files:
        node_id = sanitize_id(f["path"])
        path_to_node_id[f["path"]] = node_id

        cat = f.get("category", "utilities")
        col = CATEGORY_COLUMNS.get(cat, 3)
        row = category_counters.get(cat, 0)
        category_counters[cat] = row + 1

        x_pos = col * 320 + 60
        y_pos = row * 120 + 80

        nodes.append({
            "id": node_id,
            "type": "fileTopologyNode",
            "position": {"x": x_pos, "y": y_pos},
            "data": {
                "id": node_id,
                "label": f["name"],
                "name": f["name"],
                "path": f["path"],
                "extension": f.get("extension", ""),
                "language": f.get("language", "Text"),
                "languageColor": f.get("language_color", "#78716C"),
                "category": cat,
                "role": f.get("role", "Source File"),
                "sizeBytes": f.get("size", 0),
                "linesCount": f.get("lines", 0),
                "isEntryPoint": f.get("is_entry_point", False),
                "isManifest": f.get("is_manifest", False),
                "hasCircularDep": f.get("hasCircularDep", False),
                "inDegree": f.get("inDegree", 0),
                "outDegree": f.get("outDegree", 0),
                "imports": f.get("imports", []),
                "externalDependencies": f.get("external_dependencies", []),
                "exports": f.get("exports", [])
            }
        })

    # Generate Edges
    edges: list[dict[str, Any]] = []
    seen_edges: set[str] = set()

    for f in files:
        source_id = path_to_node_id.get(f["path"])
        if not source_id:
            continue

        for target_path in f.get("imports", []):
            target_id = path_to_node_id.get(target_path)
            if not target_id or source_id == target_id:
                continue

            edge_key = f"{source_id}->{target_id}"
            if edge_key in seen_edges:
                continue
            seen_edges.add(edge_key)

            # Check if this edge is part of a circular loop
            is_circular = (f["path"] in circular_file_set) and (target_path in circular_file_set)

            edges.append({
                "id": f"edge_{source_id}_{target_id}",
                "source": source_id,
                "target": target_id,
                "type": "smoothstep",
                "animated": is_circular,
                "style": {
                    "stroke": "#EF4444" if is_circular else "#525252",
                    "strokeWidth": 2 if is_circular else 1.5,
                },
                "data": {
                    "sourcePath": f["path"],
                    "targetPath": target_path,
                    "isCircular": is_circular,
                    "label": "imports"
                }
            })

    summary = {
        "totalFiles": total_files,
        "totalFolders": total_folders,
        "totalLines": total_lines,
        "totalSizeBytes": total_size,
        "languages": languages_stats,
        "categories": categories_stats,
        "circularDependencies": circular_cycles,
        "circularFilesCount": len(circular_file_set),
        "entryPoints": entry_points,
        "manifests": manifests,
        "totalEdges": len(edges)
    }

    return {
        "summary": summary,
        "tree": tree,
        "nodes": nodes,
        "edges": edges,
        "files": files
    }


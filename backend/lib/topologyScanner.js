/**
 * topologyScanner.js
 * 
 * Dynamic Hierarchical File Topology Engine for SyncOps.
 * Scans actual repository directories, builds real file trees,
 * calculates dependency metrics, and provides full multi-user repository isolation.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getLatestFileFlowAnalysis } from './fileFlowScanner.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const CACHE_FILE = path.resolve(__dirname, '..', '.topology_cache.json')

// In-memory cache for fast lookup
const memoryTopologyCache = new Map()

export function loadTopologyFromCache(projectId, userId) {
  const cacheKey = `${userId}:${projectId}`
  if (memoryTopologyCache.has(cacheKey)) {
    return memoryTopologyCache.get(cacheKey)
  }
  if (memoryTopologyCache.has(String(projectId))) {
    return memoryTopologyCache.get(String(projectId))
  }

  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
      if (data[cacheKey]) {
        memoryTopologyCache.set(cacheKey, data[cacheKey])
        return data[cacheKey]
      }
      if (data[projectId]) {
        memoryTopologyCache.set(cacheKey, data[projectId])
        return data[projectId]
      }
    }
  } catch (err) {
    console.warn('Notice reading .topology_cache.json:', err.message)
  }
  return null
}

export function saveTopologyToCache(projectId, userId, topology) {
  const cacheKey = `${userId}:${projectId}`
  memoryTopologyCache.set(cacheKey, topology)
  memoryTopologyCache.set(String(projectId), topology)

  try {
    let existing = {}
    if (fs.existsSync(CACHE_FILE)) {
      existing = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
    }
    existing[cacheKey] = topology
    existing[String(projectId)] = topology
    fs.writeFileSync(CACHE_FILE, JSON.stringify(existing, null, 2), 'utf8')
  } catch (err) {
    console.warn('Notice writing .topology_cache.json:', err.message)
  }
}

/**
 * Builds a real recursive folder & file hierarchy tree from scanned files.
 */
function buildHierarchicalTree(files, summary) {
  const root = {
    id: 'root',
    name: 'Repository',
    path: '',
    isDirectory: true,
    children: [],
    fileCount: files.length,
    folderCount: 0,
    totalLines: summary.totalLines,
    totalSize: summary.totalSizeBytes
  }

  const folderMap = new Map()
  folderMap.set('', root)

  let folderCounter = 0

  const sortedFiles = [...files].sort((a, b) => (a.path || '').localeCompare(b.path || ''))

  for (const f of sortedFiles) {
    const normPath = (f.path || '').replace(/\\/g, '/')
    const parts = normPath.split('/')
    const fileName = parts.pop()
    let currentPath = ''

    for (const part of parts) {
      const parentPath = currentPath
      currentPath = currentPath ? `${currentPath}/${part}` : part

      if (!folderMap.has(currentPath)) {
        folderCounter++
        const folderNode = {
          id: `folder_${currentPath}`,
          name: part,
          path: currentPath,
          isDirectory: true,
          children: [],
          fileCount: 0,
          folderCount: 0,
          totalLines: 0,
          totalSize: 0
        }
        folderMap.set(currentPath, folderNode)
        const parentNode = folderMap.get(parentPath)
        if (parentNode) {
          parentNode.children.push(folderNode)
          parentNode.folderCount = (parentNode.folderCount || 0) + 1
        }
      }

      const folderNode = folderMap.get(currentPath)
      if (folderNode) {
        folderNode.fileCount = (folderNode.fileCount || 0) + 1
        folderNode.totalLines = (folderNode.totalLines || 0) + (f.lines || f.linesCount || 0)
        folderNode.totalSize = (folderNode.totalSize || 0) + (f.size || f.sizeBytes || 0)
      }
    }

    const parentFolder = folderMap.get(currentPath)
    if (parentFolder) {
      const fileNode = {
        id: `file_${normPath}`,
        name: fileName || f.name || normPath,
        path: normPath,
        isDirectory: false,
        lines: f.lines || f.linesCount || 0,
        size: f.size || f.sizeBytes || 0,
        language: f.language || 'Text',
        category: f.category || f.fileCategory || 'utilities',
        importedByCount: f.importedByCount || 0,
        importsCount: f.importsCount || (f.imports ? f.imports.length : 0),
        degree: (f.importedByCount || 0) + (f.importsCount || 0)
      }
      parentFolder.children.push(fileNode)
    }
  }

  root.folderCount = folderCounter
  return root
}

export async function getOrGenerateTopology(projectId, userId, repoDir = null, forceRescan = false) {
  if (!forceRescan) {
    const cached = loadTopologyFromCache(projectId, userId)
    if (cached) return cached
  }

  // Generate or load FileFlow analysis for the target repository
  const fileFlow = await getLatestFileFlowAnalysis(projectId, userId, repoDir)
  const files = (fileFlow.files && fileFlow.files.length > 0)
    ? fileFlow.files
    : (fileFlow.nodes || [])
        .filter((n) => n.type === 'fileNode' || n.type === 'file')
        .map((n) => n.data || { path: n.id, name: n.label, lines: 0, size: 0 })

  const summary = {
    totalFiles: files.length,
    totalFolders: 0,
    totalLines: files.reduce((acc, f) => acc + (f.lines || f.linesCount || 0), 0),
    totalSizeBytes: files.reduce((acc, f) => acc + (f.size || f.sizeBytes || 0), 0),
    languages: fileFlow.summary?.languages || {},
    categories: {
      frontend: files.filter((f) => f.category === 'frontend').length,
      backend: files.filter((f) => f.category === 'backend').length,
      database: files.filter((f) => f.category === 'database').length,
      components: files.filter((f) => f.category === 'components').length,
      utilities: files.filter((f) => f.category === 'utilities').length,
      configuration: files.filter((f) => f.category === 'config' || f.category === 'configuration').length,
      documentation: files.filter((f) => f.category === 'docs' || f.category === 'documentation').length
    },
    circularDependencies: fileFlow.circularDependencies || [],
    entryPoints: files.filter((f) => f.isEntryPoint).map((f) => f.path),
    manifests: files.filter((f) => f.isManifest).map((f) => f.path),
    totalEdges: (fileFlow.edges || []).length
  }

  // Build recursive directory tree
  const tree = buildHierarchicalTree(files, summary)
  summary.totalFolders = tree.folderCount

  const result = {
    projectId,
    analysisId: `topo_${Date.now()}`,
    userId,
    scanTimestamp: new Date().toISOString(),
    summary,
    tree,
    nodes: fileFlow.nodes || [],
    edges: fileFlow.edges || [],
    files
  }

  saveTopologyToCache(projectId, userId, result)
  return result
}

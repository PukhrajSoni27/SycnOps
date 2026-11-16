/**
 * topologyScanner.js
 * 
 * Node.js helper for File Topology endpoints.
 * Reads topology cache, generates hierarchical trees, and provides
 * full compatibility with the Python FastAPI topology service.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getLatestFileFlowAnalysis } from './fileFlowScanner.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const CACHE_FILE = path.resolve(__dirname, '..', '.topology_cache.json')

export function loadTopologyFromCache(projectId, userId) {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
      const cacheKey = `${userId}:${projectId}`
      if (data[cacheKey]) return data[cacheKey]
      if (data[projectId]) return data[projectId]
      if (data['sycnops']) return data['sycnops']
    }
  } catch (err) {
    console.warn('Notice reading .topology_cache.json:', err.message)
  }
  return null
}

export async function getOrGenerateTopology(projectId, userId, forceRescan = false) {
  if (!forceRescan) {
    const cached = loadTopologyFromCache(projectId, userId)
    if (cached) return cached
  }

  // Fallback to building from FileFlow analysis
  const fileFlow = await getLatestFileFlowAnalysis(projectId)
  const files = (fileFlow.nodes || []).filter(n => n.type === 'file').map(n => n.data)

  const summary = {
    totalFiles: files.length,
    totalFolders: 0,
    totalLines: files.reduce((acc, f) => acc + (f.lines || 0), 0),
    totalSizeBytes: files.reduce((acc, f) => acc + (f.size || 0), 0),
    languages: fileFlow.summary?.languages || {},
    categories: {
      frontend: files.filter(f => f.category === 'frontend').length,
      backend: files.filter(f => f.category === 'backend').length,
      database: files.filter(f => f.category === 'database').length,
      components: files.filter(f => f.category === 'components').length,
      utilities: files.filter(f => f.category === 'utilities').length,
      configuration: files.filter(f => f.category === 'config' || f.category === 'configuration').length,
      documentation: files.filter(f => f.category === 'documentation').length
    },
    circularDependencies: fileFlow.circularDependencies || [],
    entryPoints: files.filter(f => f.isEntryPoint).map(f => f.path),
    manifests: files.filter(f => f.isManifest).map(f => f.path),
    totalEdges: (fileFlow.edges || []).length
  }

  // Build tree
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

  const result = {
    projectId,
    analysisId: `topo_${Date.now()}`,
    userId,
    scanTimestamp: new Date().toISOString(),
    summary,
    tree: root,
    nodes: fileFlow.nodes || [],
    edges: fileFlow.edges || [],
    files
  }

  return result
}


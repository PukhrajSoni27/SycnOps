import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderTree,
  Folder,
  FolderOpen,
  FileCode2,
  FileText,
  ChevronRight,
  ChevronDown,
  Search,
  Layers,
  ArrowRight,
  ExternalLink,
  Boxes,
  Compass,
  Cpu,
  Server,
  Database,
  ShieldCheck,
  Zap,
  Info,
  Filter
} from 'lucide-react'
import { useFileFlowFilesQuery, useFileFlowGraphQuery } from '@/hooks/useApi'
import { FileFlowNodeData } from '@/services/api'

interface TreeNode {
  name: string
  path: string
  isDirectory: boolean
  children: Map<string, TreeNode>
  fileData?: FileFlowNodeData
  sizeBytes?: number
  lines?: number
}

function buildTree(files: FileFlowNodeData[]): TreeNode {
  const root: TreeNode = {
    name: 'root',
    path: '',
    isDirectory: true,
    children: new Map()
  }

  files.forEach((file) => {
    const parts = (file.path || file.name).split('/')
    let current = root

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1
      const currentPath = parts.slice(0, index + 1).join('/')

      if (!current.children.has(part)) {
        current.children.set(part, {
          name: part,
          path: currentPath,
          isDirectory: !isFile,
          children: new Map(),
          fileData: isFile ? file : undefined,
          sizeBytes: isFile ? file.size || 0 : 0,
          lines: isFile ? file.lines || file.linesCount || 0 : 0
        })
      }
      current = current.children.get(part)!
    })
  })

  return root
}

export default function FileTopology() {
  const [projectId] = useState('sycnops')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    new Set(['frontend', 'frontend/src', 'frontend/src/pages', 'frontend/src/components', 'backend', 'backend/lib', 'backend/config'])
  )
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [activeModuleFilter, setActiveModuleFilter] = useState<'all' | 'frontend' | 'backend' | 'database' | 'config'>('all')

  const { data: files = [], isLoading } = useFileFlowFilesQuery(projectId)
  const { data: graphData } = useFileFlowGraphQuery(projectId)

  const tree = useMemo(() => {
    return buildTree(files)
  }, [files])

  const toggleExpand = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const selectedFile = useMemo(() => {
    if (!selectedPath) return null
    return files.find((f) => f.path === selectedPath) || null
  }, [selectedPath, files])

  // Filtered files count by module
  const moduleCounts = useMemo(() => {
    const counts = { frontend: 0, backend: 0, database: 0, config: 0 }
    files.forEach((f) => {
      const cat = f.category || (f.path?.startsWith('frontend') ? 'frontend' : 'backend')
      if (cat in counts) counts[cat as keyof typeof counts]++
    })
    return counts
  }, [files])

  // Render tree node recursively
  const renderNode = (node: TreeNode, depth: number = 0) => {
    if (node.name === 'root') {
      return Array.from(node.children.values()).map((child) => renderNode(child, 0))
    }

    const isExpanded = expandedPaths.has(node.path)
    const isSelected = selectedPath === node.path
    const isMatch = !searchQuery || node.path.toLowerCase().includes(searchQuery.toLowerCase())

    if (searchQuery && !isMatch && node.children.size === 0) {
      return null
    }

    const paddingLeft = depth * 18 + 8

    if (node.isDirectory) {
      return (
        <div key={node.path}>
          <div
            onClick={() => toggleExpand(node.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              paddingLeft,
              cursor: 'pointer',
              borderRadius: 6,
              backgroundColor: isExpanded ? 'rgba(89, 9, 7, 0.2)' : 'transparent',
              color: '#F5F5F4',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '12px',
              transition: 'background 0.15s ease'
            }}
            className="hover:bg-white/5"
          >
            {isExpanded ? <ChevronDown size={14} color="#E8D2B5" /> : <ChevronRight size={14} color="#78716C" />}
            {isExpanded ? <FolderOpen size={16} color="#E8D2B5" /> : <Folder size={16} color="#A8A29E" />}
            <span style={{ fontWeight: 600, color: isExpanded ? '#E8D2B5' : '#D6D3D1' }}>{node.name}</span>
            <span style={{ fontSize: '10px', color: '#78716C', marginLeft: 'auto' }}>
              {node.children.size} items
            </span>
          </div>

          {isExpanded && (
            <div>
              {Array.from(node.children.values()).map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <div
        key={node.path}
        onClick={() => setSelectedPath(node.path)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 12px',
          paddingLeft,
          cursor: 'pointer',
          borderRadius: 6,
          backgroundColor: isSelected ? 'rgba(232, 210, 181, 0.15)' : 'transparent',
          borderLeft: isSelected ? '2px solid #E8D2B5' : '2px solid transparent',
          color: isSelected ? '#E8D2B5' : '#D6D3D1',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '11px',
          transition: 'background 0.15s ease'
        }}
        className="hover:bg-white/5"
      >
        <FileCode2 size={14} color={isSelected ? '#E8D2B5' : '#60A5FA'} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.name}</span>
        {node.lines && (
          <span style={{ fontSize: '9px', color: '#78716C', marginLeft: 'auto', fontFamily: 'monospace' }}>
            {node.lines} L
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="s-page" style={{ position: 'relative', minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 16,
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(89, 9, 7, 0.4) 0%, rgba(20, 18, 16, 0.8) 100%)',
          borderRadius: 16,
          border: '1px solid rgba(89, 9, 7, 0.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              backgroundColor: '#590907',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E8D2B5',
              border: '1px solid rgba(232, 210, 181, 0.3)'
            }}
          >
            <FolderTree size={18} />
          </div>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '22px',
                color: '#E8D2B5',
                margin: 0,
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              File Topology & Architecture Tree
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono, monospace)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(232, 210, 181, 0.15)',
                  color: '#E8D2B5',
                  border: '1px solid rgba(232, 210, 181, 0.3)',
                  fontWeight: 600
                }}
              >
                STRUCTURAL TOPOLOGY
              </span>
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#A8A29E' }}>
              Hierarchical directory topology, package structures, module clustering, and file distribution.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link
            to="/file-flow"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              backgroundColor: '#141210',
              color: '#E8D2B5',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '11px',
              fontFamily: 'monospace',
              textDecoration: 'none'
            }}
          >
            <Compass size={14} /> Open Graph View <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Topology Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 16
        }}
      >
        <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Total Files</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#F5F5F4', fontFamily: 'monospace' }}>
            {files.length}
          </div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Frontend Files</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#60A5FA', fontFamily: 'monospace' }}>
            {moduleCounts.frontend}
          </div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Backend Files</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#FBBF24', fontFamily: 'monospace' }}>
            {moduleCounts.backend}
          </div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Database Models</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#34D399', fontFamily: 'monospace' }}>
            {moduleCounts.database}
          </div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Configs / Manifests</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#C084FC', fontFamily: 'monospace' }}>
            {moduleCounts.config}
          </div>
        </div>
      </div>

      {/* Main Split: Directory Tree & Selected Node Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: 16, flex: 1, minHeight: 550 }}>
        {/* Left: Tree View */}
        <div
          style={{
            backgroundColor: '#141210',
            borderRadius: 16,
            border: '1px solid rgba(89, 9, 7, 0.4)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            maxHeight: '75vh',
            overflowY: 'auto'
          }}
        >
          {/* Search bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 8,
              backgroundColor: '#0F0E0D',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <Search size={14} color="#78716C" />
            <input
              type="text"
              placeholder="Search directory topology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '11px',
                color: '#F5F5F4',
                fontFamily: 'monospace'
              }}
            />
          </div>

          {/* Tree list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {isLoading ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#A8A29E', fontSize: '12px' }}>
                Loading directory topology...
              </div>
            ) : (
              renderNode(tree)
            )}
          </div>
        </div>

        {/* Right: Selected File Details & Module Inspector */}
        <div
          style={{
            backgroundColor: '#141210',
            borderRadius: 16,
            border: '1px solid rgba(89, 9, 7, 0.4)',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxHeight: '75vh',
            overflowY: 'auto'
          }}
        >
          {selectedFile ? (
            <>
              <div>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#E8D2B5', textTransform: 'uppercase' }}>
                  FILE TOPOLOGY NODE
                </span>
                <h2 style={{ margin: '4px 0 0', fontSize: '18px', color: '#F5F5F4', fontFamily: 'monospace' }}>
                  {selectedFile.name}
                </h2>
                <div style={{ fontSize: '11px', color: '#78716C', fontFamily: 'monospace', marginTop: 2 }}>
                  {selectedFile.path}
                </div>
              </div>

              {/* Module Metadata Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div style={{ padding: 12, borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Language</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#60A5FA', fontFamily: 'monospace' }}>
                    {selectedFile.language || 'Code'}
                  </div>
                </div>
                <div style={{ padding: 12, borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Lines of Code</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#34D399', fontFamily: 'monospace' }}>
                    {selectedFile.lines || selectedFile.linesCount || 0}
                  </div>
                </div>
                <div style={{ padding: 12, borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Functions</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FBBF24', fontFamily: 'monospace' }}>
                    {selectedFile.functionsCount || 0}
                  </div>
                </div>
              </div>

              {/* Action: Open in File Flow */}
              <div style={{ padding: 14, borderRadius: 10, backgroundColor: 'rgba(89, 9, 7, 0.25)', border: '1px solid rgba(89, 9, 7, 0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#E8D2B5' }}>
                      Inspect in File Flow Architecture
                    </div>
                    <div style={{ fontSize: '11px', color: '#A8A29E', marginTop: 2 }}>
                      View all incoming imports, outgoing dependencies, and API bridges connected to this file.
                    </div>
                  </div>
                  <Link
                    to="/file-flow"
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      backgroundColor: '#590907',
                      color: '#E8D2B5',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      textDecoration: 'none',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    Open Flow <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: '#78716C' }}>
              <FolderTree size={36} color="#590907" />
              <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#A8A29E' }}>
                Select a file from the directory tree to inspect its topology.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


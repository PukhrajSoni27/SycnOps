import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  FolderTree,
  Folder,
  FolderOpen,
  FileCode2,
  ChevronRight,
  ChevronDown,
  Search,
  ArrowRight,
  ExternalLink,
  Compass,
  RefreshCw,
  GitBranch,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Network,
  Copy,
  Check,
  X
} from 'lucide-react'
import {
  useRepositoriesQuery,
  useTopologyQuery,
  useRescanTopologyMutation
} from '@/hooks/useApi'
import { useRepositoryContext } from '@/context/RepositoryContext'
import { TopologyTreeNode } from '@/services/api'

// ── Category Color Tokens (Monochrome / Accent Palette) ────────────────────────
const CATEGORY_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  frontend: { label: 'Frontend', color: '#60A5FA', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.35)' },
  backend: { label: 'Backend', color: '#FBBF24', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.35)' },
  database: { label: 'Database', color: '#34D399', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)' },
  components: { label: 'Components', color: '#C084FC', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.35)' },
  utilities: { label: 'Utilities', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.35)' },
  configuration: { label: 'Config / Manifest', color: '#FB7185', bg: 'rgba(251, 113, 133, 0.12)', border: 'rgba(251, 113, 133, 0.35)' },
  documentation: { label: 'Docs', color: '#A3E635', bg: 'rgba(163, 230, 53, 0.12)', border: 'rgba(163, 230, 53, 0.35)' },
  middleware: { label: 'Middleware', color: '#F472B6', bg: 'rgba(244, 114, 182, 0.12)', border: 'rgba(244, 114, 182, 0.35)' },
  external: { label: 'External', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.12)', border: 'rgba(156, 163, 175, 0.35)' }
}

function getCategoryMeta(cat?: string) {
  const key = (cat || 'utilities').toLowerCase()
  return CATEGORY_META[key] || { label: cat || 'Source', color: '#D4D4D8', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.18)' }
}

// ── Custom React Flow Node Component ──────────────────────────────────────────
const FileTopologyNodeComponent = React.memo(({ data, selected }: NodeProps) => {
  const cat = getCategoryMeta(data.category as string)
  const isSelected = selected || data.isHighlighted
  const isCircular = data.hasCircularDep

  return (
    <div
      style={{
        width: 250,
        backgroundColor: '#111111',
        border: `1px solid ${isCircular ? '#EF4444' : isSelected ? cat.color : 'rgba(255, 255, 255, 0.1)'}`,
        borderLeft: `4px solid ${isCircular ? '#EF4444' : cat.color}`,
        borderRadius: 10,
        padding: '10px 12px',
        color: '#EDEDED',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '11px',
        boxShadow: isSelected
          ? `0 0 20px ${cat.color}40, 0 8px 24px rgba(0,0,0,0.8)`
          : '0 4px 14px rgba(0,0,0,0.6)',
        transition: 'all 0.18s ease',
        cursor: 'pointer'
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: cat.color, width: 7, height: 7 }} />

      {/* Header with Category Badge and Entry Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span
          style={{
            fontSize: '9px',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: cat.color,
            backgroundColor: cat.bg,
            border: `1px solid ${cat.border}`,
            padding: '1px 6px',
            borderRadius: 4,
            letterSpacing: '0.04em'
          }}
        >
          {cat.label}
        </span>

        <div style={{ display: 'flex', gap: 4 }}>
          {Boolean(data.isEntryPoint) && (
            <span
              style={{
                fontSize: '8px',
                fontWeight: 800,
                color: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '1px 5px',
                borderRadius: 3
              }}
            >
              ENTRY
            </span>
          )}
          {Boolean(data.hasCircularDep) && (
            <span
              style={{
                fontSize: '8px',
                fontWeight: 800,
                color: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                padding: '1px 5px',
                borderRadius: 3
              }}
            >
              CYCLE
            </span>
          )}
        </div>
      </div>

      {/* File Name */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontWeight: 600,
          fontSize: '12px',
          color: '#F4F4F5',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        title={data.name as string}
      >
        <FileCode2 size={13} color={cat.color} style={{ flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.name as string}</span>
      </div>

      {/* Relative Path */}
      <div
        style={{
          fontSize: '10px',
          color: '#71717A',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginTop: 2
        }}
        title={data.path as string}
      >
        {data.path as string}
      </div>

      {/* Footer Metrics */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 8,
          paddingTop: 6,
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          fontSize: '10px',
          color: '#A1A1AA'
        }}
      >
        <span>{data.linesCount ? `${data.linesCount} lines` : `${Math.round(((data.sizeBytes as number) || 0) / 1024)} KB`}</span>
        <div style={{ display: 'flex', gap: 6, fontSize: '9px' }}>
          <span title="Outgoing dependencies (imports)">↑ {String(data.outDegree ?? (data.imports as string[])?.length ?? 0)}</span>
          <span title="Incoming dependencies (imported by)">↓ {String(data.inDegree ?? 0)}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} style={{ background: cat.color, width: 7, height: 7 }} />
    </div>
  )
})

const nodeTypes = {
  fileTopologyNode: FileTopologyNodeComponent
}

// ── Floating Graph Viewport Controls ──────────────────────────────────────────
function GraphViewportControls() {
  const { zoomIn, zoomOut, setViewport, fitView } = useReactFlow()

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(18, 18, 18, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 8,
        padding: 4,
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
      }}
    >
      <button
        type="button"
        onClick={() => zoomIn({ duration: 250 })}
        title="Zoom in"
        style={{
          width: 30,
          height: 30,
          borderRadius: 6,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#E5E5E5',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ZoomIn size={14} />
      </button>

      <button
        type="button"
        onClick={() => setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 250 })}
        title="Reset zoom to 100%"
        style={{
          padding: '0 8px',
          height: 30,
          borderRadius: 6,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#E5E5E5',
          fontSize: '11px',
          fontFamily: 'monospace',
          cursor: 'pointer'
        }}
      >
        100%
      </button>

      <button
        type="button"
        onClick={() => zoomOut({ duration: 250 })}
        title="Zoom out"
        style={{
          width: 30,
          height: 30,
          borderRadius: 6,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#E5E5E5',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ZoomOut size={14} />
      </button>

      <button
        type="button"
        onClick={() => fitView({ padding: 0.2, duration: 300 })}
        title="Fit whole graph to screen"
        style={{
          padding: '0 10px',
          height: 30,
          borderRadius: 6,
          border: '1px solid rgba(232, 210, 181, 0.3)',
          background: 'rgba(232, 210, 181, 0.1)',
          color: '#E8D2B5',
          fontSize: '11px',
          fontFamily: 'monospace',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}
      >
        <Maximize2 size={12} /> Fit
      </button>
    </div>
  )
}

// ── Graph Canvas Wrapper with ReactFlowProvider ────────────────────────────────
function DependencyGraphCanvas({
  nodes,
  edges,
  onNodeClick,
  selectedNodeId
}: {
  nodes: Node[]
  edges: Edge[]
  onNodeClick: (node: Node) => void
  selectedNodeId: string | null
}) {
  const [rfNodes, setNodes, onNodesChange] = useNodesState(nodes)
  const [rfEdges, setEdges, onEdgesChange] = useEdgesState(edges)

  useEffect(() => {
    // Highlight connected edges and nodes when a node is selected
    if (!selectedNodeId) {
      setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isHighlighted: false } })))
      setEdges((eds) => eds.map((e) => ({ ...e, style: { ...e.style, stroke: '#404040', strokeWidth: 1.5, opacity: 0.6 } })))
      return
    }

    const connectedNodeIds = new Set<string>([selectedNodeId])
    edges.forEach((e) => {
      if (e.source === selectedNodeId) connectedNodeIds.add(e.target)
      if (e.target === selectedNodeId) connectedNodeIds.add(e.source)
    })

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isHighlighted: connectedNodeIds.has(n.id)
        }
      }))
    )

    setEdges((eds) =>
      eds.map((e) => {
        const isConnected = e.source === selectedNodeId || e.target === selectedNodeId
        return {
          ...e,
          animated: isConnected || Boolean(e.data?.isCircular),
          style: {
            ...e.style,
            stroke: isConnected ? '#10B981' : e.data?.isCircular ? '#EF4444' : '#262626',
            strokeWidth: isConnected ? 2.5 : 1,
            opacity: isConnected ? 1 : 0.2
          }
        }
      })
    )
  }, [selectedNodeId, edges, setNodes, setEdges])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#0A0A0A', borderRadius: 12, overflow: 'hidden' }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick(node)}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.1}
        maxZoom={2.5}
        defaultEdgeOptions={{
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#525252' }
        }}
      >
        <Background color="#1C1C1C" gap={20} size={1} />
        <MiniMap
          nodeColor={(n) => {
            const cat = getCategoryMeta(n.data?.category as string)
            return cat.color
          }}
          style={{
            backgroundColor: '#121212',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 8
          }}
        />
        <GraphViewportControls />
      </ReactFlow>
    </div>
  )
}

// ── Main File Topology Page Component ──────────────────────────────────────────
export default function FileTopology() {
  const { data: repositories = [], isLoading: _isReposLoading } = useRepositoriesQuery()

  const { selectedRepoId, setSelectedRepoId } = useRepositoryContext()

  // Active selected project / repository ID
  const selectedProjectId = selectedRepoId || (repositories[0] ? String(repositories[0].id) : '')
  const [viewMode, setViewMode] = useState<'tree' | 'graph'>('tree')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all')
  const [activeLanguageFilter, _setActiveLanguageFilter] = useState<string>('all')
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['frontend', 'frontend/src', 'backend', 'backend/lib', 'src']))
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  // Fetch real topology from FastAPI / Backend
  const {
    data: topologyData,
    isLoading: isTopologyLoading,
    error: topologyError,
    refetch
  } = useTopologyQuery(selectedProjectId)

  const rescanMutation = useRescanTopologyMutation()

  // Handle manual rescan
  const handleRescan = async () => {
    try {
      await rescanMutation.mutateAsync(selectedProjectId)
      await refetch()
    } catch (err) {
      console.error('Topology rescan failed:', err)
    }
  }

  // Active repository object
  const _activeRepo = useMemo(() => {
    return repositories.find(
      (r) => String(r.id) === selectedProjectId || r.name === selectedProjectId || r.fullName === selectedProjectId
    ) || null
  }, [repositories, selectedProjectId])

  const summary = topologyData?.summary
  const tree = topologyData?.tree
  const filesList = useMemo(() => topologyData?.files || [], [topologyData])

  // Filter files by search query, category, and language
  const filteredFiles = useMemo(() => {
    return filesList.filter((f) => {
      const matchesSearch = !searchQuery || f.path.toLowerCase().includes(searchQuery.toLowerCase()) || f.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategoryFilter === 'all' || f.category?.toLowerCase() === activeCategoryFilter.toLowerCase()
      const matchesLanguage = activeLanguageFilter === 'all' || f.language?.toLowerCase() === activeLanguageFilter.toLowerCase()
      return matchesSearch && matchesCategory && matchesLanguage
    })
  }, [filesList, searchQuery, activeCategoryFilter, activeLanguageFilter])

  // Currently selected file detail
  const selectedFile = useMemo(() => {
    if (!selectedPath) return null
    return filesList.find((f) => f.path === selectedPath || f.id === selectedPath) || null
  }, [selectedPath, filesList])

  // Graph nodes & edges filtered
  const graphNodes = useMemo(() => {
    const rawNodes = topologyData?.nodes || []
    if (activeCategoryFilter === 'all' && !searchQuery) return rawNodes

    const matchingPaths = new Set(filteredFiles.map((f) => f.path))
    return rawNodes.filter((n) => matchingPaths.has(n.data?.path))
  }, [topologyData, filteredFiles, activeCategoryFilter, searchQuery])

  const graphEdges = useMemo(() => {
    const validNodeIds = new Set(graphNodes.map((n) => n.id))
    return (topologyData?.edges || []).filter(
      (e) => validNodeIds.has(e.source) && validNodeIds.has(e.target)
    )
  }, [topologyData, graphNodes])

  // Toggle tree node expansion
  const toggleExpand = (pathStr: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(pathStr)) next.delete(pathStr)
      else next.add(pathStr)
      return next
    })
  }

  const expandAll = () => {
    const allPaths = new Set<string>()
    const traverse = (node: TopologyTreeNode) => {
      if (node.isDirectory && node.path) allPaths.add(node.path)
      ;(node.children || []).forEach(traverse)
    }
    if (tree) traverse(tree)
    setExpandedPaths(allPaths)
  }

  const collapseAll = () => {
    setExpandedPaths(new Set())
  }

  const handleCopyPath = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: TopologyTreeNode, depth = 0): React.ReactNode => {
    if (node.id === 'root') {
      return (node.children || []).map((child) => renderTreeNode(child, 0))
    }

    const isExpanded = expandedPaths.has(node.path)
    const isSelected = selectedPath === node.path
    const isMatch = !searchQuery || node.path.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter matching
    if (searchQuery && !isMatch && (!node.children || node.children.length === 0)) {
      return null
    }

    const paddingLeft = depth * 16 + 8
    const cat = getCategoryMeta(node.category)

    if (node.isDirectory) {
      return (
        <div key={node.id || node.path}>
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
              backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              color: isExpanded ? '#EDEDED' : '#A1A1AA',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              transition: 'all 0.15s ease'
            }}
            className="hover:bg-white/5"
          >
            {isExpanded ? <ChevronDown size={13} color="#E8D2B5" /> : <ChevronRight size={13} color="#71717A" />}
            {isExpanded ? <FolderOpen size={15} color="#E8D2B5" /> : <Folder size={15} color="#A1A1AA" />}
            <span style={{ fontWeight: 600, color: isExpanded ? '#FFFFFF' : '#D4D4D8' }}>{node.name}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, fontSize: '9px', color: '#71717A' }}>
              <span>{node.fileCount || node.children?.length || 0} files</span>
              {Boolean(node.totalLines) && <span>• {node.totalLines} L</span>}
            </div>
          </div>

          {isExpanded && (
            <div>
              {(node.children || []).map((child) => renderTreeNode(child, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    // Leaf file node
    return (
      <div
        key={node.id || node.path}
        onClick={() => setSelectedPath(node.path)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 12px',
          paddingLeft,
          cursor: 'pointer',
          borderRadius: 6,
          backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
          borderLeft: isSelected ? '3px solid #10B981' : '3px solid transparent',
          color: isSelected ? '#34D399' : '#D4D4D8',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '11px',
          transition: 'all 0.15s ease'
        }}
        className="hover:bg-white/5"
      >
        <FileCode2 size={13} color={cat.color} style={{ flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.name}</span>

        {/* Badges */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {node.isEntryPoint && (
            <span style={{ fontSize: '8px', color: '#10B981', background: 'rgba(16,185,129,0.15)', padding: '1px 4px', borderRadius: 3 }}>
              ENTRY
            </span>
          )}
          {node.hasCircularDep && (
            <span style={{ fontSize: '8px', color: '#EF4444', background: 'rgba(239,68,68,0.2)', padding: '1px 4px', borderRadius: 3 }}>
              CYCLE
            </span>
          )}
          {node.linesCount ? (
            <span style={{ fontSize: '9px', color: '#71717A', fontFamily: 'monospace' }}>
              {node.linesCount} L
            </span>
          ) : null}
        </div>
      </div>
    )
  }

  if (!selectedProjectId) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <FolderTree size={44} color="#34D399" style={{ margin: '0 auto 16px', display: 'block' }} />
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#F4F4F5', marginBottom: 8 }}>
          No Repository Selected
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#A1A1AA', lineHeight: 1.6, marginBottom: 20 }}>
          Import a GitHub repository in Repositories or select one from the header switcher to inspect its file topology.
        </p>
        <Link
          to="/repositories"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 20px',
            borderRadius: 10,
            backgroundColor: '#10B981',
            color: '#050505',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          Go to Repositories
        </Link>
      </div>
    )
  }

  return (
    <div className="s-page" style={{ position: 'relative', minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ── Top Bar: Header, Repo Selector, Rescan & View Mode ── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(12, 12, 12, 0.98) 100%)',
          borderRadius: 14,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: '#1E1E1E',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F4F4F5'
            }}
          >
            <FolderTree size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#F4F4F5', margin: 0, letterSpacing: '-0.02em' }}>
                File Topology
              </h1>
              <span
                style={{
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  padding: '2px 7px',
                  borderRadius: 4,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontWeight: 700
                }}
              >
                FASTAPI REAL-TIME AST
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#A1A1AA' }}>
              Hierarchical architectural decomposition, module clustering, and dependency graph for imported repositories.
            </p>
          </div>
        </div>

        {/* Controls: Repo Switcher, Mode Toggle & Rescan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Repository Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#18181B', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <GitBranch size={13} color="#A1A1AA" />
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedRepoId(e.target.value)
                setSelectedPath(null)
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FAFAFA',
                fontSize: '11px',
                fontFamily: 'monospace',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {repositories.map((repo) => (
                <option key={repo.id} value={String(repo.id)} style={{ backgroundColor: '#18181B', color: '#FFF' }}>
                  {repo.fullName || repo.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle: Tree vs Graph */}
          <div style={{ display: 'flex', backgroundColor: '#18181B', borderRadius: 8, padding: 3, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 10px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: viewMode === 'tree' ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
                color: viewMode === 'tree' ? '#FFFFFF' : '#A1A1AA',
                fontSize: '11px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                fontWeight: viewMode === 'tree' ? 600 : 400
              }}
            >
              <FolderTree size={13} /> Tree View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('graph')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 10px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: viewMode === 'graph' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: viewMode === 'graph' ? '#34D399' : '#A1A1AA',
                fontSize: '11px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                fontWeight: viewMode === 'graph' ? 600 : 400
              }}
            >
              <Network size={13} /> Graph View
            </button>
          </div>

          {/* Rescan Button */}
          <button
            type="button"
            onClick={handleRescan}
            disabled={rescanMutation.isPending || isTopologyLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#EDEDED',
              fontSize: '11px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              fontWeight: 600
            }}
            title="Perform fresh AST scan of repository"
          >
            <RefreshCw size={13} className={rescanMutation.isPending || isTopologyLoading ? 'animate-spin' : ''} />
            {rescanMutation.isPending ? 'Scanning...' : 'Rescan'}
          </button>
        </div>
      </div>

      {/* ── Summary Stats Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        <div style={{ padding: '10px 14px', borderRadius: 10, backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '10px', color: '#71717A', textTransform: 'uppercase', fontFamily: 'monospace' }}>Total Files</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#F4F4F5', fontFamily: 'monospace', marginTop: 2 }}>
            {summary?.totalFiles ?? filesList.length}
          </div>
        </div>

        <div style={{ padding: '10px 14px', borderRadius: 10, backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '10px', color: '#71717A', textTransform: 'uppercase', fontFamily: 'monospace' }}>Folders</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#F4F4F5', fontFamily: 'monospace', marginTop: 2 }}>
            {summary?.totalFolders ?? 0}
          </div>
        </div>

        <div style={{ padding: '10px 14px', borderRadius: 10, backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '10px', color: '#71717A', textTransform: 'uppercase', fontFamily: 'monospace' }}>Lines of Code</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#34D399', fontFamily: 'monospace', marginTop: 2 }}>
            {summary?.totalLines?.toLocaleString() ?? 0}
          </div>
        </div>

        <div style={{ padding: '10px 14px', borderRadius: 10, backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '10px', color: '#71717A', textTransform: 'uppercase', fontFamily: 'monospace' }}>Dependency Edges</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#60A5FA', fontFamily: 'monospace', marginTop: 2 }}>
            {summary?.totalEdges ?? (topologyData?.edges?.length || 0)}
          </div>
        </div>

        <div style={{ padding: '10px 14px', borderRadius: 10, backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '10px', color: '#71717A', textTransform: 'uppercase', fontFamily: 'monospace' }}>Circular Cycles</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: (summary?.circularDependencies?.length || 0) > 0 ? '#EF4444' : '#10B981', fontFamily: 'monospace', marginTop: 2 }}>
            {summary?.circularDependencies?.length ?? 0}
          </div>
        </div>
      </div>

      {/* ── Filter Bar: Categories, Languages & Search ── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '10px 14px',
          backgroundColor: '#121212',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', 'frontend', 'backend', 'database', 'components', 'utilities', 'configuration', 'documentation'].map((catKey) => {
            const isCatActive = activeCategoryFilter === catKey
            const catMeta = catKey === 'all' ? null : getCategoryMeta(catKey)
            const count = catKey === 'all' ? filesList.length : summary?.categories?.[catKey] || filesList.filter((f) => f.category === catKey).length

            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setActiveCategoryFilter(catKey)}
                style={{
                  padding: '4px 9px',
                  borderRadius: 6,
                  border: isCatActive
                    ? `1px solid ${catMeta?.color || '#EDEDED'}`
                    : '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: isCatActive
                    ? catMeta?.bg || 'rgba(255,255,255,0.14)'
                    : 'transparent',
                  color: isCatActive ? (catMeta?.color || '#FFFFFF') : '#A1A1AA',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>{catKey === 'all' ? 'All' : catMeta?.label}</span>
                <span style={{ fontSize: '9px', opacity: 0.7 }}>({count})</span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#0A0A0A', padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', width: 220 }}>
          <Search size={13} color="#71717A" />
          <input
            type="text"
            placeholder="Search files & paths..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#EDEDED',
              fontSize: '11px',
              fontFamily: 'monospace'
            }}
          />
          {searchQuery && (
            <X size={12} color="#71717A" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
          )}
        </div>
      </div>

      {/* ── Main Work Area: Tree or Graph + Inspector ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(300px, 380px)', gap: 16, flex: 1, minHeight: 600 }}>
        {/* Left Canvas / Tree Area */}
        <div
          style={{
            backgroundColor: '#121212',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {isTopologyLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: '#A1A1AA' }}>
              <RefreshCw size={28} className="animate-spin" color="#10B981" />
              <div style={{ fontSize: '13px', fontFamily: 'monospace' }}>Analyzing repository AST & dependencies...</div>
            </div>
          ) : topologyError ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, padding: 24, textAlign: 'center' }}>
              <AlertTriangle size={32} color="#EF4444" />
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#EDEDED' }}>Failed to Load Topology</div>
              <div style={{ fontSize: '12px', color: '#A1A1AA', maxWidth: 360 }}>
                {(topologyError as Error).message || 'Could not scan the repository structure.'}
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  backgroundColor: '#10B981',
                  border: 'none',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                Retry Scan
              </button>
            </div>
          ) : viewMode === 'tree' ? (
            /* ── Hierarchical Tree View ── */
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  backgroundColor: '#0F0F0F'
                }}
              >
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#A1A1AA' }}>
                  Showing <strong style={{ color: '#EDEDED' }}>{filteredFiles.length}</strong> items
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={expandAll}
                    style={{ background: 'none', border: 'none', color: '#A1A1AA', fontSize: '10px', fontFamily: 'monospace', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Expand All
                  </button>
                  <span style={{ color: '#525252' }}>•</span>
                  <button
                    type="button"
                    onClick={collapseAll}
                    style={{ background: 'none', border: 'none', color: '#A1A1AA', fontSize: '10px', fontFamily: 'monospace', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, padding: '10px 8px', overflowY: 'auto', maxHeight: '70vh' }}>
                {tree ? renderTreeNode(tree) : (
                  <div style={{ padding: 24, textAlign: 'center', color: '#71717A', fontSize: '12px' }}>
                    No files found matching the criteria.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── React Flow Dependency Graph View ── */
            <ReactFlowProvider>
              <DependencyGraphCanvas
                nodes={graphNodes}
                edges={graphEdges}
                onNodeClick={(node) => setSelectedPath(node.data?.path as string)}
                selectedNodeId={selectedFile ? `node_${selectedFile.path.replace(/[/.-]/g, '_')}` : null}
              />
            </ReactFlowProvider>
          )}
        </div>

        {/* ── Right Inspector: Selected File Details ── */}
        <div
          style={{
            backgroundColor: '#121212',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            overflowY: 'auto',
            maxHeight: '75vh'
          }}
        >
          {selectedFile ? (
            <>
              {/* File Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: getCategoryMeta(selectedFile.category).color,
                      backgroundColor: getCategoryMeta(selectedFile.category).bg,
                      padding: '2px 6px',
                      borderRadius: 4,
                      border: `1px solid ${getCategoryMeta(selectedFile.category).border}`
                    }}
                  >
                    {getCategoryMeta(selectedFile.category).label}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyPath(selectedFile.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'none',
                      border: 'none',
                      color: '#A1A1AA',
                      fontSize: '10px',
                      cursor: 'pointer'
                    }}
                    title="Copy path"
                  >
                    {copySuccess ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                    {copySuccess ? 'Copied' : 'Copy Path'}
                  </button>
                </div>

                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#F4F4F5', margin: '8px 0 2px', fontFamily: 'monospace' }}>
                  {selectedFile.name}
                </h2>
                <div style={{ fontSize: '11px', color: '#71717A', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {selectedFile.path}
                </div>
              </div>

              {/* Badges / Alerts */}
              {selectedFile.hasCircularDep && (
                <div style={{ padding: '8px 12px', borderRadius: 8, backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#EF4444', fontSize: '11px' }}>
                  ⚠️ <strong>Circular Dependency Detected:</strong> This file is part of a cyclic import loop.
                </div>
              )}

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                <div style={{ padding: 10, borderRadius: 8, backgroundColor: '#0D0D0D', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '9px', color: '#71717A', textTransform: 'uppercase' }}>Language</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#FAFAFA', fontFamily: 'monospace', marginTop: 2 }}>
                    {selectedFile.language || 'Code'}
                  </div>
                </div>

                <div style={{ padding: 10, borderRadius: 8, backgroundColor: '#0D0D0D', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '9px', color: '#71717A', textTransform: 'uppercase' }}>Lines</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#34D399', fontFamily: 'monospace', marginTop: 2 }}>
                    {selectedFile.lines || selectedFile.linesCount || 0} L
                  </div>
                </div>

                <div style={{ padding: 10, borderRadius: 8, backgroundColor: '#0D0D0D', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '9px', color: '#71717A', textTransform: 'uppercase' }}>Size</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#FAFAFA', fontFamily: 'monospace', marginTop: 2 }}>
                    {Math.round(((selectedFile.size || selectedFile.sizeBytes || 0) / 1024) * 10) / 10} KB
                  </div>
                </div>

                <div style={{ padding: 10, borderRadius: 8, backgroundColor: '#0D0D0D', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '9px', color: '#71717A', textTransform: 'uppercase' }}>Entry Point</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: selectedFile.isEntryPoint ? '#10B981' : '#71717A', fontFamily: 'monospace', marginTop: 2 }}>
                    {selectedFile.isEntryPoint ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              {/* Outgoing Dependencies (What this imports) */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#D4D4D8', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Outgoing Imports ({(selectedFile.imports || []).length})</span>
                  <span style={{ fontSize: '9px', color: '#71717A' }}>↑ OutDegree</span>
                </div>
                {(selectedFile.imports || []).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 130, overflowY: 'auto' }}>
                    {(selectedFile.imports as string[]).map((impPath) => (
                      <div
                        key={impPath}
                        onClick={() => setSelectedPath(impPath)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          backgroundColor: '#0D0D0D',
                          border: '1px solid rgba(255,255,255,0.05)',
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          color: '#A1A1AA',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                        className="hover:bg-white/10"
                        title="Click to view file"
                      >
                        <ArrowRight size={10} color="#60A5FA" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{impPath}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '10px', color: '#71717A', fontStyle: 'italic', padding: 6 }}>
                    No internal module dependencies.
                  </div>
                )}
              </div>

              {/* External Dependencies */}
              {(selectedFile.external_dependencies || selectedFile.externalDependencies || []).length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#D4D4D8', marginBottom: 6 }}>
                    External Packages ({((selectedFile.external_dependencies || selectedFile.externalDependencies) as string[]).length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxHeight: 100, overflowY: 'auto' }}>
                    {((selectedFile.external_dependencies || selectedFile.externalDependencies) as string[]).map((pkg) => (
                      <span
                        key={pkg}
                        style={{
                          fontSize: '9px',
                          fontFamily: 'monospace',
                          padding: '2px 6px',
                          borderRadius: 4,
                          backgroundColor: '#1E1E1E',
                          color: '#D4D4D8',
                          border: '1px solid rgba(255,255,255,0.08)'
                        }}
                      >
                        {pkg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Exports */}
              {(selectedFile.exports || []).length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#D4D4D8', marginBottom: 6 }}>
                    Exported Symbols ({(selectedFile.exports as string[]).length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxHeight: 100, overflowY: 'auto' }}>
                    {(selectedFile.exports as string[]).map((exp) => (
                      <span
                        key={exp}
                        style={{
                          fontSize: '9px',
                          fontFamily: 'monospace',
                          padding: '2px 6px',
                          borderRadius: 4,
                          backgroundColor: 'rgba(52, 211, 153, 0.1)',
                          color: '#34D399',
                          border: '1px solid rgba(52, 211, 153, 0.25)'
                        }}
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Jump to File Flow button */}
              <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <Link
                  to={`/file-flow?file=${encodeURIComponent(selectedFile.path)}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '8px 12px',
                    borderRadius: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FAFAFA',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <Compass size={13} /> Open in AST File Flow <ExternalLink size={11} />
                </Link>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: '#71717A', textAlign: 'center', padding: 24 }}>
              <FolderTree size={36} color="#404040" />
              <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#A1A1AA' }}>
                Select a file from the tree or graph to inspect its architectural topology, dependencies, and metadata.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

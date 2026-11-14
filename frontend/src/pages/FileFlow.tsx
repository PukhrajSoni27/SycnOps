import React, { useState, useEffect, useMemo, useCallback, useDeferredValue, useRef } from 'react'
import {
  ReactFlow,
  Background,
  MiniMap,
  Panel,
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
  FileCode2,
  Server,
  Database,
  Cpu,
  Search,
  Filter,
  RefreshCw,
  Layers,
  ArrowRight,
  Code2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Network,
  Zap,
  ShieldCheck,
  AlertCircle,
  FileText,
  Boxes,
  Sparkles,
  GitBranch,
  X,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Repeat,
  Radio,
  Unplug,
  Plus,
  Minus,
  Maximize2
} from 'lucide-react'
import {
  useFileFlowGraphQuery,
  useFileDetailsQuery,
  useScanFileFlowMutation,
  useFileFlowPathsQuery
} from '@/hooks/useApi'
import { FileFlowNodeData } from '@/services/api'


// ── Custom Node Components ─────────────────────────────────────
const FileNodeComponent = React.memo(function FileNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as FileFlowNodeData
  const isSelected = selected
  const category = nodeData.category || 'frontend'
  const isDisconnected = nodeData.isDisconnected
  const isOrphan = nodeData.isOrphan
  const isCircular = nodeData.isCircular

  const catColors: Record<string, { bg: string; text: string; border: string }> = {
    frontend: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60A5FA', border: 'rgba(59, 130, 246, 0.45)' },
    backend: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.45)' },
    database: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', border: 'rgba(16, 185, 129, 0.45)' },
    config: { bg: 'rgba(168, 85, 247, 0.15)', text: '#c489ffff', border: 'rgba(168, 85, 247, 0.45)' }
  }

  const activeColor = catColors[category] || catColors.frontend

  return (
    <div
      style={{
        width: 270,
        borderRadius: '12px',
        padding: '12px 14px',
        backgroundColor: '#161412',
        border: isSelected
          ? '2px solid #E8D2B5'
          : isCircular
          ? '2px solid #F43F5E'
          : isDisconnected
          ? '1px dashed #EF4444'
          : `1px solid ${activeColor.border}`,
        boxShadow: isSelected
          ? '0 0 20px rgba(232, 210, 181, 0.35), 0 4px 16px rgba(0,0,0,0.8)'
          : isCircular
          ? '0 0 16px rgba(244, 63, 94, 0.3)'
          : '0 4px 14px rgba(0, 0, 0, 0.5)',
        cursor: 'pointer',
        contain: 'paint layout'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#E8D2B5', width: 8, height: 8 }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden' }}>
          <div
            style={{
              padding: 5,
              borderRadius: 6,
              backgroundColor: activeColor.bg,
              color: activeColor.text
            }}
          >
            <FileCode2 size={15} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '12px',
              fontWeight: 600,
              color: '#F5F5F4',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 160
            }}
            title={nodeData.name || nodeData.label}
          >
            {nodeData.name || nodeData.label}
          </span>
        </div>
        <span
          style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono, monospace)',
            padding: '2px 6px',
            borderRadius: '999px',
            backgroundColor: activeColor.bg,
            color: activeColor.text,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {category}
        </span>
      </div>

      {/* Path */}
      <div
        style={{
          fontSize: '10px',
          color: '#78716C',
          fontFamily: 'var(--font-mono, monospace)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: 6
        }}
        title={nodeData.path}
      >
        {nodeData.path}
      </div>

      {/* Badges for Circular / Disconnected / Orphan */}
      {(isCircular || isDisconnected || isOrphan) && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
          {isCircular && (
            <span
              style={{
                fontSize: '8px',
                fontFamily: 'monospace',
                padding: '1px 5px',
                borderRadius: '4px',
                backgroundColor: 'rgba(244, 63, 94, 0.2)',
                color: '#FB7185',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 3
              }}
            >
              <Repeat size={10} /> Circular Loop
            </span>
          )}
          {isDisconnected && (
            <span
              style={{
                fontSize: '8px',
                fontFamily: 'monospace',
                padding: '1px 5px',
                borderRadius: '4px',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#F87171',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 3
              }}
            >
              <Unplug size={10} /> Disconnected
            </span>
          )}
          {isOrphan && !isDisconnected && (
            <span
              style={{
                fontSize: '8px',
                fontFamily: 'monospace',
                padding: '1px 5px',
                borderRadius: '4px',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                color: '#FBBF24',
                border: '1px solid rgba(245, 158, 11, 0.4)'
              }}
            >
              No Inflow
            </span>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          paddingTop: 6,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          textAlign: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: '9px', color: '#78716C', textTransform: 'uppercase' }}>Lines</div>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#D6D3D1', fontWeight: 600 }}>
            {nodeData.lines || nodeData.linesCount || 0}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '9px', color: '#78716C', textTransform: 'uppercase' }}>Funcs</div>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#34D399', fontWeight: 600 }}>
            {nodeData.functionsCount || 0}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '9px', color: '#78716C', textTransform: 'uppercase' }}>In</div>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#38BDF8', fontWeight: 600 }}>
            {nodeData.incomingEdgesCount || 0}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '9px', color: '#78716C', textTransform: 'uppercase' }}>Out</div>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#F472B6', fontWeight: 600 }}>
            {nodeData.outgoingEdgesCount || (nodeData.importsCount || 0)}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#E8D2B5', width: 8, height: 8 }} />
    </div>
  )
})

const ApiNodeComponent = React.memo(function ApiNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as FileFlowNodeData
  const isSelected = selected
  const method = (nodeData.method || 'GET').toUpperCase()

  const methodColor =
    method === 'GET'
      ? { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', border: 'rgba(16, 185, 129, 0.4)' }
      : method === 'POST'
      ? { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.4)' }
      : method === 'PUT' || method === 'PATCH'
      ? { bg: 'rgba(59, 130, 246, 0.15)', text: '#60A5FA', border: 'rgba(59, 130, 246, 0.4)' }
      : { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.4)' }

  return (
    <div
      style={{
        width: 260,
        borderRadius: '12px',
        padding: '12px 14px',
        backgroundColor: '#161412',
        border: isSelected ? '2px solid #E8D2B5' : `1px solid ${methodColor.border}`,
        boxShadow: isSelected
          ? '0 0 20px rgba(232, 210, 181, 0.35), 0 4px 16px rgba(0,0,0,0.8)'
          : '0 4px 14px rgba(0, 0, 0, 0.5)',
        cursor: 'pointer',
        contain: 'paint layout'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#34D399', width: 8, height: 8 }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ padding: 5, borderRadius: 6, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
            <Server size={15} />
          </div>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: methodColor.bg,
              color: methodColor.text,
              fontSize: '10px',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 700
            }}
          >
            {method}
          </span>
        </div>
        <span
          style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono, monospace)',
            padding: '2px 6px',
            borderRadius: '999px',
            backgroundColor: 'rgba(232, 210, 181, 0.1)',
            color: '#E8D2B5'
          }}
        >
          REST ENDPOINT
        </span>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '12px',
          color: '#F5F5F4',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: 4
        }}
        title={nodeData.route || nodeData.path}
      >
        {nodeData.route || nodeData.path}
      </div>

      <div style={{ fontSize: '10px', color: '#78716C', fontFamily: 'var(--font-mono, monospace)' }}>
        Endpoint: <span style={{ color: '#D6D3D1' }}>{nodeData.label || 'API Route'}</span>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#34D399', width: 8, height: 8 }} />
    </div>
  )
})

const DatabaseNodeComponent = React.memo(function DatabaseNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as FileFlowNodeData
  const isSelected = selected

  return (
    <div
      style={{
        width: 260,
        borderRadius: '12px',
        padding: '12px 14px',
        backgroundColor: '#161412',
        border: isSelected ? '2px solid #E8D2B5' : '1px solid rgba(245, 158, 11, 0.45)',
        boxShadow: isSelected
          ? '0 0 20px rgba(232, 210, 181, 0.35), 0 4px 16px rgba(0,0,0,0.8)'
          : '0 4px 14px rgba(0, 0, 0, 0.5)',
        cursor: 'pointer',
        contain: 'paint layout'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#F59E0B', width: 8, height: 8 }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ padding: 5, borderRadius: 6, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
            <Database size={15} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#F5F5F4', fontFamily: 'var(--font-mono, monospace)' }}>
            Firestore DB
          </span>
        </div>
        <span
          style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono, monospace)',
            padding: '2px 6px',
            borderRadius: '999px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: '#FBBF24',
            fontWeight: 600
          }}
        >
          FIREBASE
        </span>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '12px',
          color: '#E8D2B5',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: 4
        }}
        title={`Collection: ${nodeData.collection || nodeData.label}`}
      >
        Cloud Firestore
      </div>

      <div style={{ fontSize: '10px', color: '#78716C', fontFamily: 'var(--font-mono, monospace)' }}>
        Target: <span style={{ color: '#FBBF24' }}>users, pipeline_runs, file_flows</span>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#F59E0B', width: 8, height: 8 }} />
    </div>
  )
})

const MLNodeComponent = React.memo(function MLNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as FileFlowNodeData
  const isSelected = selected

  return (
    <div
      style={{
        width: 260,
        borderRadius: '12px',
        padding: '12px 14px',
        backgroundColor: '#161412',
        border: isSelected ? '2px solid #E8D2B5' : '1px solid rgba(139, 92, 246, 0.45)',
        boxShadow: isSelected
          ? '0 0 20px rgba(232, 210, 181, 0.35), 0 4px 16px rgba(0,0,0,0.8)'
          : '0 4px 14px rgba(0, 0, 0, 0.5)',
        cursor: 'pointer',
        contain: 'paint layout'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#8B5CF6', width: 8, height: 8 }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ padding: 5, borderRadius: 6, backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA' }}>
            <Cpu size={15} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#F5F5F4', fontFamily: 'var(--font-mono, monospace)' }}>
            ML Engine
          </span>
        </div>
        <span
          style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono, monospace)',
            padding: '2px 6px',
            borderRadius: '999px',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            color: '#C4B5FD',
            fontWeight: 600
          }}
        >
          SCIKIT / XGB
        </span>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '12px',
          color: '#E8D2B5',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: 4
        }}
      >
        {nodeData.label || 'Prediction Model'}
      </div>

      <div style={{ fontSize: '10px', color: '#78716C', fontFamily: 'var(--font-mono, monospace)' }}>
        Target: <span style={{ color: '#C4B5FD' }}>Predictive Analytics</span>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#8B5CF6', width: 8, height: 8 }} />
    </div>
  )
})

// ── Ultra-Prominent Zoom & View Toolbar ────────────────────────
function ZoomToolbar() {
  const { zoomIn, zoomOut, fitView, zoomTo, getZoom } = useReactFlow()
  const [zoomPercent, setZoomPercent] = useState(100)

  useEffect(() => {
    const updateZoom = () => {
      try {
        const z = getZoom()
        if (typeof z === 'number' && !isNaN(z)) {
          setZoomPercent(Math.round(z * 100))
        }
      } catch {}
    }
    updateZoom()
    const timer = setInterval(updateZoom, 200)
    return () => clearInterval(timer)
  }, [getZoom])

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 8px',
        backgroundColor: '#181614',
        border: '1.5px solid rgba(232, 210, 181, 0.45)',
        borderRadius: 12,
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(89, 9, 7, 0.4)',
        userSelect: 'none'
      }}
    >
      {/* Zoom In */}
      <button
        type="button"
        onClick={() => zoomIn({ duration: 250 })}
        title="Zoom In (Ctrl + Plus)"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: '#262220',
          border: '1px solid rgba(232, 210, 181, 0.3)',
          color: '#F5F5F4',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease, border-color 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#590907'
          e.currentTarget.style.borderColor = '#E8D2B5'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#262220'
          e.currentTarget.style.borderColor = 'rgba(232, 210, 181, 0.3)'
        }}
      >
        <Plus size={18} strokeWidth={2.5} />
      </button>

      {/* Zoom Percentage */}
      <button
        type="button"
        onClick={() => zoomTo(1, { duration: 250 })}
        title="Reset Zoom to 100%"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 10px',
          height: 36,
          borderRadius: 8,
          backgroundColor: '#262220',
          border: '1px solid rgba(232, 210, 181, 0.3)',
          color: '#E8D2B5',
          fontSize: '11px',
          fontFamily: 'monospace',
          fontWeight: 700,
          cursor: 'pointer',
          minWidth: 54,
          transition: 'background-color 0.15s ease, border-color 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#590907'
          e.currentTarget.style.borderColor = '#E8D2B5'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#262220'
          e.currentTarget.style.borderColor = 'rgba(232, 210, 181, 0.3)'
        }}
      >
        {zoomPercent}%
      </button>

      {/* Zoom Out */}
      <button
        type="button"
        onClick={() => zoomOut({ duration: 250 })}
        title="Zoom Out (Ctrl + Minus)"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: '#262220',
          border: '1px solid rgba(232, 210, 181, 0.3)',
          color: '#F5F5F4',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease, border-color 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#590907'
          e.currentTarget.style.borderColor = '#E8D2B5'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#262220'
          e.currentTarget.style.borderColor = 'rgba(232, 210, 181, 0.3)'
        }}
      >
        <Minus size={18} strokeWidth={2.5} />
      </button>

      {/* Divider */}
      <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255, 255, 255, 0.12)', margin: '0 2px' }} />

      {/* Fit Screen */}
      <button
        type="button"
        onClick={() => fitView({ duration: 350, padding: 0.2 })}
        title="Fit All Files to Screen"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 12px',
          height: 36,
          borderRadius: 8,
          backgroundColor: '#262220',
          border: '1px solid rgba(232, 210, 181, 0.3)',
          color: '#E8D2B5',
          fontSize: '11px',
          fontFamily: 'monospace',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background-color 0.15s ease, border-color 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#590907'
          e.currentTarget.style.borderColor = '#E8D2B5'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#262220'
          e.currentTarget.style.borderColor = 'rgba(232, 210, 181, 0.3)'
        }}
      >
        <Maximize2 size={14} />
        <span>Fit Screen</span>
      </button>
    </div>
  )
}

const nodeTypes = {
  fileNode: FileNodeComponent,
  apiNode: ApiNodeComponent,
  databaseNode: DatabaseNodeComponent,
  mlNode: MLNodeComponent
}

// ── Main Page Component ────────────────────────────────────────

function FileFlowContent() {
  const [projectId] = useState('sycnops')
  const [searchQuery, setSearchQuery] = useState('')
  const deferredSearch = useDeferredValue(searchQuery)
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'frontend' | 'backend' | 'database' | 'config' | 'disconnected' | 'circular'>('all')
  const [relationshipFilter, setRelationshipFilter] = useState<'all' | 'import' | 'http_request' | 'api_call' | 'db_operation'>('all')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [sourceTraceNode, setSourceTraceNode] = useState<string | null>(null)
  const [targetTraceNode, setTargetTraceNode] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  // API Queries and Mutations
  const { data: graphData, isLoading, isError, error, refetch } = useFileFlowGraphQuery(projectId)
  const scanMutation = useScanFileFlowMutation()

  // Selected file details query
  const selectedNode = useMemo(() => {
    if (!selectedNodeId || !graphData?.nodes) return null
    return graphData.nodes.find((n) => n.id === selectedNodeId) || null
  }, [selectedNodeId, graphData])

  const selectedFilePath = useMemo(() => {
    if (!selectedNode) return null
    return selectedNode.data?.path || null
  }, [selectedNode])

  const { data: fileDetails, isLoading: detailsLoading } = useFileDetailsQuery(selectedFilePath)

  // Path tracing query
  const { data: tracePaths } = useFileFlowPathsQuery(sourceTraceNode, targetTraceNode, projectId)

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // Store user-dragged node coordinates to avoid layout recalculation thrashing
  const nodePositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map())

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes)
      for (const change of changes) {
        if (change.type === 'position' && change.position) {
          nodePositionsRef.current.set(change.id, change.position)
        }
      }
    },
    [onNodesChange]
  )

  // Highlighted path IDs
  const activePathEdgeIds = useMemo(() => {
    if (!tracePaths || tracePaths.length === 0) return new Set<string>()
    const edgeSet = new Set<string>()
    tracePaths.forEach((path) => {
      for (let i = 0; i < path.length - 1; i++) {
        const u = path[i].id
        const v = path[i + 1].id
        const matched = graphData?.edges?.find(
          (e) => (e.source === u && e.target === v) || (e.source === v && e.target === u)
        )
        if (matched) edgeSet.add(matched.id)
      }
    })
    return edgeSet
  }, [tracePaths, graphData])

  // Connected files calculation (When user clicks any file, highlight all connected files)
  const { connectedNodeIds, connectedEdgeIds } = useMemo(() => {
    if (!selectedNodeId || !graphData?.edges) {
      return { connectedNodeIds: new Set<string>(), connectedEdgeIds: new Set<string>() }
    }
    const nodesSet = new Set<string>([selectedNodeId])
    const edgesSet = new Set<string>()

    // Direct 1-hop connections
    graphData.edges.forEach((e) => {
      if (e.source === selectedNodeId) {
        nodesSet.add(e.target)
        edgesSet.add(e.id)
      } else if (e.target === selectedNodeId) {
        nodesSet.add(e.source)
        edgesSet.add(e.id)
      }
    })

    // 2-hop connections
    graphData.edges.forEach((e) => {
      if (nodesSet.has(e.source) && nodesSet.has(e.target)) {
        edgesSet.add(e.id)
      }
    })

    return { connectedNodeIds: nodesSet, connectedEdgeIds: edgesSet }
  }, [selectedNodeId, graphData])

  // Synchronize graph data into React Flow with ultra-smooth layout & edge optimization
  useEffect(() => {
    if (!graphData?.nodes) return

    const lowerSearch = deferredSearch.toLowerCase().trim()

    // 1. Filter Nodes by search and category
    const filteredNodes = graphData.nodes.filter((node) => {
      const label = (node.data.label || '').toLowerCase()
      const path = (node.data.path || '').toLowerCase()
      const name = (node.data.name || '').toLowerCase()
      const route = (node.data.route || '').toLowerCase()
      const matchesSearch = !lowerSearch || label.includes(lowerSearch) || path.includes(lowerSearch) || name.includes(lowerSearch) || route.includes(lowerSearch)
      if (!matchesSearch) return false

      if (categoryFilter === 'all') return true
      if (categoryFilter === 'disconnected') return node.data.isDisconnected || node.data.isOrphan
      if (categoryFilter === 'circular') return node.data.isCircular
      return (node.category || node.data.category) === categoryFilter
    })

    const visibleNodeIds = new Set(filteredNodes.map((n) => n.id))

    // 2. Filter Edges by relationship type and visible nodes
    const filteredEdges = (graphData.edges || []).filter((edge) => {
      if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) return false
      if (relationshipFilter === 'all') return true
      return edge.type === relationshipFilter
    })

    const hasSelection = Boolean(selectedNodeId)

    // 3. Map to Flow Nodes with Zero-lag Layout & Cached Coordinates
    const flowNodes: Node[] = filteredNodes.map((n, idx) => {
      const isSelected = n.id === selectedNodeId
      const isConnected = connectedNodeIds.has(n.id)
      const opacity = !hasSelection || isConnected ? 1 : 0.18

      // Deterministic layout with persistent cached drag coordinates
      const cachedPos = nodePositionsRef.current.get(n.id)
      const col = idx % 5
      const row = Math.floor(idx / 5)
      const x = cachedPos?.x ?? n.position?.x ?? (col * 320 + 40)
      const y = cachedPos?.y ?? n.position?.y ?? (row * 200 + 40)

      return {
        id: n.id,
        type: n.type || 'fileNode',
        position: { x, y },
        data: n.data,
        selected: isSelected || n.id === sourceTraceNode || n.id === targetTraceNode,
        style: {
          opacity,
          zIndex: isSelected ? 20 : isConnected ? 10 : 1
        }
      }
    })

    // 4. Map to Flow Edges with Streamlined Edge Animations (no continuous CPU loops)
    const flowEdges: Edge[] = filteredEdges.map((e) => {
      const isPathEdge = activePathEdgeIds.has(e.id)
      const isConnectedEdge = connectedEdgeIds.has(e.id)
      const isHttpRequest = e.type === 'http_request'
      const isApiCall = e.type === 'api_call'
      const isDbOp = e.type === 'db_operation'
      const isCircular = e.isCircular

      const edgeColor = isCircular
        ? '#F43F5E'
        : isPathEdge
        ? '#E8D2B5'
        : isHttpRequest
        ? '#38BDF8'
        : isApiCall
        ? '#34D399'
        : isDbOp
        ? '#F59E0B'
        : 'rgba(232, 210, 181, 0.35)'

      const opacity = !hasSelection || isConnectedEdge || isPathEdge ? 1 : 0.08
      const strokeWidth = isPathEdge ? 3.5 : isConnectedEdge ? 2.5 : isHttpRequest ? 2 : 1.5

      // Only animate edges actively selected or on traced path - saves massive CPU/GPU render loops!
      const isAnimated = isPathEdge || (hasSelection && isConnectedEdge)

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: isAnimated,
        label: isCircular
          ? '⚠️ Circular'
          : isHttpRequest
          ? '⚡ HTTP'
          : e.confidence === 'unresolved'
          ? '⚠️ unresolved'
          : e.label || '',
        style: {
          stroke: edgeColor,
          strokeWidth,
          opacity
        },
        labelStyle: {
          fill: isCircular ? '#FB7185' : isHttpRequest ? '#38BDF8' : isConnectedEdge ? '#E8D2B5' : '#78716C',
          fontSize: 9,
          fontFamily: 'monospace',
          fontWeight: 600
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 14,
          height: 14
        }
      }
    })

    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [
    graphData,
    deferredSearch,
    categoryFilter,
    relationshipFilter,
    selectedNodeId,
    connectedNodeIds,
    connectedEdgeIds,
    sourceTraceNode,
    targetTraceNode,
    activePathEdgeIds
  ])

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId((prev) => (prev === node.id ? null : node.id))
  }, [])

  // Relationships for the selected node: dependencies (outgoing) and dependents (incoming)
  const selectedNodeRelationships = useMemo(() => {
    if (!selectedNodeId || !graphData?.edges) return { incoming: [], outgoing: [] }
    const incoming = graphData.edges
      .filter((e) => e.target === selectedNodeId)
      .map((e) => ({
        edgeId: e.id,
        otherId: e.source,
        type: e.type,
        evidence: e.evidence,
        otherNode: graphData.nodes.find((n) => n.id === e.source)
      }))
    const outgoing = graphData.edges
      .filter((e) => e.source === selectedNodeId)
      .map((e) => ({
        edgeId: e.id,
        otherId: e.target,
        type: e.type,
        evidence: e.evidence,
        otherNode: graphData.nodes.find((n) => n.id === e.target)
      }))
    return { incoming, outgoing }
  }, [selectedNodeId, graphData])

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleRescan = () => {
    scanMutation.mutate(projectId)
  }

  return (
    <div className="s-page" style={{ position: 'relative', minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header bar */}
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
            <Network size={18} />
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
              File Flow — How Files Communicate
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono, monospace)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontWeight: 600
                }}
              >
                FEATURE 3 • AST GRAPH
              </span>
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#A8A29E' }}>
              Detects imports, require statements, HTTP request communications, and Firebase Firestore database operations.
            </p>
          </div>
        </div>

        {/* Rescan Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleRescan}
            disabled={scanMutation.isPending}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 8,
              backgroundColor: scanMutation.isPending ? 'rgba(89, 9, 7, 0.5)' : '#590907',
              color: '#E8D2B5',
              border: '1px solid rgba(232, 210, 181, 0.3)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: scanMutation.isPending ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 10px rgba(89, 9, 7, 0.6)'
            }}
          >
            <RefreshCw size={14} className={scanMutation.isPending ? 'animate-spin' : ''} />
            {scanMutation.isPending ? 'Scanning AST...' : 'Rescan Repository'}
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      {graphData?.summary && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 10,
            marginBottom: 16
          }}
        >
          <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Source Files</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#F5F5F4', fontFamily: 'monospace' }}>
              {graphData.summary.totalFiles}
            </div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Total Nodes</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#E8D2B5', fontFamily: 'monospace' }}>
              {graphData.summary.totalNodes}
            </div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Dependencies</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#38BDF8', fontFamily: 'monospace' }}>
              {graphData.summary.totalEdges}
            </div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>API Endpoints</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#34D399', fontFamily: 'monospace' }}>
              {graphData.summary.apiEndpointsDetected}
            </div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>HTTP Bridges</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace' }}>
              {graphData.summary.matchedConnections}
            </div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Firestore DB Ops</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#FBBF24', fontFamily: 'monospace' }}>
              {graphData.summary.databaseOperations}
            </div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Disconnected Files</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#F87171', fontFamily: 'monospace' }}>
              {graphData.summary.disconnectedFilesCount || 0}
            </div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Circular Loops</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: (graphData.summary.circularDependenciesCount || 0) > 0 ? '#FB7185' : '#34D399', fontFamily: 'monospace' }}>
              {graphData.summary.circularDependenciesCount || 0}
            </div>
          </div>
        </div>
      )}

      {/* Toolbar: Category Filters, Search, Edge Types */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginBottom: 12,
          padding: '12px 16px',
          backgroundColor: '#141210',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 240px', maxWidth: 360 }}>
            <Search size={15} color="#78716C" />
            <input
              type="text"
              placeholder="Search files (e.g. auth.js, api.ts)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '12px',
                color: '#F5F5F4',
                fontFamily: 'var(--font-mono, monospace)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#78716C', cursor: 'pointer', padding: 2 }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: '#78716C', marginRight: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Filter size={12} /> Category:
            </span>
            {(
              [
                { id: 'all', label: 'All Files' },
                { id: 'frontend', label: 'Frontend' },
                { id: 'backend', label: 'Backend' },
                { id: 'database', label: 'Database' },
                { id: 'config', label: 'Config' },
                { id: 'disconnected', label: 'Disconnected' }
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  border: categoryFilter === cat.id ? '1px solid #E8D2B5' : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: categoryFilter === cat.id ? 'rgba(232, 210, 181, 0.15)' : 'transparent',
                  color: categoryFilter === cat.id ? '#E8D2B5' : '#A8A29E'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Second Row: Relationship Type & Path Tracer */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 8, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          {/* Edge Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: '#78716C', marginRight: 4 }}>Relationships:</span>
            {(
              [
                { id: 'all', label: 'All Edges' },
                { id: 'import', label: 'Imports' },
                { id: 'http_request', label: 'HTTP Requests' },
                { id: 'db_operation', label: 'Firestore DB' }
              ] as const
            ).map((rel) => (
              <button
                key={rel.id}
                onClick={() => setRelationshipFilter(rel.id)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  border: relationshipFilter === rel.id ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: relationshipFilter === rel.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: relationshipFilter === rel.id ? '#38BDF8' : '#A8A29E'
                }}
              >
                {rel.label}
              </button>
            ))}
          </div>

          {/* Path Tracer Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '11px', color: '#78716C', display: 'flex', alignItems: 'center', gap: 4 }}>
              <GitBranch size={12} /> Trace Flow:
            </span>
            <select
              value={sourceTraceNode || ''}
              onChange={(e) => setSourceTraceNode(e.target.value || null)}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                background: '#0F0E0D',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#D6D3D1',
                fontSize: '11px',
                maxWidth: 140
              }}
            >
              <option value="">Source File...</option>
              {graphData?.nodes
                ?.filter((n) => n.type === 'fileNode')
                .map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.data.name || n.data.label}
                  </option>
                ))}
            </select>
            <ArrowRight size={12} color="#78716C" />
            <select
              value={targetTraceNode || ''}
              onChange={(e) => setTargetTraceNode(e.target.value || null)}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                background: '#0F0E0D',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#D6D3D1',
                fontSize: '11px',
                maxWidth: 140
              }}
            >
              <option value="">Target File...</option>
              {graphData?.nodes
                ?.filter((n) => n.type === 'fileNode')
                .map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.data.name || n.data.label}
                  </option>
                ))}
            </select>
            {(sourceTraceNode || targetTraceNode) && (
              <button
                onClick={() => {
                  setSourceTraceNode(null)
                  setTargetTraceNode(null)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Canvas and File Details Drawer */}
      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 650, position: 'relative' }}>
        {/* Canvas */}
        <div
          style={{
            flex: 1,
            height: '75vh',
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid rgba(89, 9, 7, 0.35)',
            backgroundColor: '#0A0908',
            position: 'relative'
          }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
              <RefreshCw size={24} className="animate-spin" color="#E8D2B5" />
              <div style={{ color: '#E8D2B5', fontFamily: 'monospace', fontSize: '13px' }}>
                Analyzing repository AST and building file-to-file relationships...
              </div>
            </div>
          ) : isError ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: '#EF4444' }}>
              <AlertCircle size={32} />
              <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                {error?.message || 'Failed to load file flow graph.'}
              </div>
              <button
                onClick={() => refetch()}
                style={{ padding: '6px 14px', borderRadius: 6, backgroundColor: '#590907', color: '#E8D2B5', border: 'none', cursor: 'pointer' }}
              >
                Retry Scan
              </button>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.15}
              maxZoom={2.5}
              onlyRenderVisibleElements={true}
              elementsSelectable={true}
              nodesDraggable={true}
              nodesConnectable={false}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#590907" gap={24} size={1} style={{ opacity: 0.15 }} />
              <Panel position="bottom-left" style={{ margin: '0 0 16px 16px', zIndex: 40 }}>
                <ZoomToolbar />
              </Panel>
              <MiniMap
                nodeColor={(n) => {
                  if (n.type === 'apiNode') return '#34D399'
                  if (n.type === 'databaseNode') return '#F59E0B'
                  if (n.type === 'mlNode') return '#8B5CF6'
                  return '#590907'
                }}
                style={{
                  backgroundColor: '#141210',
                  border: '1px solid rgba(89, 9, 7, 0.5)',
                  borderRadius: 8
                }}
              />
              <Panel position="top-left">
                <div
                  style={{
                    backgroundColor: 'rgba(20, 18, 16, 0.9)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#A8A29E',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#60A5FA' }} /> Frontend
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FBBF24' }} /> Backend
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#34D399' }} /> Database
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#38BDF8' }} /> HTTP Request
                  </span>
                  {selectedNodeId && (
                    <span style={{ color: '#E8D2B5', fontWeight: 600 }}>
                      • Highlighting connected network ({connectedNodeIds.size} files)
                    </span>
                  )}
                </div>
              </Panel>
            </ReactFlow>
          )}
        </div>

        {/* Selected File Details Drawer */}
        {selectedNode && (
          <div
            style={{
              width: 460,
              maxHeight: '75vh',
              overflowY: 'auto',
              backgroundColor: '#141210',
              borderRadius: 16,
              border: '1px solid rgba(89, 9, 7, 0.5)',
              padding: 20,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    color: '#E8D2B5',
                    letterSpacing: '0.08em'
                  }}
                >
                  {selectedNode.type?.toUpperCase()} DETAILS
                </span>
                <h3
                  style={{
                    margin: '4px 0 0',
                    fontSize: '16px',
                    fontFamily: 'monospace',
                    color: '#F5F5F4',
                    wordBreak: 'break-all'
                  }}
                >
                  {selectedNode.data?.name || selectedNode.data?.label}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#78716C',
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Trace Buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setSourceTraceNode(selectedNode.id)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: 6,
                  backgroundColor: sourceTraceNode === selectedNode.id ? '#590907' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#E8D2B5',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  cursor: 'pointer'
                }}
              >
                {sourceTraceNode === selectedNode.id ? '✓ Trace Source' : 'Set as Source'}
              </button>
              <button
                onClick={() => setTargetTraceNode(selectedNode.id)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: 6,
                  backgroundColor: targetTraceNode === selectedNode.id ? '#590907' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#E8D2B5',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  cursor: 'pointer'
                }}
              >
                {targetTraceNode === selectedNode.id ? '✓ Trace Target' : 'Set as Target'}
              </button>
            </div>

            {/* Path info */}
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#78716C',
                padding: '8px 10px',
                borderRadius: 6,
                backgroundColor: '#0F0E0D',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                wordBreak: 'break-all'
              }}
            >
              {selectedNode.data?.path || 'N/A'}
            </div>

            {/* Disconnected / Unused Status Box */}
            {(selectedNode.data?.isDisconnected || selectedNode.data?.isOrphan) && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#F87171', fontSize: '11px', fontWeight: 600 }}>
                  <AlertTriangle size={14} />
                  {selectedNode.data?.isDisconnected ? 'Disconnected File (Confidence: High)' : 'Unused Candidate (Confidence: Inferred)'}
                </div>
                <div style={{ fontSize: '10px', color: '#D6D3D1', marginTop: 4, lineHeight: 1.4 }}>
                  {selectedNode.data?.isDisconnected
                    ? 'This file has 0 incoming imports and 0 outgoing dependencies. It is completely isolated.'
                    : 'No other source file imports this file. It may be dead code or an unlinked utility.'}
                </div>
              </div>
            )}

            {/* Circular Dependency Warning */}
            {selectedNode.data?.isCircular && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  backgroundColor: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FB7185', fontSize: '11px', fontWeight: 600 }}>
                  <Repeat size={14} /> Circular Dependency Cycle Detected!
                </div>
                <div style={{ fontSize: '10px', color: '#D6D3D1', marginTop: 4 }}>
                  This file is part of a circular loop where imports eventually loop back to itself.
                </div>
              </div>
            )}

            {/* 1. Dependencies (Outgoing - What this file imports / calls) */}
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  color: '#38BDF8',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <ArrowDownRight size={14} /> Dependencies ({selectedNodeRelationships.outgoing.length})
              </div>

              {selectedNodeRelationships.outgoing.length === 0 ? (
                <div style={{ fontSize: '10px', color: '#78716C', fontStyle: 'italic' }}>
                  No outgoing dependencies (leaf node).
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {selectedNodeRelationships.outgoing.map((rel) => (
                    <div
                      key={rel.edgeId}
                      onClick={() => setSelectedNodeId(rel.otherId)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 6,
                        backgroundColor: '#0F0E0D',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontFamily: 'monospace'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#D6D3D1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>
                          {rel.otherNode?.data?.label || rel.otherNode?.data?.name || rel.otherId}
                        </span>
                        <span
                          style={{
                            fontSize: '9px',
                            color: rel.type === 'http_request' ? '#38BDF8' : rel.type === 'api_call' ? '#34D399' : rel.type === 'db_operation' ? '#F59E0B' : '#60A5FA',
                            textTransform: 'uppercase',
                            fontWeight: 600
                          }}
                        >
                          {rel.type === 'http_request' ? 'HTTP Request' : rel.type}
                        </span>
                      </div>
                      {rel.evidence && (
                        <div style={{ fontSize: '9px', color: '#78716C', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {rel.evidence}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Dependents (Incoming - Which files import this file) */}
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  color: '#34D399',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <ArrowUpRight size={14} /> Dependents ({selectedNodeRelationships.incoming.length})
              </div>

              {selectedNodeRelationships.incoming.length === 0 ? (
                <div style={{ fontSize: '10px', color: '#78716C', fontStyle: 'italic' }}>
                  No other files import this file directly.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {selectedNodeRelationships.incoming.map((rel) => (
                    <div
                      key={rel.edgeId}
                      onClick={() => setSelectedNodeId(rel.otherId)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 6,
                        backgroundColor: '#0F0E0D',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontFamily: 'monospace'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#D6D3D1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>
                          {rel.otherNode?.data?.label || rel.otherNode?.data?.name || rel.otherId}
                        </span>
                        <span
                          style={{
                            fontSize: '9px',
                            color: rel.type === 'http_request' ? '#38BDF8' : rel.type === 'api_call' ? '#34D399' : '#60A5FA',
                            textTransform: 'uppercase',
                            fontWeight: 600
                          }}
                        >
                          {rel.type === 'http_request' ? 'HTTP Request' : rel.type}
                        </span>
                      </div>
                      {rel.evidence && (
                        <div style={{ fontSize: '9px', color: '#78716C', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {rel.evidence}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Extracted AST Functions */}
            {fileDetails && (
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: '#E8D2B5',
                    textTransform: 'uppercase',
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Code2 size={13} /> Extracted Functions ({fileDetails.functions.length})
                </div>
                <div style={{ maxHeight: 130, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {fileDetails.functions.length === 0 ? (
                    <div style={{ fontSize: '10px', color: '#78716C', fontStyle: 'italic' }}>No function declarations.</div>
                  ) : (
                    fileDetails.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '5px 8px',
                          borderRadius: 6,
                          backgroundColor: '#0F0E0D',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{ color: '#34D399' }}>
                          {fn.isAsync ? 'async ' : ''}
                          {fn.name}()
                        </span>
                        <span style={{ color: '#78716C' }}>L{fn.line}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Source Code Viewer */}
            {fileDetails?.code && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: '#E8D2B5',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <FileText size={13} /> Source Code ({fileDetails.linesCount} lines)
                  </div>
                  <button
                    onClick={() => handleCopyCode(fileDetails.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'none',
                      border: 'none',
                      color: copiedCode ? '#34D399' : '#A8A29E',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                    {copiedCode ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre
                  style={{
                    maxHeight: 200,
                    overflowY: 'auto',
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: '#0A0908',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono, monospace)',
                    color: '#D6D3D1',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                  }}
                >
                  {fileDetails.code.slice(0, 3000)}
                  {fileDetails.code.length > 3000 ? '\n\n// ... remaining code truncated for preview' : ''}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* High-Performance Canvas & High-Visibility Zoom Controls Styling */}
      <style>{`
        .react-flow__controls {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(89, 9, 7, 0.45) !important;
          border-radius: 12px !important;
          border: 1.5px solid rgba(232, 210, 181, 0.45) !important;
          overflow: hidden !important;
          background-color: #181614 !important;
        }
        .react-flow__controls-button {
          background-color: #221E1C !important;
          border-bottom: 1px solid rgba(232, 210, 181, 0.2) !important;
          color: #F5F5F4 !important;
          fill: #F5F5F4 !important;
          width: 38px !important;
          height: 38px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: background-color 0.15s ease !important;
        }
        .react-flow__controls-button svg {
          fill: #E8D2B5 !important;
          stroke: #E8D2B5 !important;
          width: 18px !important;
          height: 18px !important;
        }
        .react-flow__controls-button:hover {
          background-color: #590907 !important;
        }
        .react-flow__controls-button:hover svg {
          fill: #FFFFFF !important;
          stroke: #FFFFFF !important;
        }
        .react-flow__node {
          will-change: transform;
        }
        .react-flow__pane {
          cursor: grab;
        }
        .react-flow__pane:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  )
}

export default function FileFlow() {
  return (
    <ReactFlowProvider>
      <FileFlowContent />
    </ReactFlowProvider>
  )
}

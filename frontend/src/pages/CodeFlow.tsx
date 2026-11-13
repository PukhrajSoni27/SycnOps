import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Workflow, GitBranch, ArrowDown, Activity, Code2, Server, Database, Globe,
  ShieldCheck, Terminal, Copy, Check, ExternalLink, Play, ChevronRight,
  Layers, AlertTriangle, ArrowRight, CheckCircle2, FileCode2, Sparkles,
  Info, Cpu, Filter, Eye
} from 'lucide-react'
import {
  useCodeFlowOperationsQuery,
  useCodeFlowTraceQuery,
  useAnalyzeFileASTMutation,
  useRepositoriesQuery
} from '@/hooks/useApi'
import { CodeFlowNode } from '@/services/api'

// Fallback operation data matching Campus Lost & Found Registry if server query is pending
const DEFAULT_OPERATION_FALLBACK = {
  id: 'report-lost-item',
  title: 'Report Lost Item',
  repository: 'campus-lost-found',
  description: 'A student reports a lost item on campus. The request is validated on the client, sent via REST API, authenticated, handled by the controller, and persisted to Firebase Firestore.',
  trigger: 'User fills out the form and clicks "Submit Lost Report"',
  apiEndpoint: 'POST /api/items',
  databaseOperation: 'collection("items").add() -> Firebase Firestore document write',
  totalSteps: 8,
  nodes: [
    {
      id: 'step_1',
      stepNumber: 1,
      name: 'User submits item',
      type: 'ui_event',
      category: 'Frontend UI',
      filePath: 'frontend/src/pages/LostItem.jsx',
      line: 24,
      params: ['event: FormEvent'],
      calls: ['handleSubmit()'],
      calledBy: ['<form onSubmit={handleSubmit}> DOM event'],
      apiEndpoint: 'N/A',
      dbOperation: 'N/A',
      branchConditions: ['User must be logged in; otherwise redirect to /login'],
      errorHandling: 'Prevents default event; displays inline toast error if form is dirty',
      summary: 'Student fills out title, location, category, date lost, and photo URL, then clicks the Submit button.',
      codeSnippet: `// frontend/src/pages/LostItem.jsx:24
export default function LostItemForm() {
  const [formData, setFormData] = useState({ title: '', location: '', category: 'electronics' });
  const [loading, setLoading] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="lost-item-card">
      <input name="title" value={formData.title} onChange={handleChange} required />
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Report Lost Item'}
      </button>
    </form>
  );
}`
    },
    {
      id: 'step_2',
      stepNumber: 2,
      name: 'handleSubmit()',
      type: 'function',
      category: 'Client Validation',
      filePath: 'frontend/src/pages/LostItem.jsx',
      line: 42,
      params: ['e: React.FormEvent'],
      calls: ['validateForm()', 'createLostItem()'],
      calledBy: ['LostItem.jsx onSubmit'],
      apiEndpoint: 'N/A',
      dbOperation: 'N/A',
      branchConditions: [
        'if (!formData.title.trim()) -> toast.error("Title is required")',
        'if (!formData.location) -> toast.error("Campus location is required")'
      ],
      errorHandling: 'Stops execution and highlights erroneous input fields in red without network transmission.',
      summary: 'Validates input constraints (non-empty title, valid campus zone, valid timestamp) before dispatching network request.',
      codeSnippet: `// frontend/src/pages/LostItem.jsx:42
async function handleSubmit(e) {
  e.preventDefault();
  if (!formData.title || formData.title.trim().length < 3) {
    return toast.error('Item title must be at least 3 characters.');
  }
  if (!formData.location) {
    return toast.error('Please specify the campus building / location.');
  }

  try {
    setLoading(true);
    const item = await createLostItem(formData);
    toast.success('Lost item report filed successfully!');
    navigate('/items/' + item.id);
  } catch (err) {
    toast.error(err.message || 'Submission failed.');
  } finally {
    setLoading(false);
  }
}`
    },
    {
      id: 'step_3',
      stepNumber: 3,
      name: 'createLostItem()',
      type: 'api_client',
      category: 'API Client Service',
      filePath: 'frontend/src/services/itemsApi.js',
      line: 15,
      params: ['itemData: CreateItemPayload'],
      calls: ['fetch("/api/items")', 'authHeaders()'],
      calledBy: ['handleSubmit() in LostItem.jsx:48'],
      apiEndpoint: 'POST /api/items',
      dbOperation: 'N/A',
      branchConditions: ['if (!res.ok) -> throws Error(data.message || HTTP Status)'],
      errorHandling: 'Catches network timeouts, 401 token expiration, and 400 validation failures.',
      summary: 'Serializes payload to JSON, attaches Bearer JWT authorization token from localStorage, and initiates HTTP POST fetch.',
      codeSnippet: `// frontend/src/services/itemsApi.js:15
export async function createLostItem(itemData) {
  const token = localStorage.getItem('sycnops_token');
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: \`Bearer \${token}\`
    },
    body: JSON.stringify(itemData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || \`HTTP request failed with status \${res.status}\`);
  }
  return data.item;
}`
    },
    {
      id: 'step_4',
      stepNumber: 4,
      name: 'POST /api/items',
      type: 'api_route',
      category: 'Express API Router',
      filePath: 'backend/routes/itemRoutes.js',
      line: 18,
      params: ['req: Request', 'res: Response'],
      calls: ['authenticate()', 'createItem()'],
      calledBy: ['Express HTTP Router Matcher'],
      apiEndpoint: 'POST /api/items',
      dbOperation: 'N/A',
      branchConditions: ['Route matches method POST and exact path /api/items'],
      errorHandling: 'Express 404 handler if path mismatch; forwards unhandled exceptions to global error middleware.',
      summary: 'Express router maps the incoming HTTP POST request, pipes through the auth middleware pipeline, and delegates to the controller.',
      codeSnippet: `// backend/routes/itemRoutes.js:18
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createItem, getItems } from '../controllers/itemController.js';

const router = express.Router();

// Register new lost/found item report
router.post('/items', authenticate, createItem);

export default router;`
    },
    {
      id: 'step_5',
      stepNumber: 5,
      name: 'authenticate()',
      type: 'middleware',
      category: 'Auth Middleware',
      filePath: 'backend/middleware/auth.js',
      line: 12,
      params: ['req: Request', 'res: Response', 'next: NextFunction'],
      calls: ['jwt.verify()', 'next()'],
      calledBy: ['itemRoutes.js:21'],
      apiEndpoint: 'POST /api/items',
      dbOperation: 'Optional User.findById(decoded.id)',
      branchConditions: [
        'if (!authHeader?.startsWith("Bearer ")) -> 401 Unauthorized',
        'if (jwt.verify fails / expired) -> 401 Invalid Token'
      ],
      errorHandling: 'Returns HTTP 401 JSON immediately; blocks downstream controller execution.',
      summary: 'Verifies the HMAC-SHA256 signature of the JWT token, extracts user ID, and attaches user context to req.user.',
      codeSnippet: `// backend/middleware/auth.js:12
import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }
}`
    },
    {
      id: 'step_6',
      stepNumber: 6,
      name: 'createItem()',
      type: 'controller',
      category: 'Controller Logic',
      filePath: 'backend/controllers/itemController.js',
      line: 28,
      params: ['req: AuthenticatedRequest', 'res: Response'],
      calls: ['validateItemData()', 'Item.create()'],
      calledBy: ['itemRoutes.js:21 after authenticate()'],
      apiEndpoint: 'POST /api/items',
      dbOperation: 'Delegates to Firebase Firestore collection write',
      branchConditions: [
        'if (!validation.isValid) -> res.status(400).json({ errors })',
        'if (database error) -> res.status(500).json({ error })'
      ],
      errorHandling: 'Encapsulated in try/catch block; logs stack trace and returns sanitized client error.',
      summary: 'Extracts request body, coordinates business validation, constructs model instance, and dispatches to database.',
      codeSnippet: `// backend/controllers/itemController.js:28
import Item from '../models/Item.js';
import { validateItemData } from './validation.js';

export async function createItem(req, res) {
  try {
    const { title, description, category, location, dateLost, imageUrl } = req.body;

    const validation = validateItemData({ title, category, location });
    if (!validation.isValid) {
      return res.status(400).json({ success: false, errors: validation.errors });
    }

    const newItem = await Item.create({
      reporter: req.user.id,
      title: title.trim(),
      description: description || '',
      category,
      location,
      dateLost: dateLost || new Date(),
      status: 'reported',
      imageUrl: imageUrl || null
    });

    return res.status(201).json({
      success: true,
      message: 'Item registered successfully.',
      item: newItem
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}`
    },
    {
      id: 'step_7',
      stepNumber: 7,
      name: 'Validate item data (Firestore Schema)',
      type: 'model_validation',
      category: 'Model & Schema Guard',
      filePath: 'backend/models/Item.js',
      line: 32,
      params: ['docData: ItemPayload'],
      calls: ['validateFirestoreDocument()'],
      calledBy: ['createItem() in itemController.js:40'],
      apiEndpoint: 'N/A',
      dbOperation: 'Pre-save schema validation check',
      branchConditions: [
        'title: required, minlength: 3, maxlength: 120',
        'category: enum ["electronics", "documents", "clothing", "keys", "other"]',
        'location: required, trim'
      ],
      errorHandling: 'ValidationError thrown if any field fails Firestore document constraints.',
      summary: 'Validates document attributes, applies default fields (status="reported"), and enforces schema types for Firestore.',
      codeSnippet: `// backend/models/Item.js:32
export function validateItem(doc) {
  if (!doc.title || doc.title.length < 3) throw new Error('Title is required');
  if (!['electronics', 'documents', 'clothing', 'keys', 'other'].includes(doc.category)) {
    throw new Error('Invalid item category');
  }
  return {
    ...doc,
    status: doc.status || 'reported',
    createdAt: new Date()
  };
}`
    },
    {
      id: 'step_8',
      stepNumber: 8,
      name: 'Save item in Firebase Firestore',
      type: 'database',
      category: 'Database Storage',
      filePath: 'Firebase Firestore / items collection',
      line: 1,
      params: ['document: Firestore Document'],
      calls: ['db.collection("items").add()'],
      calledBy: ['Firebase Admin SDK / Firestore Client'],
      apiEndpoint: 'N/A',
      dbOperation: 'Firestore write -> collection("items").doc(id).set(data)',
      branchConditions: ['Document validation; security rules authorization check'],
      errorHandling: 'Permission denied or quota limit error triggers FirebaseFirestoreError.',
      summary: 'Database persists document to Firebase Cloud Firestore, allocates unique document ID, and syncs indexes.',
      codeSnippet: `// Firebase Cloud Firestore Engine Operation:
await db.collection("items").add({
  "id": "doc_9e881661_2026",
  "reporter": "usr_pukhraj_soni",
  "title": "MacBook Air M2 - Silver",
  "category": "electronics",
  "location": "Science Library, 2nd Floor Study Room",
  "status": "reported",
  "dateLost": new Date("2026-11-09T18:30:00.000Z"),
  "createdAt": new Date("2026-11-09T22:20:14.102Z"),
  "updatedAt": new Date("2026-11-09T22:20:14.102Z")
});
// Firestore Write Result: WriteResult { writeTime: 2026-11-09T22:20:14.150Z } -> Acknowledged`
    }
  ]
}

const SAMPLE_CUSTOM_CODE = `// Sample application component to parse with AST
import { useState } from 'react';
import { apiPost } from '../services/api';

export function submitLostReport(reportData) {
  if (!reportData.title) {
    throw new Error('Title is mandatory');
  }
  return sendItemToBackend(reportData);
}

async function sendItemToBackend(data) {
  const result = await apiPost('/api/items', data);
  logAnalyticsEvent('item_reported', { id: result.id });
  return result;
}

function logAnalyticsEvent(eventName, payload) {
  console.log('[Telemetry]', eventName, payload);
}
`

export default function CodeFlow() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialOp = searchParams.get('op') || 'report-lost-item'

  const [selectedOperationId, setSelectedOperationId] = useState(initialOp)
  const [activeTab, setActiveTab] = useState<'flowchart' | 'ast-analyzer' | 'call-hierarchy'>('flowchart')
  const [copiedSnippet, setCopiedSnippet] = useState(false)

  // Live AST Custom Code Parser State
  const [customCodeInput, setCustomCodeInput] = useState(SAMPLE_CUSTOM_CODE)
  const [astAnalysisResult, setAstAnalysisResult] = useState<any>(null)

  // API Queries
  const { data: operationsList = [] } = useCodeFlowOperationsQuery()
  const { data: traceData, isLoading: isTraceLoading } = useCodeFlowTraceQuery(selectedOperationId)
  const analyzeASTMutation = useAnalyzeFileASTMutation()

  const currentOperation = traceData || DEFAULT_OPERATION_FALLBACK
  const nodes = currentOperation.nodes || []
  const [selectedNode, setSelectedNode] = useState<CodeFlowNode>(nodes[0] || DEFAULT_OPERATION_FALLBACK.nodes[0])

  // Sync selected node when operation changes
  useEffect(() => {
    if (nodes.length > 0) {
      setSelectedNode(nodes[0])
    }
  }, [selectedOperationId, traceData])

  const handleCopySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet)
    setCopiedSnippet(true)
    setTimeout(() => setCopiedSnippet(false), 2000)
  }

  const handleRunLiveASTAnalysis = async () => {
    const result = await analyzeASTMutation.mutateAsync({ code: customCodeInput, filePath: 'UserComponent.jsx' })
    setAstAnalysisResult(result)
  }

  // Node Category Badge Colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Frontend UI':
      case 'Client Validation':
        return { bg: 'rgba(56,189,248,0.12)', text: '#38BDF8', border: 'rgba(56,189,248,0.3)' }
      case 'API Client Service':
      case 'Express API Router':
        return { bg: 'rgba(168,85,247,0.12)', text: '#A855F7', border: 'rgba(168,85,247,0.3)' }
      case 'Auth Middleware':
        return { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B', border: 'rgba(245,158,11,0.3)' }
      case 'Controller Logic':
        return { bg: 'rgba(16,185,129,0.12)', text: '#10B981', border: 'rgba(16,185,129,0.3)' }
      case 'Model & Schema Guard':
        return { bg: 'rgba(236,72,153,0.12)', text: '#EC4899', border: 'rgba(236,72,153,0.3)' }
      case 'Database Storage':
      case 'Database Operation':
        return { bg: 'rgba(239,68,68,0.12)', text: '#EF4444', border: 'rgba(239,68,68,0.3)' }
      default:
        return { bg: 'rgba(89,9,7,0.4)', text: '#E8D2B5', border: 'rgba(232,210,181,0.3)' }
    }
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    backdropFilter: 'blur(12px)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-tech)',
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: 'rgba(89,9,7,0.45)',
                color: '#E8D2B5',
                border: '1px solid rgba(232, 210, 181, 0.35)',
                boxShadow: '0 2px 8px rgba(89,9,7,0.4)',
              }}
            >
              <Workflow size={12} color="#E8D2B5" /> Code Flow Analyzer
            </span>
            <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Sparkles size={11} /> AST Parser Active (@babel/parser)
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 400, color: 'var(--text)', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Code Flow Execution Sequence
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', margin: 0, maxWidth: '720px' }}>
            Explains how operations execute end-to-end: function sequence, caller-callee relations, API routes, database queries, conditional branches, and line-level code references.
          </p>
        </div>

        {/* Operation Picker & Meta Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
              Operation to Analyze
            </label>
            <select
              value={selectedOperationId}
              onChange={(e) => {
                setSelectedOperationId(e.target.value)
                setSearchParams({ op: e.target.value })
              }}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                background: '#141817',
                border: '1px solid rgba(232,210,181,0.3)',
                color: '#E8D2B5',
                fontFamily: 'var(--font-tech)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              <option value="report-lost-item">Campus Lost & Found: Report Lost Item</option>
              <option value="claim-lost-item">Campus Lost & Found: Claim Lost Item</option>
              <option value="trigger-pipeline">SycnOps: Trigger Multi-Stage CI/CD Pipeline</option>
            </select>
          </div>

          <Link
            to="/pipeline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontFamily: 'var(--font-tech)',
              fontSize: '12px',
              textDecoration: 'none',
              marginTop: 18
            }}
          >
            <Activity size={13} color="#E8D2B5" /> Pipeline View
          </Link>
        </div>
      </div>

      {/* ── Operation Header Banner ── */}
      <div
        style={{
          ...cardStyle,
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          background: 'linear-gradient(135deg, rgba(89,9,7,0.35), rgba(20,24,23,0.8))',
          border: '1px solid rgba(232,210,181,0.25)'
        }}
      >
        <div style={{ maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#E8D2B5', fontWeight: 500 }}>
              {currentOperation.title}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.4)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.2)' }}>
              {currentOperation.repository}
            </span>
            <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
              {nodes.length} Execution Steps
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
            {currentOperation.description}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 20, fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>API ROUTE</span>
            <span style={{ color: '#A855F7', fontWeight: 600 }}>{currentOperation.apiEndpoint}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>DATABASE OPERATION</span>
            <span style={{ color: '#EF4444', fontWeight: 600 }}>{currentOperation.databaseOperation}</span>
          </div>
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '28px' }}>
        {[
          { id: 'flowchart', label: 'Interactive Flowchart & Code Inspector', icon: Workflow },
          { id: 'call-hierarchy', label: 'Function Call Hierarchy (AST Map)', icon: Layers },
          { id: 'ast-analyzer', label: 'Live Babel AST File Analyzer', icon: FileCode2 }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: isActive ? 'linear-gradient(135deg, rgba(89,9,7,0.65), rgba(89,9,7,0.3))' : 'transparent',
                border: isActive ? '1px solid rgba(232,210,181,0.3)' : '1px solid transparent',
                color: isActive ? '#E8D2B5' : 'var(--text-muted)',
                fontFamily: 'var(--font-tech)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: INTERACTIVE FLOWCHART & INSPECTOR (Matching Image) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'flowchart' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.15fr) minmax(420px, 1.85fr)', gap: '28px', alignItems: 'start' }}>
          
          {/* Left Column: Visual Step-by-Step Flowchart */}
          <div style={{ ...cardStyle, padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text)', margin: '0 0 2px 0' }}>
                  Execution Sequence
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  Click any step to inspect AST metadata and actual code
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#10B981' }}>
                Full-Stack Trace
              </span>
            </div>

            {/* Vertical Flow Diagram Nodes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              {nodes.map((node, index) => {
                const isSelected = selectedNode.id === node.id
                const catCfg = getCategoryColor(node.category)

                return (
                  <div key={node.id} style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Flowchart Node Card */}
                    <div
                      onClick={() => setSelectedNode(node)}
                      style={{
                        padding: '16px 18px',
                        borderRadius: '12px',
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(89,9,7,0.45), rgba(28,32,31,0.9))'
                          : 'rgba(255,255,255,0.02)',
                        border: isSelected
                          ? '1.5px solid #E8D2B5'
                          : '1px solid rgba(255,255,255,0.07)',
                        boxShadow: isSelected
                          ? '0 0 20px rgba(89,9,7,0.6), inset 0 0 12px rgba(232,210,181,0.08)'
                          : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              backgroundColor: isSelected ? '#590907' : 'rgba(255,255,255,0.06)',
                              border: `1px solid ${isSelected ? '#E8D2B5' : 'rgba(255,255,255,0.15)'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: isSelected ? '#E8D2B5' : 'var(--text-muted)'
                            }}
                          >
                            {node.stepNumber}
                          </span>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 600, color: isSelected ? '#E8D2B5' : 'var(--text)' }}>
                            {node.name}
                          </span>
                        </div>

                        <span
                          style={{
                            fontFamily: 'var(--font-tech)',
                            fontSize: '9px',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: catCfg.bg,
                            color: catCfg.text,
                            border: `1px solid ${catCfg.border}`,
                            fontWeight: 600
                          }}
                        >
                          {node.category}
                        </span>
                      </div>

                      {/* File location & line reference */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: isSelected ? '#a1a1aa' : 'var(--text-dim)' }}>
                          <FileCode2 size={12} />
                          {node.filePath}:{node.line}
                        </span>
                        {node.calls && node.calls.length > 0 && node.calls[0] !== 'N/A' && (
                          <span style={{ color: '#10B981', fontSize: '10px' }}>
                            calls {node.calls[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow down between nodes */}
                    {index < nodes.length - 1 && (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '24px' }}>
                        <div style={{ width: '2px', height: '14px', backgroundColor: 'rgba(232,210,181,0.3)' }} />
                        <ArrowDown size={14} color="#E8D2B5" style={{ margin: '-2px 0 0 -6px' }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Deep Node Inspector & Actual Code Viewer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ ...cardStyle, padding: '28px', border: '1px solid rgba(232,210,181,0.3)' }}>
              
              {/* Node Inspector Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 18, marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#590907', color: '#E8D2B5', fontWeight: 600 }}>
                      Step {selectedNode.stepNumber} of {nodes.length}
                    </span>
                    <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {selectedNode.category}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text)', margin: '0 0 4px 0' }}>
                    {selectedNode.name}
                  </h2>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileCode2 size={13} />
                    <strong>{selectedNode.filePath}</strong> • Line {selectedNode.line}
                  </div>
                </div>

                <button
                  onClick={() => handleCopySnippet(selectedNode.codeSnippet)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-tech)',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {copiedSnippet ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                  {copiedSnippet ? 'Copied' : 'Copy Code'}
                </button>
              </div>

              {/* Summary Description */}
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#d4d4d8', lineHeight: 1.6, marginBottom: 20 }}>
                {selectedNode.summary}
              </p>

              {/* ── Metadata Grid (Parameters, Caller, Callees, Endpoints) ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 22 }}>
                
                {/* Parameters */}
                <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Parameters
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#34d399' }}>
                    {selectedNode.params?.length ? selectedNode.params.join(', ') : 'None / Event'}
                  </div>
                </div>

                {/* Related API Endpoint */}
                <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Related API Endpoint
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#A855F7', fontWeight: 600 }}>
                    {selectedNode.apiEndpoint || 'N/A'}
                  </div>
                </div>

                {/* Functions it calls (Callees) */}
                <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Functions Called (Callees)
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#38BDF8' }}>
                    {selectedNode.calls?.length ? selectedNode.calls.join(', ') : 'Leaf Execution'}
                  </div>
                </div>

                {/* Functions that call it (Callers) */}
                <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Called By (Caller)
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#E8D2B5' }}>
                    {selectedNode.calledBy?.length ? selectedNode.calledBy.join(', ') : 'Root Action'}
                  </div>
                </div>
              </div>

              {/* ── Conditional Branches & Error Paths ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
                <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: '#F59E0B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                    <Filter size={11} /> Conditional Branches
                  </span>
                  <ul style={{ margin: 0, paddingLeft: 16, fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#d4d4d8', lineHeight: 1.6 }}>
                    {selectedNode.branchConditions?.map((cond, cIdx) => (
                      <li key={cIdx}>{cond}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: '#EF4444', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                    <AlertTriangle size={11} /> Error-Handling Paths
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#d4d4d8', lineHeight: 1.5 }}>
                    {selectedNode.errorHandling || 'Unhandled exceptions escalate to global 500 handler.'}
                  </div>
                </div>
              </div>

              {/* ── Actual Source Code Viewer (Requested: clicking opens actual code at location) ── */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Code2 size={13} color="#E8D2B5" /> Source Code Location // {selectedNode.filePath}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#10B981' }}>
                    Line {selectedNode.line} AST Anchor
                  </span>
                </div>

                <div
                  style={{
                    borderRadius: '10px',
                    backgroundColor: '#070908',
                    border: '1px solid rgba(255,255,255,0.12)',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {selectedNode.filePath}
                    </span>
                    <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: '#E8D2B5', background: 'rgba(89,9,7,0.5)', padding: '2px 6px', borderRadius: '4px' }}>
                      AST Target
                    </span>
                  </div>

                  <pre style={{ margin: 0, padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.65', color: '#e4e4e7', overflowX: 'auto' }}>
                    <code>
                      {selectedNode.codeSnippet.split('\n').map((codeLine, idx) => {
                        const currentLineNum = selectedNode.line + idx
                        const isMainDeclaration = idx === 0
                        return (
                          <div
                            key={idx}
                            style={{
                              backgroundColor: isMainDeclaration ? 'rgba(89,9,7,0.35)' : 'transparent',
                              display: 'flex',
                              gap: 12
                            }}
                          >
                            <span style={{ color: '#52525b', width: 28, userSelect: 'none', textAlign: 'right' }}>
                              {currentLineNum}
                            </span>
                            <span style={{ color: isMainDeclaration ? '#E8D2B5' : '#d4d4d8' }}>
                              {codeLine}
                            </span>
                          </div>
                        )
                      })}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: FUNCTION CALL HIERARCHY (AST Map) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'call-hierarchy' && (
        <div style={{ ...cardStyle, padding: '28px' }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text)', margin: '0 0 6px 0' }}>
              Function-to-Function Call Hierarchy Tree
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Shows parent-to-child function invocation paths extracted through AST traversal.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {nodes.map((node, idx) => (
              <div
                key={node.id}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#590907', color: '#E8D2B5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                  {idx + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: '#E8D2B5', fontWeight: 600 }}>
                      {node.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                      in {node.filePath}:{node.line}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Calls &rarr;</span>
                    <span style={{ color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                      {node.calls.join(', ')}
                    </span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 16 }}>Invoked By &larr;</span>
                    <span style={{ color: '#38BDF8', background: 'rgba(56,189,248,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                      {node.calledBy.join(', ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedNode(node)
                    setActiveTab('flowchart')
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-tech)',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={12} /> Inspect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 3: LIVE BABEL AST FILE ANALYZER (Demonstration for Professor) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ast-analyzer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* Left: Source Code Input */}
          <div style={{ ...cardStyle, padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text)', margin: '0 0 2px 0' }}>
                  Live Code Input (JS / TSX)
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  Paste source code to extract AST function signatures and call graphs live
                </span>
              </div>
              <button
                onClick={handleRunLiveASTAnalysis}
                disabled={analyzeASTMutation.isPending}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #740c09, #590907)',
                  border: '1px solid rgba(232,210,181,0.35)',
                  color: '#E8D2B5',
                  fontFamily: 'var(--font-tech)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(89,9,7,0.4)'
                }}
              >
                <Play size={12} fill="#E8D2B5" />
                {analyzeASTMutation.isPending ? 'Parsing AST...' : 'Parse with Babel AST'}
              </button>
            </div>

            <textarea
              value={customCodeInput}
              onChange={(e) => setCustomCodeInput(e.target.value)}
              rows={18}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: '#070908',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#e4e4e7',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                lineHeight: 1.6,
                resize: 'vertical'
              }}
            />
          </div>

          {/* Right: AST Extraction Results */}
          <div style={{ ...cardStyle, padding: '24px' }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text)', margin: '0 0 2px 0' }}>
                Extracted AST Metadata
              </h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#10B981' }}>
                Parser: @babel/parser • Visitors: @babel/traverse
              </span>
            </div>

            {astAnalysisResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#E8D2B5' }}>
                  FOUND {astAnalysisResult.functions?.length || 0} FUNCTIONS, {astAnalysisResult.calls?.length || 0} CALLS, {astAnalysisResult.imports?.length || 0} IMPORTS
                </div>

                {astAnalysisResult.functions?.map((fn: any, fIdx: number) => (
                  <div
                    key={fIdx}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: '#34d399' }}>
                        {fn.name}({fn.params?.join(', ') || ''})
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                        Lines {fn.startLine} - {fn.endLine}
                      </span>
                    </div>

                    {fn.callees && fn.callees.length > 0 && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#38BDF8' }}>
                        Invokes: {fn.callees.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-muted)' }}>
                <Code2 size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', margin: 0 }}>
                  Click <strong>"Parse with Babel AST"</strong> above to extract real syntax trees, function declarations, line anchors, and callers.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * fileFlowScanner.js
 * 
 * Production-grade AST Repository & File Flow Scanner for SycnOps.
 * 
 * Scans actual project directories, parses source files with Babel AST and Python inspection:
 *  - Detects source files, programming languages, and sizes
 *  - Extracts imports, exports, functions, and React components
 *  - Extracts frontend API calls (fetch, api(), axios) with HTTP methods and paths
 *  - Extracts backend API route definitions (Express app.get/post and FastAPI @app.get/post)
 *  - Extracts Firebase Firestore & database collection operations
 *  - Correlates frontend API calls with actual backend route definitions
 *  - Generates graph nodes (Files, APIs, Databases) and evidence-backed edges (Imports, API Calls, DB Operations)
 *  - Persists real results to Firebase Firestore (collection: `file_flows`)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as babelParser from '@babel/parser'
import babelTraverse from '@babel/traverse'
import { getDB, isFirestoreConnected } from '../config/firebase.js'

const traverse = babelTraverse.default || babelTraverse

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const frontendSrcDir = path.resolve(rootDir, 'frontend', 'src')
const backendDir = path.resolve(rootDir, 'backend')

// In-memory cache for fast retrieval and offline resilience
let cachedFileFlowAnalysis = null

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.vscode',
  '.idea',
  'dist',
  'build',
  'coverage',
  '__pycache__',
  '.venv',
  'venv',
  'env',
  '.next'
])

const SUPPORTED_EXTS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.py',
  '.json',
  '.css'
])

const LANGUAGE_MAP = {
  '.ts': 'TypeScript',
  '.tsx': 'TypeScript (React)',
  '.js': 'JavaScript',
  '.jsx': 'JavaScript (React)',
  '.py': 'Python',
  '.json': 'JSON',
  '.css': 'CSS'
}

/**
 * Normalizes an API route path by removing query strings, trailing slashes,
 * and standardizing parameter patterns (e.g., :id or {id} -> :param).
 */
export function normalizeRoute(route) {
  if (!route) return ''
  let cleaned = route.split('?')[0].trim().replace(/\/+$/, '')
  if (!cleaned.startsWith('/')) cleaned = '/' + cleaned
  // Normalize :param and {param}
  cleaned = cleaned.replace(/:[a-zA-Z0-9_]+/g, ':param').replace(/\{[a-zA-Z0-9_]+\}/g, ':param')
  return cleaned
}

/**
 * Parses a JS/TS source string with Babel AST parser.
 */
function parseCodeAST(code, filePath) {
  try {
    return babelParser.parse(code, {
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        'asyncGenerators',
        'classProperties',
        'dynamicImport',
        'objectRestSpread',
        'optionalChaining',
        'nullishCoalescingOperator'
      ]
    })
  } catch (err) {
    // Tolerant fallback for non-fatal parse errors
    return null
  }
}

/**
 * Inspects a JavaScript/TypeScript source file using AST.
 */
function inspectJsFile(filePath, code) {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/')
  const ext = path.extname(filePath).toLowerCase()
  const isFrontend = relPath.startsWith('frontend')

  const ast = parseCodeAST(code, filePath)

  const imports = []
  const exportsList = []
  const functions = []
  const apiCalls = []
  const dbOperations = []
  const routes = []

  const lines = code.split('\n')

  if (ast) {
    traverse(ast, {
      // 1. Imports
      ImportDeclaration(p) {
        const source = p.node.source.value
        const specifiers = p.node.specifiers.map((s) => s.local.name)
        imports.push({
          source,
          specifiers,
          line: p.node.loc?.start.line || 1
        })
      },

      // 2. Named Exports
      ExportNamedDeclaration(p) {
        if (p.node.declaration) {
          if (p.node.declaration.declarations) {
            p.node.declaration.declarations.forEach((d) => {
              if (d.id?.name) exportsList.push(d.id.name)
            })
          } else if (p.node.declaration.id?.name) {
            exportsList.push(p.node.declaration.id.name)
          }
        }
      },

      // 3. Default Export
      ExportDefaultDeclaration(p) {
        const name = p.node.declaration?.id?.name || p.node.declaration?.name || 'default'
        exportsList.push(name)
      },

      // 4. Function Declarations & Components
      FunctionDeclaration(p) {
        const name = p.node.id?.name || 'anonymous'
        const line = p.node.loc?.start.line || 1
        const isComponent = isFrontend && /^[A-Z]/.test(name)
        functions.push({
          name,
          line,
          isComponent,
          params: p.node.params.map((pr) => (pr.type === 'Identifier' ? pr.name : 'param'))
        })
      },

      // 5. Arrow Functions & Variable Functions
      VariableDeclarator(p) {
        if (p.node.init && (p.node.init.type === 'ArrowFunctionExpression' || p.node.init.type === 'FunctionExpression')) {
          const name = p.node.id?.name || 'anonymous'
          const line = p.node.loc?.start.line || 1
          const isComponent = isFrontend && /^[A-Z]/.test(name)
          functions.push({
            name,
            line,
            isComponent,
            params: (p.node.init.params || []).map((pr) => (pr.type === 'Identifier' ? pr.name : 'param'))
          })
        }
      },

      // 6. Call Expressions: fetch(), api(), axios, Express routes, and DB operations
      CallExpression(p) {
        const callee = p.node.callee
        const line = p.node.loc?.start.line || 1

        // CommonJS require(...) statement detection
        if (
          callee.type === 'Identifier' &&
          callee.name === 'require' &&
          p.node.arguments.length > 0
        ) {
          const reqArg = p.node.arguments[0]
          if (reqArg.type === 'StringLiteral' || reqArg.type === 'Literal') {
            imports.push({
              source: reqArg.value,
              specifiers: ['require'],
              line,
              isRequire: true
            })
          }
        }

        // Express route definition: app.get('/api/...', ...), app.post(...), router.get(...)
        if (
          callee.type === 'MemberExpression' &&
          ['get', 'post', 'put', 'delete', 'patch'].includes(callee.property?.name) &&
          (callee.object?.name === 'app' || callee.object?.name === 'router')
        ) {
          const method = callee.property.name.toUpperCase()
          const firstArg = p.node.arguments[0]
          if (firstArg && (firstArg.type === 'StringLiteral' || firstArg.type === 'Literal')) {
            const rawPath = firstArg.value
            routes.push({
              method,
              rawPath,
              normalizedPath: normalizeRoute(rawPath),
              line,
              file: relPath
            })
          }
        }

        // Frontend API call detection: api('/path', { method }), fetch('/api/...'), axios
        if (
          callee.type === 'Identifier' &&
          (callee.name === 'api' || callee.name === 'fetch' || callee.name === 'apiGet' || callee.name === 'apiPost')
        ) {
          const firstArg = p.node.arguments[0]
          let endpoint = ''
          if (firstArg?.type === 'StringLiteral' || firstArg?.type === 'Literal') {
            endpoint = firstArg.value
          } else if (firstArg?.type === 'TemplateLiteral') {
            endpoint = firstArg.quasis.map((q) => q.value.raw).join(':param')
          }

          if (endpoint) {
            let method = 'GET'
            const secondArg = p.node.arguments[1]
            if (secondArg && secondArg.type === 'ObjectExpression') {
              const methodProp = secondArg.properties.find(
                (pr) => pr.key?.name === 'method' || pr.key?.value === 'method'
              )
              if (methodProp && (methodProp.value?.type === 'StringLiteral' || methodProp.value?.type === 'Literal')) {
                method = methodProp.value.value.toUpperCase()
              }
            }
            if (callee.name === 'apiPost') method = 'POST'

            // Prepend /api if not present but looks like an internal endpoint
            let fullPath = endpoint.startsWith('/') ? endpoint : '/' + endpoint
            if (!fullPath.startsWith('/api') && fullPath.startsWith('/')) {
              fullPath = '/api' + fullPath
            }

            apiCalls.push({
              method,
              rawEndpoint: endpoint,
              fullPath,
              normalizedPath: normalizeRoute(fullPath),
              line,
              file: relPath
            })
          }
        }

        // Database calls: db.collection('name'), Firestore
        if (
          callee.type === 'MemberExpression' &&
          callee.property?.name === 'collection' &&
          (callee.object?.name === 'db' || callee.object?.property?.name === 'db')
        ) {
          const firstArg = p.node.arguments[0]
          if (firstArg && (firstArg.type === 'StringLiteral' || firstArg.type === 'Literal')) {
            dbOperations.push({
              database: 'Firebase Firestore',
              collection: firstArg.value,
              line,
              file: relPath
            })
          }
        }
      }
    })
  } else {
    // Regex fallback if Babel parser hit syntax quirks
    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1
      const routeMatch = lineText.match(/app\.(get|post|put|delete)\(['"]([^'"]+)['"]/i)
      if (routeMatch) {
        routes.push({
          method: routeMatch[1].toUpperCase(),
          rawPath: routeMatch[2],
          normalizedPath: normalizeRoute(routeMatch[2]),
          line: lineNum,
          file: relPath
        })
      }
    })
  }

  return {
    path: relPath,
    fullPath: filePath,
    name: path.basename(filePath),
    ext,
    language: LANGUAGE_MAP[ext] || 'Text',
    linesCount: lines.length,
    sizeBytes: Buffer.byteLength(code, 'utf8'),
    imports,
    exports: exportsList,
    functions,
    apiCalls,
    routes,
    dbOperations
  }
}

/**
 * Inspects a Python source file (FastAPI, ML, Database operations).
 */
function inspectPythonFile(filePath, code) {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/')
  const ext = '.py'
  const lines = code.split('\n')

  const imports = []
  const exportsList = []
  const functions = []
  const routes = []
  const dbOperations = []
  const mlOperations = []

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1
    const trimmed = lineText.trim()

    // 1. Python Imports
    const importMatch = trimmed.match(/^(?:from\s+([a-zA-Z0-9_.]+)\s+import\s+([a-zA-Z0-9_,\s*]+)|import\s+([a-zA-Z0-9_,\s]+))/)
    if (importMatch) {
      const source = importMatch[1] || importMatch[3]
      imports.push({
        source: source.trim(),
        specifiers: (importMatch[2] || importMatch[3] || '').split(',').map((s) => s.trim()),
        line: lineNum
      })
    }

    // 2. FastAPI Routes: @app.get("/api/..."), @app.post(...)
    const routeMatch = trimmed.match(/^@(?:app|router)\.(get|post|put|delete|patch)\(\s*["']([^"']+)["']/)
    if (routeMatch) {
      routes.push({
        method: routeMatch[1].toUpperCase(),
        rawPath: routeMatch[2],
        normalizedPath: normalizeRoute(routeMatch[2]),
        line: lineNum,
        file: relPath
      })
    }

    // 3. Python Function Definitions
    const funcMatch = trimmed.match(/^def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/)
    if (funcMatch) {
      functions.push({
        name: funcMatch[1],
        line: lineNum,
        isComponent: false,
        params: funcMatch[2].split(',').map((p) => p.trim()).filter(Boolean)
      })
      exportsList.push(funcMatch[1])
    }

    // 4. Database Operations (Firebase Firestore)
    if (trimmed.includes('db[') || trimmed.includes('.collection(') || trimmed.includes('users_col') || trimmed.includes('firestore') || trimmed.includes('firebase')) {
      dbOperations.push({
        database: 'Firebase Firestore',
        operation: trimmed.substring(0, 40),
        line: lineNum,
        file: relPath
      })
    }

    // 5. ML Operations
    if (
      trimmed.includes('joblib.load') ||
      trimmed.includes('pickle.load') ||
      trimmed.includes('.predict(') ||
      trimmed.includes('scikit') ||
      trimmed.includes('xgboost') ||
      trimmed.includes('pd.read_csv')
    ) {
      mlOperations.push({
        type: 'ML Model / Pipeline Processing',
        snippet: trimmed.substring(0, 50),
        line: lineNum,
        file: relPath
      })
    }
  })

  return {
    path: relPath,
    fullPath: filePath,
    name: path.basename(filePath),
    ext,
    language: 'Python',
    linesCount: lines.length,
    sizeBytes: Buffer.byteLength(code, 'utf8'),
    imports,
    exports: exportsList,
    functions,
    apiCalls: [],
    routes,
    dbOperations,
    mlOperations
  }
}

/**
 * Recursively scans supported source files in target directories.
 */
function walkSourceFiles(dir, collected = []) {
  if (!fs.existsSync(dir)) return collected

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.env.example') continue
    if (IGNORED_DIRS.has(entry.name)) continue

    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkSourceFiles(fullPath, collected)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      // Skip environment files with credentials
      if (entry.name.endsWith('.env') || entry.name === 'backend.env') continue
      if (SUPPORTED_EXTS.has(ext)) {
        collected.push(fullPath)
      }
    }
  }
  return collected
}

/**
 * Resolves an import statement path to a target file in the repository.
 */
function resolveImportPath(importerPath, importSource, fileMap) {
  if (!importSource.startsWith('.') && !importSource.startsWith('@/')) {
    // External npm / python package
    return null
  }

  let candidate = ''
  if (importSource.startsWith('@/')) {
    candidate = path.resolve(frontendSrcDir, importSource.replace(/^@\//, ''))
  } else {
    candidate = path.resolve(path.dirname(importerPath), importSource)
  }

  // Check direct path or with extensions
  const testExtensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js']
  for (const ext of testExtensions) {
    const fullTest = candidate + ext
    const relKey = path.relative(rootDir, fullTest).replace(/\\/g, '/')
    if (fileMap.has(relKey)) {
      return relKey
    }
  }
  return null
}

/**
 * Categorizes a file into frontend, backend, database, or config.
 */
export function categorizeFile(relPath) {
  const norm = relPath.replace(/\\/g, '/')
  if (
    norm.includes('models/') ||
    norm.includes('config/firebase') ||
    norm.includes('config/db') ||
    norm.includes('lib/firebase')
  ) {
    return 'database'
  }
  if (
    norm.endsWith('package.json') ||
    norm.endsWith('tsconfig.json') ||
    norm.endsWith('vite.config.ts') ||
    norm.includes('.env')
  ) {
    return 'config'
  }
  if (norm.startsWith('frontend/')) {
    return 'frontend'
  }
  if (norm.startsWith('backend/')) {
    return 'backend'
  }
  return 'config'
}

/**
 * Detects circular dependency loops within file import relationships.
 */
export function detectCircularDependencies(edges) {
  const adj = new Map()
  const importEdges = edges.filter((e) => e.type === 'import')
  importEdges.forEach((e) => {
    if (!adj.has(e.source)) adj.set(e.source, [])
    adj.get(e.source).push(e.target)
  })

  const cycles = []
  const visited = new Set()
  const recStack = new Set()
  const pathNodes = []

  function dfs(curr) {
    visited.add(curr)
    recStack.add(curr)
    pathNodes.push(curr)

    const neighbors = adj.get(curr) || []
    for (const next of neighbors) {
      if (!visited.has(next)) {
        dfs(next)
      } else if (recStack.has(next)) {
        const cycleStart = pathNodes.indexOf(next)
        if (cycleStart !== -1) {
          const cycle = pathNodes.slice(cycleStart)
          cycle.push(next)
          const cycleKey = [...cycle].sort().join('->')
          if (!cycles.some((c) => [...c].sort().join('->') === cycleKey)) {
            cycles.push(cycle)
          }
        }
      }
    }

    recStack.delete(curr)
    pathNodes.pop()
  }

  for (const node of adj.keys()) {
    if (!visited.has(node)) {
      dfs(node)
    }
  }

  return cycles
}

/**
 * Main Repository & File Flow Scanner.
 * Builds real nodes, edges, relationships, and metadata.
 */
export async function runFileFlowScan(projectId = 'sycnops') {
  const startTime = Date.now()
  const scannedFiles = []
  const fileMap = new Map()

  // 1. Discover all source files across frontend/src and backend
  const allPaths = [
    ...walkSourceFiles(frontendSrcDir),
    ...walkSourceFiles(backendDir)
  ]

  // Add configuration and manifest files
  const configFiles = [
    path.join(rootDir, 'package.json'),
    path.join(rootDir, 'frontend', 'package.json'),
    path.join(rootDir, 'frontend', 'vite.config.ts'),
    path.join(rootDir, 'frontend', 'tsconfig.json'),
    path.join(rootDir, 'backend', 'package.json'),
    path.join(rootDir, 'backend', '.env.example')
  ]
  configFiles.forEach((p) => {
    if (fs.existsSync(p) && !allPaths.includes(p)) {
      allPaths.push(p)
    }
  })

  // 2. Parse every file and extract AST metadata
  for (const fPath of allPaths) {
    try {
      const content = fs.readFileSync(fPath, 'utf8')
      const ext = path.extname(fPath).toLowerCase()
      let meta = null
      if (ext === '.py') {
        meta = inspectPythonFile(fPath, content)
      } else if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        meta = inspectJsFile(fPath, content)
      } else {
        const rel = path.relative(rootDir, fPath).replace(/\\/g, '/')
        meta = {
          path: rel,
          fullPath: fPath,
          name: path.basename(fPath),
          ext,
          language: LANGUAGE_MAP[ext] || 'Text',
          linesCount: content.split('\n').length,
          sizeBytes: Buffer.byteLength(content, 'utf8'),
          imports: [],
          exports: [],
          functions: [],
          apiCalls: [],
          routes: [],
          dbOperations: []
        }
      }

      if (meta) {
        meta.fileCategory = categorizeFile(meta.path)
        scannedFiles.push(meta)
        fileMap.set(meta.path, meta)
      }
    } catch (err) {
      console.warn(`[FileFlowScanner] Skipped file ${fPath}:`, err.message)
    }
  }

  // 3. Collect all registered backend API routes
  const allBackendRoutes = []
  for (const f of scannedFiles) {
    if (f.routes && f.routes.length > 0) {
      f.routes.forEach((r) => allBackendRoutes.push(r))
    }
  }

  // 4. Generate Graph Nodes
  const nodes = []
  const edges = []
  const edgeSet = new Set()

  function addEdge(source, target, type, confidence, evidence) {
    const key = `${source}-->${target}::${type}`
    if (!edgeSet.has(key) && source !== target) {
      edgeSet.add(key)
      edges.push({
        id: `e_${edges.length + 1}`,
        source,
        target,
        type,
        confidence, // 'high' | 'inferred'
        evidence
      })
    }
  }

  // Add File Nodes
  scannedFiles.forEach((f) => {
    const fileCategory = f.fileCategory || categorizeFile(f.path)

    nodes.push({
      id: f.path,
      label: f.name,
      path: f.path,
      type: 'fileNode',
      category: fileCategory,
      language: f.language,
      linesCount: f.linesCount,
      sizeBytes: f.sizeBytes,
      functionsCount: f.functions.length,
      exportsCount: f.exports.length,
      importsCount: f.imports.length,
      apiCallsCount: f.apiCalls.length,
      routesCount: f.routes.length,
      dbOperationsCount: f.dbOperations.length,
      functions: f.functions,
      exports: f.exports,
      data: {
        id: f.path,
        label: f.name,
        name: f.name,
        path: f.path,
        language: f.language,
        category: fileCategory,
        lines: f.linesCount,
        linesCount: f.linesCount,
        functionsCount: f.functions.length,
        importsCount: f.imports.length,
        exportsCount: f.exports.length,
        apiCallsCount: f.apiCalls.length,
        routesCount: f.routes.length,
        hasApi: f.apiCalls.length > 0 || f.routes.length > 0
      }
    })
  })

  // 5. Connect Imports (File -> File)
  for (const f of scannedFiles) {
    for (const imp of f.imports) {
      const resolvedTarget = resolveImportPath(f.fullPath, imp.source, fileMap)
      if (resolvedTarget) {
        addEdge(
          f.path,
          resolvedTarget,
          'import',
          'high',
          `Line ${imp.line}: ${imp.isRequire ? 'require' : 'import'} from '${imp.source}'`
        )
      }
    }
  }

  // 6. Connect Frontend API Calls -> Backend Routes -> Direct File-to-File HTTP Requests
  const uniqueApiEndpoints = new Map()
  let matchedConnections = 0
  let brokenConnections = 0

  for (const f of scannedFiles) {
    for (const call of f.apiCalls) {
      const apiNodeId = `api_${call.method}_${call.normalizedPath}`
      if (!uniqueApiEndpoints.has(apiNodeId)) {
        uniqueApiEndpoints.set(apiNodeId, {
          id: apiNodeId,
          label: `${call.method} ${call.normalizedPath}`,
          type: 'apiNode',
          category: 'backend',
          method: call.method,
          endpoint: call.normalizedPath,
          data: {
            id: apiNodeId,
            label: `${call.method} ${call.normalizedPath}`,
            method: call.method,
            endpoint: call.normalizedPath,
            category: 'backend'
          }
        })
        nodes.push(uniqueApiEndpoints.get(apiNodeId))
      }

      // Edge 1: Frontend Client File -> API Endpoint Node
      addEdge(
        f.path,
        apiNodeId,
        'api_call',
        'high',
        `${f.path}:${call.line} initiates ${call.method} ${call.rawEndpoint}`
      )

      // Find matching Backend Route
      const matchingRoute = allBackendRoutes.find(
        (r) =>
          (r.method === call.method || r.method === 'ALL') &&
          (r.normalizedPath === call.normalizedPath ||
            r.normalizedPath === call.normalizedPath.replace(/^\/api/, '') ||
            '/api' + r.normalizedPath === call.normalizedPath)
      )

      if (matchingRoute) {
        matchedConnections++
        // Edge 2: API Node -> Backend Route Handler File
        addEdge(
          apiNodeId,
          matchingRoute.file,
          'api_handler',
          'high',
          `Handled at ${matchingRoute.file}:${matchingRoute.line} (${matchingRoute.method} ${matchingRoute.rawPath})`
        )

        // Edge 3: Direct File-to-File HTTP Communication (e.g. api.ts -> index.js)
        addEdge(
          f.path,
          matchingRoute.file,
          'http_request',
          'high',
          `${f.path}:${call.line} sends HTTP ${call.method} request to ${matchingRoute.file}:${matchingRoute.line} (${call.rawEndpoint})`
        )
      } else {
        brokenConnections++
      }
    }
  }

  // 7. Add Database Node and connect Backend Files (Firebase Firestore)
  const dbNodeId = 'database_firebase_firestore'
  nodes.push({
    id: dbNodeId,
    label: 'Firebase Firestore',
    type: 'databaseNode',
    category: 'database',
    data: {
      id: dbNodeId,
      label: 'Firebase Firestore',
      category: 'database',
      collections: ['users', 'pipeline_runs', 'file_flows', 'repositories']
    }
  })

  for (const f of scannedFiles) {
    if (f.dbOperations && f.dbOperations.length > 0) {
      addEdge(
        f.path,
        dbNodeId,
        'db_operation',
        'high',
        `Executes database operations on Firestore collections (${f.dbOperations.length} occurrences)`
      )
    }
  }

  // 8. Circular Dependency Analysis
  const circularDependencies = detectCircularDependencies(edges)
  const circularNodeSet = new Set()
  const circularEdgeKeySet = new Set()

  circularDependencies.forEach((cycle) => {
    for (let i = 0; i < cycle.length - 1; i++) {
      circularNodeSet.add(cycle[i])
      circularEdgeKeySet.add(`${cycle[i]}-->${cycle[i + 1]}`)
    }
  })

  edges.forEach((e) => {
    if (circularEdgeKeySet.has(`${e.source}-->${e.target}`)) {
      e.isCircular = true
    }
  })

  // 9. Unused / Disconnected Files Analysis
  const incomingMap = new Map()
  const outgoingMap = new Map()

  edges.forEach((e) => {
    outgoingMap.set(e.source, (outgoingMap.get(e.source) || 0) + 1)
    incomingMap.set(e.target, (incomingMap.get(e.target) || 0) + 1)
  })

  let disconnectedCount = 0
  let orphanCount = 0

  nodes.forEach((n) => {
    if (n.type === 'fileNode') {
      const inc = incomingMap.get(n.id) || 0
      const out = outgoingMap.get(n.id) || 0
      n.incomingEdgesCount = inc
      n.outgoingEdgesCount = out
      n.isCircular = circularNodeSet.has(n.id)

      const isEntry =
        n.id.endsWith('main.tsx') ||
        n.id.endsWith('App.tsx') ||
        n.id.endsWith('index.html') ||
        n.id.endsWith('index.js') ||
        n.id.endsWith('main.py') ||
        n.id.endsWith('package.json') ||
        n.id.endsWith('tsconfig.json') ||
        n.id.endsWith('vite.config.ts')

      if (inc === 0 && out === 0) {
        n.isDisconnected = true
        n.disconnectedConfidence = 'high'
        n.statusLabel = 'Disconnected File'
        disconnectedCount++
      } else if (inc === 0 && !isEntry) {
        n.isOrphan = true
        n.orphanConfidence = 'inferred'
        n.statusLabel = 'Unused / No Incoming Imports'
        orphanCount++
      } else {
        n.statusLabel = 'Active Dependency'
      }

      n.data.incomingEdgesCount = inc
      n.data.outgoingEdgesCount = out
      n.data.isCircular = n.isCircular
      n.data.isDisconnected = n.isDisconnected || false
      n.data.isOrphan = n.isOrphan || false
      n.data.statusLabel = n.statusLabel
    }
  })

  // 10. Compile Metrics and Summary
  const languageBreakdown = {}
  scannedFiles.forEach((f) => {
    languageBreakdown[f.language] = (languageBreakdown[f.language] || 0) + 1
  })

  const scanDurationSec = ((Date.now() - startTime) / 1000).toFixed(2)

  const result = {
    projectId,
    analysisId: `scan_${Date.now()}`,
    timestamp: new Date().toISOString(),
    scanDuration: `${scanDurationSec}s`,
    summary: {
      totalFiles: scannedFiles.length,
      totalNodes: nodes.length,
      totalEdges: edges.length,
      languages: languageBreakdown,
      apiEndpointsDetected: uniqueApiEndpoints.size,
      matchedConnections,
      brokenConnections,
      databaseOperations: edges.filter((e) => e.type === 'db_operation').length,
      circularDependenciesCount: circularDependencies.length,
      disconnectedFilesCount: disconnectedCount,
      orphanFilesCount: orphanCount
    },
    circularDependencies,
    nodes,
    edges,
    files: scannedFiles.map((f) => ({
      path: f.path,
      name: f.name,
      category: f.fileCategory,
      language: f.language,
      linesCount: f.linesCount,
      sizeBytes: f.sizeBytes,
      functionsCount: f.functions.length,
      importsCount: f.imports.length,
      apiCallsCount: f.apiCalls.length,
      routesCount: f.routes.length,
      dbOperationsCount: f.dbOperations.length,
      incomingEdgesCount: incomingMap.get(f.path) || 0,
      outgoingEdgesCount: outgoingMap.get(f.path) || 0,
      isCircular: circularNodeSet.has(f.path),
      isDisconnected: (incomingMap.get(f.path) || 0) === 0 && (outgoingMap.get(f.path) || 0) === 0
    }))
  }

  cachedFileFlowAnalysis = result

  // 11. Persist to Firebase Firestore (collection: `file_flows`)
  if (isFirestoreConnected()) {
    try {
      const db = getDB()
      if (db) {
        // Sanitize payload for Firestore
        const docPayload = JSON.parse(JSON.stringify(result))
        await db.collection('file_flows').doc(`${projectId}_latest`).set(docPayload, { merge: true })
        console.log(`[Firebase Firestore] Saved File Flow analysis: ${projectId}_latest (${nodes.length} nodes, ${edges.length} edges)`)
      }
    } catch (dbErr) {
      console.warn('[Firebase Firestore] Could not save file flow document:', dbErr.message)
    }
  }

  return result
}

/**
 * Returns latest cached or stored analysis.
 */
export async function getLatestFileFlowAnalysis(projectId = 'sycnops') {
  if (cachedFileFlowAnalysis) {
    return cachedFileFlowAnalysis
  }

  if (isFirestoreConnected()) {
    try {
      const db = getDB()
      if (db) {
        const doc = await db.collection('file_flows').doc(`${projectId}_latest`).get()
        if (doc.exists) {
          cachedFileFlowAnalysis = doc.data()
          return cachedFileFlowAnalysis
        }
      }
    } catch (e) {}
  }

  // Trigger scan if not yet generated
  return await runFileFlowScan(projectId)
}

/**
 * Retrieves details and raw code for an individual file.
 */
export function getFileDetails(relFilePath) {
  const cleanPath = relFilePath.replace(/^[/\\]+/, '')
  const fullPath = path.resolve(rootDir, cleanPath)

  if (!fs.existsSync(fullPath) || !fullPath.startsWith(rootDir)) {
    throw new Error('File not found or access denied')
  }

  const code = fs.readFileSync(fullPath, 'utf8')
  const ext = path.extname(fullPath).toLowerCase()

  let analysis = null
  if (ext === '.py') {
    analysis = inspectPythonFile(fullPath, code)
  } else if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
    analysis = inspectJsFile(fullPath, code)
  }

  return {
    path: cleanPath.replace(/\\/g, '/'),
    name: path.basename(fullPath),
    language: LANGUAGE_MAP[ext] || 'Text',
    code,
    linesCount: code.split('\n').length,
    sizeBytes: Buffer.byteLength(code, 'utf8'),
    functions: analysis?.functions || [],
    imports: analysis?.imports || [],
    exports: analysis?.exports || [],
    apiCalls: analysis?.apiCalls || [],
    routes: analysis?.routes || [],
    dbOperations: analysis?.dbOperations || []
  }
}

/**
 * Finds paths between two nodes using Breadth-First Search (BFS).
 */
export function findGraphPaths(sourceId, targetId, edges) {
  const adj = new Map()
  edges.forEach((e) => {
    if (!adj.has(e.source)) adj.set(e.source, [])
    adj.get(e.source).push({ target: e.target, type: e.type, evidence: e.evidence })
  })

  const queue = [[{ id: sourceId, edge: null }]]
  const visited = new Set([sourceId])
  const paths = []

  while (queue.length > 0 && paths.length < 5) {
    const currentPath = queue.shift()
    const lastNode = currentPath[currentPath.length - 1].id

    if (lastNode === targetId) {
      paths.push(currentPath)
      continue
    }

    const neighbors = adj.get(lastNode) || []
    for (const neighbor of neighbors) {
      if (!currentPath.some((p) => p.id === neighbor.target)) {
        queue.push([...currentPath, { id: neighbor.target, edge: neighbor }])
      }
    }
  }

  return paths
}


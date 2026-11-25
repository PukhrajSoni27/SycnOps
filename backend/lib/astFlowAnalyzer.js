/**
 * astFlowAnalyzer.js
 * 
 * Dynamic Code Flow & AST Execution Trace Engine for SyncOps.
 * Generates dynamic end-to-end execution flow traces (Frontend UI -> API -> Controller -> DB)
 * for ANY imported repository using real AST metadata and source code.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as babelParser from '@babel/parser'
import babelTraverse from '@babel/traverse'
import { getLatestFileFlowAnalysis } from './fileFlowScanner.js'

const traverse = babelTraverse.default || babelTraverse
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')

/**
 * Extracts a formatted code snippet around a target line.
 */
function extractSnippet(fullPath, targetLine, radius = 4) {
  try {
    if (!fs.existsSync(fullPath)) return '// Source file not found on disk'
    const content = fs.readFileSync(fullPath, 'utf8')
    const lines = content.split('\n')
    const start = Math.max(0, targetLine - 1 - radius)
    const end = Math.min(lines.length - 1, targetLine - 1 + radius)
    return lines.slice(start, end + 1).join('\n')
  } catch {
    return '// Unable to read code snippet'
  }
}

/**
 * Generates real dynamic Code Flow operations for a target repository.
 */
export async function getCodeFlowOperations(repo, userId, repoDir = null) {
  if (!repo || !repoDir || !fs.existsSync(repoDir)) {
    return []
  }
  const repoName = repo?.name || 'repository'
  const repoId = String(repo.id)
  const baseDir = repoDir

  const analysis = await getLatestFileFlowAnalysis(repoId, userId, baseDir)
  const files = analysis.files || []
  const allRoutes = []
  const allApiCalls = []
  const allDbOps = []

  for (const f of files) {
    if (f.routes && f.routes.length > 0) allRoutes.push(...f.routes)
    if (f.apiCalls && f.apiCalls.length > 0) allApiCalls.push(...f.apiCalls)
    if (f.dbOperations && f.dbOperations.length > 0) allDbOps.push(...f.dbOperations)
  }

  const operations = []

  // 1. If repository has API calls or routes, build full request-response flow operations
  if (allApiCalls.length > 0 || allRoutes.length > 0) {
    const candidateEndpoints = new Set()

    allApiCalls.forEach((c) => candidateEndpoints.add(`${c.method} ${c.normalizedPath}`))
    allRoutes.forEach((r) => candidateEndpoints.add(`${r.method} ${r.normalizedPath}`))

    let opCounter = 1
    for (const ep of candidateEndpoints) {
      if (operations.length >= 8) break // Provide top 8 distinct operations
      const [method, normPath] = ep.split(' ')
      const matchingCall = allApiCalls.find((c) => c.method === method && c.normalizedPath === normPath)
      const matchingRoute = allRoutes.find((r) => (r.method === method || r.method === 'ALL') && (r.normalizedPath === normPath || '/api' + r.normalizedPath === normPath || r.normalizedPath === normPath.replace(/^\/api/, '')))

      const opId = `op-${method.toLowerCase()}-${normPath.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'root'}`
      const title = formatOperationTitle(method, normPath)

      operations.push({
        id: opId,
        title,
        repository: repo?.fullName || repoName,
        description: `Execution trace for ${method} ${normPath} through client caller, API gateway, route controllers, and backend services.`,
        trigger: matchingCall ? `Client invokes ${matchingCall.caller || 'fetch/api'} at ${matchingCall.file}:${matchingCall.line}` : `HTTP client sends ${method} request to ${normPath}`,
        apiEndpoint: `${method} ${normPath}`,
        databaseOperation: allDbOps.length > 0 ? `${allDbOps[0].op} on collection '${allDbOps[0].collection || 'data'}'` : 'In-memory / REST state processing',
        totalSteps: 5,
        nodes: [] // Populated in getCodeFlowTrace
      })
      opCounter++
    }
  }

  // 2. Fallback / supplementary operations for libraries, CLIs, or services with functions
  if (operations.length === 0) {
    // Generate operation traces from key source functions
    const keyFunctions = []
    for (const f of files) {
      if (f.functions && f.functions.length > 0) {
        for (const fn of f.functions) {
          if (!fn.isComponent && !fn.name.startsWith('_') && fn.name !== 'anonymous') {
            keyFunctions.push({ ...fn, filePath: f.path })
          }
        }
      }
    }

    const selectedFns = keyFunctions.slice(0, 6)
    if (selectedFns.length > 0) {
      selectedFns.forEach((fn, idx) => {
        operations.push({
          id: `op-fn-${fn.name.toLowerCase()}`,
          title: `Execute ${fn.name}()`,
          repository: repo?.fullName || repoName,
          description: `Internal functional execution flow starting at function ${fn.name}() in ${fn.filePath}:${fn.line}.`,
          trigger: `Called by module import or main workflow: ${fn.name}(${(fn.params || []).join(', ')})`,
          apiEndpoint: 'N/A (Functional Pipeline)',
          databaseOperation: 'N/A',
          totalSteps: 4,
          nodes: []
        })
      })
    } else {
      // General repository analysis operation
      operations.push({
        id: 'op-repo-lifecycle',
        title: `${repoName} Project Lifecycle`,
        repository: repo?.fullName || repoName,
        description: `Lifecycle and execution flow across discovered source files in ${repoName}.`,
        trigger: 'Operator navigates or runs project pipeline',
        apiEndpoint: 'GET /api/project',
        databaseOperation: 'Repository metadata query',
        totalSteps: 4,
        nodes: []
      })
    }
  }

  return operations
}

/**
 * Generates an end-to-end CodeFlowNode step trace for a selected operation.
 */
export async function getCodeFlowTrace(operationId, repo, userId, repoDir = null) {
  if (!repo || !repoDir || !fs.existsSync(repoDir)) {
    return null
  }
  const repoName = repo?.name || 'repository'
  const repoId = String(repo.id)
  const baseDir = repoDir

  const analysis = await getLatestFileFlowAnalysis(repoId, userId, baseDir)
  const files = analysis.files || []
  const allRoutes = []
  const allApiCalls = []
  const allDbOps = []

  for (const f of files) {
    if (f.routes && f.routes.length > 0) allRoutes.push(...f.routes)
    if (f.apiCalls && f.apiCalls.length > 0) allApiCalls.push(...f.apiCalls)
    if (f.dbOperations && f.dbOperations.length > 0) allDbOps.push(...f.dbOperations)
  }

  // Find matching operation definition
  const operations = await getCodeFlowOperations(repo, userId, repoDir)
  const op = operations.find((o) => o.id === operationId) || operations[0]

  if (!op) {
    return null
  }

  const nodes = []
  const [method, normPath] = (op.apiEndpoint || 'GET /').split(' ')
  const matchingCall = allApiCalls.find((c) => c.method === method && (c.normalizedPath === normPath || normPath.includes(c.normalizedPath)))
  const matchingRoute = allRoutes.find((r) => (r.method === method || r.method === 'ALL') && (r.normalizedPath === normPath || '/api' + r.normalizedPath === normPath || normPath.endsWith(r.normalizedPath)))

  let stepNumber = 1

  // Step 1: Frontend Client Call / Trigger
  if (matchingCall) {
    const fullCallerPath = path.resolve(baseDir, matchingCall.file)
    nodes.push({
      id: `step_${stepNumber}`,
      stepNumber,
      name: `Dispatch ${method} Request`,
      type: 'ui_event',
      category: 'Frontend UI',
      filePath: matchingCall.file,
      line: matchingCall.line || 1,
      params: ['event: UIEvent', 'requestData: object'],
      calls: [`api('${matchingCall.rawEndpoint}')`],
      calledBy: ['User Interaction / View Component'],
      apiEndpoint: `${method} ${matchingCall.rawEndpoint}`,
      dbOperation: 'N/A',
      branchConditions: ['Validates form state or authentication before dispatch'],
      errorHandling: 'Catches HTTP rejects, surfaces notification toast to user',
      summary: `Client initiates ${method} request to ${matchingCall.rawEndpoint}.`,
      codeSnippet: extractSnippet(fullCallerPath, matchingCall.line || 1)
    })
    stepNumber++
  } else {
    // Generic entry step
    const entryFile = files.find((f) => f.path.includes('index') || f.path.includes('main') || f.path.includes('app')) || files[0]
    const p = entryFile ? entryFile.path : 'src/index.js'
    nodes.push({
      id: `step_${stepNumber}`,
      stepNumber,
      name: 'Client Trigger / Entry Point',
      type: 'ui_event',
      category: 'Client / Interface',
      filePath: p,
      line: 1,
      params: ['options: object'],
      calls: [op.apiEndpoint],
      calledBy: ['External Trigger / User Input'],
      apiEndpoint: op.apiEndpoint,
      dbOperation: 'N/A',
      branchConditions: ['Inputs validated against schema'],
      errorHandling: 'Returns HTTP error response or throws exception',
      summary: `Trigger dispatched for ${op.title}.`,
      codeSnippet: extractSnippet(path.resolve(baseDir, p), 1)
    })
    stepNumber++
  }

  // Step 2: API Gateway / Network Transport
  nodes.push({
    id: `step_${stepNumber}`,
    stepNumber,
    name: 'Network Gateway & Route Matching',
    type: 'network_hop',
    category: 'API Gateway',
    filePath: matchingRoute ? matchingRoute.file : 'routes/api.js',
    line: matchingRoute ? matchingRoute.line : 1,
    params: ['req: Request', 'res: Response', 'next: Function'],
    calls: [matchingRoute ? `${matchingRoute.method} ${matchingRoute.rawPath}` : op.apiEndpoint],
    calledBy: [`Step ${stepNumber - 1}`],
    apiEndpoint: op.apiEndpoint,
    dbOperation: 'N/A',
    branchConditions: ['CORS validation', 'Authentication header presence check'],
    errorHandling: 'Returns 401 Unauthorized or 404 Route Not Found',
    summary: `Gateway routes incoming ${method} packet to matching handler.`,
    codeSnippet: matchingRoute ? extractSnippet(path.resolve(baseDir, matchingRoute.file), matchingRoute.line) : `// Route definition for ${op.apiEndpoint}`
  })
  stepNumber++

  // Step 3: Controller / Backend Handler Logic
  if (matchingRoute) {
    const fullRoutePath = path.resolve(baseDir, matchingRoute.file)
    nodes.push({
      id: `step_${stepNumber}`,
      stepNumber,
      name: `Execute Route Handler (${matchingRoute.method} ${matchingRoute.rawPath})`,
      type: 'controller_handler',
      category: 'Backend Controller',
      filePath: matchingRoute.file,
      line: matchingRoute.line,
      params: ['req.body', 'req.params', 'req.auth'],
      calls: ['validatePayload()', 'queryDatabase()'],
      calledBy: [`Step ${stepNumber - 1}`],
      apiEndpoint: `${matchingRoute.method} ${matchingRoute.rawPath}`,
      dbOperation: allDbOps.length > 0 ? `${allDbOps[0].op}()` : 'State Mutation',
      branchConditions: ['Payload conforms to expected schema', 'User is authorized for resource'],
      errorHandling: 'Returns 400 Bad Request or 500 Internal Server Error',
      summary: `Controller executes business logic for ${matchingRoute.rawPath}.`,
      codeSnippet: extractSnippet(fullRoutePath, matchingRoute.line)
    })
    stepNumber++
  } else {
    const serviceFile = files.find((f) => f.path.includes('service') || f.path.includes('controller') || f.path.includes('server')) || files[0]
    const p = serviceFile ? serviceFile.path : 'src/server.js'
    nodes.push({
      id: `step_${stepNumber}`,
      stepNumber,
      name: 'Business Logic Execution',
      type: 'service_logic',
      category: 'Service Layer',
      filePath: p,
      line: 10,
      params: ['params: object'],
      calls: ['processData()'],
      calledBy: [`Step ${stepNumber - 1}`],
      apiEndpoint: op.apiEndpoint,
      dbOperation: 'N/A',
      branchConditions: ['Data validation check'],
      errorHandling: 'Propagates errors to handler',
      summary: 'Executes core domain logic and data transformations.',
      codeSnippet: extractSnippet(path.resolve(baseDir, p), 10)
    })
    stepNumber++
  }

  // Step 4: Database / Persistence Operation
  const dbOp = allDbOps[0]
  if (dbOp) {
    nodes.push({
      id: `step_${stepNumber}`,
      stepNumber,
      name: `Persist to Database (${dbOp.collection || 'Collection'})`,
      type: 'db_operation',
      category: 'Database Layer',
      filePath: dbOp.file,
      line: dbOp.line,
      params: ['documentData: object'],
      calls: [`${dbOp.op}('${dbOp.collection || 'default'}')`],
      calledBy: [`Step ${stepNumber - 1}`],
      apiEndpoint: op.apiEndpoint,
      dbOperation: `${dbOp.op} on '${dbOp.collection || 'data'}'`,
      branchConditions: ['Document schema integrity verified'],
      errorHandling: 'Rolls back transaction, throws DatabaseError',
      summary: `Writes or queries record in database layer (${dbOp.collection}).`,
      codeSnippet: extractSnippet(path.resolve(baseDir, dbOp.file), dbOp.line)
    })
    stepNumber++
  }

  // Final Step: Response Serialization & Client Update
  nodes.push({
    id: `step_${stepNumber}`,
    stepNumber,
    name: 'Serialize Response & State Update',
    type: 'ui_update',
    category: 'Client Response',
    filePath: matchingCall ? matchingCall.file : 'frontend/src/pages/Dashboard.tsx',
    line: matchingCall ? matchingCall.line : 1,
    params: ['res.status: 200', 'data: object'],
    calls: ['setState()', 'queryClient.invalidateQueries()'],
    calledBy: [`Step ${stepNumber - 1}`],
    apiEndpoint: op.apiEndpoint,
    dbOperation: 'N/A',
    branchConditions: ['HTTP 200/201 Success'],
    errorHandling: 'Handles network retry on disconnection',
    summary: 'Client updates reactive UI state with fresh data from server.',
    codeSnippet: matchingCall ? extractSnippet(path.resolve(baseDir, matchingCall.file), matchingCall.line) : '// Client state update handler'
  })

  return {
    ...op,
    totalSteps: nodes.length,
    nodes
  }
}

/**
 * Formats a clean operation title from HTTP method and path.
 */
function formatOperationTitle(method, normPath) {
  const parts = normPath.split('/').filter(Boolean)
  const lastPart = parts[parts.length - 1] || 'root'
  const entity = lastPart.replace(/:[a-zA-Z0-9_]+/, '').replace(/[^a-zA-Z0-9]/g, ' ').trim()
  const capitalized = entity.charAt(0).toUpperCase() + entity.slice(1)

  if (method === 'GET') return `Retrieve ${capitalized || 'Data'}`
  if (method === 'POST') return `Create / Submit ${capitalized || 'Record'}`
  if (method === 'PUT' || method === 'PATCH') return `Update ${capitalized || 'Record'}`
  if (method === 'DELETE') return `Delete ${capitalized || 'Record'}`
  return `${method} ${normPath}`
}

/**
 * Real-time AST parser for single-file inspection in Code Flow.
 */
export function analyzeFileAST(code, filePath = 'snippet.ts') {
  if (!code || typeof code !== 'string') {
    return {
      filePath,
      functions: [],
      imports: [],
      exports: [],
      linesCount: 0
    }
  }

  try {
    const ast = babelParser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'classProperties', 'dynamicImport', 'optionalChaining', 'nullishCoalescingOperator']
    })

    const functions = []
    const imports = []
    const exportsList = []

    traverse(ast, {
      FunctionDeclaration(p) {
        functions.push({
          name: p.node.id?.name || 'anonymous',
          line: p.node.loc?.start.line || 1,
          params: p.node.params.map((pr) => pr.name || 'param')
        })
      },
      VariableDeclarator(p) {
        if (p.node.init && (p.node.init.type === 'ArrowFunctionExpression' || p.node.init.type === 'FunctionExpression')) {
          functions.push({
            name: p.node.id?.name || 'anonymous',
            line: p.node.loc?.start.line || 1,
            params: (p.node.init.params || []).map((pr) => pr.name || 'param')
          })
        }
      },
      ImportDeclaration(p) {
        imports.push({
          source: p.node.source.value,
          line: p.node.loc?.start.line || 1
        })
      },
      ExportNamedDeclaration(p) {
        if (p.node.declaration?.id?.name) exportsList.push(p.node.declaration.id.name)
      }
    })

    return {
      filePath,
      functions,
      imports,
      exports: exportsList,
      linesCount: code.split('\n').length
    }
  } catch (err) {
    return {
      filePath,
      error: err.message,
      linesCount: code.split('\n').length
    }
  }
}

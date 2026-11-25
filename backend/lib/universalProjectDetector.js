/**
 * universalProjectDetector.js
 * 
 * Dynamic, language-agnostic project inspector for SyncOps.
 * Inspects any imported repository on disk:
 * - Programming languages (JS, TS, Python, Java, Go, Rust, C, C++, C#, Ruby, PHP, Swift, Kotlin, Shell, etc.)
 * - Frameworks & libraries (React, Next.js, Express, FastAPI, Flask, Django, Spring Boot, Gin, etc.)
 * - Package managers & build tools (npm, yarn, pnpm, pip, poetry, maven, gradle, cargo, go mod)
 * - Real dependencies extracted from actual manifests
 * - Project structure: source dirs, test dirs, build dirs, entry points
 * - Applicable scanners & static analysis tools
 */

import fs from 'fs'
import path from 'path'

export const VENDOR_AND_BUILD_DIRS = new Set([
  'node_modules', '.git', 'vendor', 'pods', '.venv', 'venv', 'env', '__pycache__',
  '.pytest_cache', '.mypy_cache', '.next', '.nuxt', 'dist', 'build', 'out',
  '.cache', '.turbo', 'coverage', '.vscode', '.idea', '.devin', 'site-packages',
  '.docusaurus', 'target', 'bin', 'obj', '.bundle', '.gradle', '.m2'
])

export const LANGUAGE_EXTENSIONS = {
  // JavaScript / TypeScript
  '.ts': { language: 'TypeScript', isCode: true, category: 'frontend_or_backend' },
  '.tsx': { language: 'TypeScript (React)', isCode: true, category: 'frontend' },
  '.js': { language: 'JavaScript', isCode: true, category: 'frontend_or_backend' },
  '.jsx': { language: 'JavaScript (React)', isCode: true, category: 'frontend' },
  '.mjs': { language: 'JavaScript', isCode: true, category: 'backend' },
  '.cjs': { language: 'JavaScript', isCode: true, category: 'backend' },

  // Python
  '.py': { language: 'Python', isCode: true, category: 'backend' },
  '.pyw': { language: 'Python', isCode: true, category: 'backend' },
  '.pyi': { language: 'Python', isCode: true, category: 'backend' },
  '.ipynb': { language: 'Jupyter Notebook', isCode: true, category: 'ml_data' },

  // Java / Kotlin / JVM
  '.java': { language: 'Java', isCode: true, category: 'backend' },
  '.kt': { language: 'Kotlin', isCode: true, category: 'backend_or_mobile' },
  '.kts': { language: 'Kotlin Script', isCode: true, category: 'build' },
  '.scala': { language: 'Scala', isCode: true, category: 'backend' },

  // Systems / Compiled
  '.go': { language: 'Go', isCode: true, category: 'backend' },
  '.rs': { language: 'Rust', isCode: true, category: 'systems_backend' },
  '.c': { language: 'C', isCode: true, category: 'systems' },
  '.cpp': { language: 'C++', isCode: true, category: 'systems' },
  '.cc': { language: 'C++', isCode: true, category: 'systems' },
  '.cxx': { language: 'C++', isCode: true, category: 'systems' },
  '.h': { language: 'C/C++ Header', isCode: true, category: 'systems' },
  '.hpp': { language: 'C++ Header', isCode: true, category: 'systems' },
  '.cs': { language: 'C#', isCode: true, category: 'backend' },

  // Web & Scripting
  '.php': { language: 'PHP', isCode: true, category: 'backend' },
  '.rb': { language: 'Ruby', isCode: true, category: 'backend' },
  '.swift': { language: 'Swift', isCode: true, category: 'mobile_systems' },
  '.sh': { language: 'Shell', isCode: true, category: 'script' },
  '.bash': { language: 'Shell', isCode: true, category: 'script' },
  '.zsh': { language: 'Shell', isCode: true, category: 'script' },
  '.ps1': { language: 'PowerShell', isCode: true, category: 'script' },
  '.bat': { language: 'Batch', isCode: true, category: 'script' },
  '.cmd': { language: 'Batch', isCode: true, category: 'script' },

  // Web Styles & Markup
  '.html': { language: 'HTML', isCode: false, category: 'markup' },
  '.htm': { language: 'HTML', isCode: false, category: 'markup' },
  '.css': { language: 'CSS', isCode: false, category: 'style' },
  '.scss': { language: 'SCSS', isCode: false, category: 'style' },
  '.sass': { language: 'SASS', isCode: false, category: 'style' },
  '.less': { language: 'Less', isCode: false, category: 'style' },
  '.vue': { language: 'Vue', isCode: true, category: 'frontend' },
  '.svelte': { language: 'Svelte', isCode: true, category: 'frontend' },

  // Config & Data
  '.json': { language: 'JSON', isCode: false, category: 'data_config' },
  '.yaml': { language: 'YAML', isCode: false, category: 'data_config' },
  '.yml': { language: 'YAML', isCode: false, category: 'data_config' },
  '.toml': { language: 'TOML', isCode: false, category: 'data_config' },
  '.xml': { language: 'XML', isCode: false, category: 'data_config' },
  '.sql': { language: 'SQL', isCode: true, category: 'database' },
  '.graphql': { language: 'GraphQL', isCode: true, category: 'api_schema' },
  '.gql': { language: 'GraphQL', isCode: true, category: 'api_schema' },
  '.proto': { language: 'Protobuf', isCode: true, category: 'api_schema' },
  '.md': { language: 'Markdown', isCode: false, category: 'docs' },
  '.markdown': { language: 'Markdown', isCode: false, category: 'docs' },
  '.csv': { language: 'CSV', isCode: false, category: 'data' }
}

const COMMON_ENTRY_PATTERNS = [
  /^(index|main|app|server)\.(ts|js|jsx|tsx|py|go|rs|rb|php)$/i,
  /^main\.(py|go|rs|cpp|c|java)$/i,
  /^App\.(tsx|jsx|vue|svelte)$/i,
  /Application\.java$/i
]

/**
 * Checks if a path is inside a vendor or build directory.
 */
export function isVendorOrBuild(relPath) {
  if (!relPath) return false
  const norm = relPath.replace(/\\/g, '/')
  const parts = norm.split('/')
  return parts.some((p) => VENDOR_AND_BUILD_DIRS.has(p.toLowerCase()))
}

/**
 * Recursively inspects a repository directory and detects all project metadata dynamically.
 */
export function detectUniversalProject(repoDir) {
  const normRepoDir = path.resolve(repoDir)
  if (!fs.existsSync(normRepoDir) || !fs.statSync(normRepoDir).isDirectory()) {
    return {
      repoDir: normRepoDir,
      exists: false,
      totalFiles: 0,
      totalLines: 0,
      languages: [],
      frameworks: [],
      packageManagers: [],
      manifests: [],
      dependencies: [],
      entryPoints: [],
      sourceDirs: [],
      testDirs: [],
      buildDirs: [],
      applicableScanners: { eslint: false, ruff: false, semgrep: false }
    }
  }

  const allFiles = []
  const sourceFiles = []
  const testFiles = []
  const entryPoints = []
  const foundManifests = []
  const langCounts = {}
  const langLines = {}
  const sourceDirSet = new Set()
  const testDirSet = new Set()
  const buildDirSet = new Set()
  let totalLines = 0
  let totalBytes = 0

  function walk(dir) {
    let entries = []
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relPath = path.relative(normRepoDir, fullPath).replace(/\\/g, '/')
      const lowerRel = relPath.toLowerCase()

      if (entry.isDirectory()) {
        if (VENDOR_AND_BUILD_DIRS.has(entry.name.toLowerCase())) {
          buildDirSet.add(relPath)
          continue
        }
        if (/^(test|tests|__tests__|__spec__|spec)$/i.test(entry.name)) {
          testDirSet.add(relPath)
        } else if (/^(src|lib|app|pkg|internal|components|pages|routes|controllers|services|backend|frontend)$/i.test(entry.name)) {
          sourceDirSet.add(relPath)
        }
        walk(fullPath)
      } else if (entry.isFile()) {
        if (isVendorOrBuild(relPath)) continue

        const ext = path.extname(entry.name).toLowerCase()
        const meta = LANGUAGE_EXTENSIONS[ext] || { language: 'Other', isCode: false, category: 'other' }
        const isManifest = /^(package\.json|requirements\.txt|pyproject\.toml|Pipfile|pom\.xml|build\.gradle|build\.gradle\.kts|go\.mod|Cargo\.toml|Gemfile|composer\.json)$/i.test(entry.name)

        let lineCount = 0
        let byteSize = 0
        try {
          const stat = fs.statSync(fullPath)
          byteSize = stat.size
          // For text and code files under 2MB, count lines
          if (byteSize < 2 * 1024 * 1024 && meta.isCode) {
            const content = fs.readFileSync(fullPath, 'utf8')
            lineCount = content.split('\n').length
          }
        } catch {}

        totalLines += lineCount
        totalBytes += byteSize

        const fileRecord = {
          relPath,
          name: entry.name,
          ext,
          language: meta.language,
          isCode: meta.isCode,
          category: meta.category,
          lines: lineCount,
          size: byteSize
        }

        allFiles.push(fileRecord)

        if (meta.isCode) {
          sourceFiles.push(fileRecord)
          langCounts[meta.language] = (langCounts[meta.language] || 0) + 1
          langLines[meta.language] = (langLines[meta.language] || 0) + lineCount
        }

        // Check if test file
        if (/(?:test|spec|__tests__|__spec__)\./i.test(entry.name) || lowerRel.includes('/test/') || lowerRel.includes('/tests/')) {
          testFiles.push(fileRecord)
        }

        // Check entry points
        if (COMMON_ENTRY_PATTERNS.some((p) => p.test(entry.name))) {
          entryPoints.push(relPath)
        }

        if (isManifest) {
          foundManifests.push({
            name: entry.name,
            relPath,
            fullPath
          })
        }
      }
    }
  }

  walk(normRepoDir)

  // Parse actual dependencies from manifests
  const dependencies = []
  const frameworks = new Set()
  const packageManagers = new Set()

  for (const manifest of foundManifests) {
    try {
      const content = fs.readFileSync(manifest.fullPath, 'utf8')
      const name = manifest.name.toLowerCase()

      if (name === 'package.json') {
        packageManagers.add('npm')
        const pkg = JSON.parse(content)
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
        for (const [depName, version] of Object.entries(deps)) {
          dependencies.push({ name: depName, version: String(version), ecosystem: 'npm', manifest: manifest.relPath })
          if (depName === 'react' || depName === 'react-dom') frameworks.add('React')
          if (depName === 'next') frameworks.add('Next.js')
          if (depName === 'vue') frameworks.add('Vue')
          if (depName === '@angular/core') frameworks.add('Angular')
          if (depName === 'svelte') frameworks.add('Svelte')
          if (depName === 'express') frameworks.add('Express')
          if (depName === 'fastify') frameworks.add('Fastify')
          if (depName === '@nestjs/core') frameworks.add('NestJS')
          if (depName === 'vite') frameworks.add('Vite')
          if (depName === 'tailwindcss') frameworks.add('TailwindCSS')
        }
      } else if (name === 'requirements.txt') {
        packageManagers.add('pip')
        const lines = content.split('\n')
        for (const l of lines) {
          const trimmed = l.trim()
          if (!trimmed || trimmed.startsWith('#')) continue
          const match = trimmed.match(/^([a-zA-Z0-9_\-\[\]]+)(?:[=<>~~!]+(.*))?/)
          if (match) {
            const depName = match[1].toLowerCase()
            const version = match[2]?.trim() || '*'
            dependencies.push({ name: depName, version, ecosystem: 'pip', manifest: manifest.relPath })
            if (depName.includes('fastapi')) frameworks.add('FastAPI')
            if (depName.includes('flask')) frameworks.add('Flask')
            if (depName.includes('django')) frameworks.add('Django')
            if (depName.includes('torch') || depName.includes('tensorflow') || depName.includes('scikit-learn')) frameworks.add('ML/DataScience')
          }
        }
      } else if (name === 'pyproject.toml') {
        packageManagers.add('poetry/pip')
        if (content.includes('fastapi')) frameworks.add('FastAPI')
        if (content.includes('django')) frameworks.add('Django')
        if (content.includes('flask')) frameworks.add('Flask')
      } else if (name === 'pom.xml') {
        packageManagers.add('maven')
        frameworks.add('Java')
        if (content.includes('spring-boot')) frameworks.add('Spring Boot')
      } else if (name.startsWith('build.gradle')) {
        packageManagers.add('gradle')
        frameworks.add('Java/Kotlin')
        if (content.includes('spring-boot')) frameworks.add('Spring Boot')
      } else if (name === 'go.mod') {
        packageManagers.add('go modules')
        frameworks.add('Go')
        if (content.includes('gin-gonic')) frameworks.add('Gin')
        if (content.includes('labstack/echo')) frameworks.add('Echo')
      } else if (name === 'cargo.toml') {
        packageManagers.add('cargo')
        frameworks.add('Rust')
        if (content.includes('actix-web')) frameworks.add('Actix Web')
        if (content.includes('axum')) frameworks.add('Axum')
      }
    } catch {}
  }

  // Sorted languages by file count
  const sortedLanguages = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({
      name: lang,
      fileCount: count,
      lineCount: langLines[lang] || 0,
      percentage: sourceFiles.length > 0 ? Number(((count / sourceFiles.length) * 100).toFixed(1)) : 0
    }))

  const hasJsTs = (langCounts['JavaScript'] || 0) + (langCounts['TypeScript'] || 0) + (langCounts['TypeScript (React)'] || 0) + (langCounts['JavaScript (React)'] || 0) > 0
  const hasPython = (langCounts['Python'] || 0) + (langCounts['Jupyter Notebook'] || 0) > 0

  return {
    repoDir: normRepoDir,
    exists: true,
    totalFiles: allFiles.length,
    sourceFilesCount: sourceFiles.length,
    testFilesCount: testFiles.length,
    totalLines,
    totalBytes,
    languages: sortedLanguages,
    primaryLanguage: sortedLanguages[0]?.name || (allFiles.length > 0 ? 'Generic' : 'Empty'),
    frameworks: Array.from(frameworks),
    packageManagers: Array.from(packageManagers),
    manifests: foundManifests.map((m) => m.relPath),
    dependencies,
    entryPoints,
    sourceDirs: Array.from(sourceDirSet),
    testDirs: Array.from(testDirSet),
    buildDirs: Array.from(buildDirSet),
    applicableScanners: {
      eslint: hasJsTs,
      ruff: hasPython,
      semgrep: sourceFiles.length > 0
    }
  }
}

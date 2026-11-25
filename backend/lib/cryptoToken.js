/**
 * SyncOps Token Encryption and Credential Security Module (Stage 6.1)
 * 
 * Provides:
 * 1. AES-256-GCM authenticated encryption at rest for GitHub tokens.
 * 2. Scrypt key derivation from process.env.ENCRYPTION_KEY or JWT_SECRET.
 * 3. Safe token masking for logs, exceptions, and UI previews (ghp_••••xxxx).
 * 4. API repository response sanitization (ensuring tokens are never returned to client).
 */

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const TAG_LENGTH = 16
const SALT = 'syncops_token_salt_v1_secure'
const ENCRYPTION_PREFIX = 'enc:v1:'

/**
 * Derives a 32-byte cryptographic key from environment secret.
 */
function deriveKey(secret) {
  const masterSecret = secret || process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'syncops_default_fallback_secret_key_2026'
  return crypto.scryptSync(masterSecret, SALT, 32)
}

/**
 * Encrypts a plaintext token using AES-256-GCM with authentication tag.
 * Returns formatted string: "enc:v1:<iv_hex>:<tag_hex>:<ciphertext_hex>"
 */
export function encryptToken(plainToken, secret = null) {
  if (!plainToken || typeof plainToken !== 'string') return plainToken
  const trimmed = plainToken.trim()
  if (!trimmed) return plainToken

  // If already encrypted, do not double-encrypt
  if (trimmed.startsWith(ENCRYPTION_PREFIX)) {
    return trimmed
  }

  const key = deriveKey(secret)
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(trimmed, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag()

  return `${ENCRYPTION_PREFIX}${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

/**
 * Decrypts an AES-256-GCM encrypted token.
 * If token is not encrypted (e.g. legacy plaintext or null), returns as-is safely.
 */
export function decryptToken(encryptedToken, secret = null) {
  if (!encryptedToken || typeof encryptedToken !== 'string') return encryptedToken
  const trimmed = encryptedToken.trim()

  if (!trimmed.startsWith(ENCRYPTION_PREFIX)) {
    return trimmed // Not encrypted, return plain token
  }

  try {
    const parts = trimmed.slice(ENCRYPTION_PREFIX.length).split(':')
    if (parts.length !== 3) {
      throw new Error('Malformed encrypted token format')
    }

    const [ivHex, tagHex, cipherHex] = parts
    const key = deriveKey(secret)
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(tagHex, 'hex')

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(cipherHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (err) {
    console.warn('[CryptoToken] Decryption failed:', err.message)
    return null
  }
}

/**
 * Masks a token for safe display or logging.
 * Example: "ghp_1234567890abcdef" -> "ghp_••••cdef"
 */
export function maskToken(token) {
  if (!token || typeof token !== 'string') return null
  const trimmed = token.trim()
  if (!trimmed) return null

  // If encrypted, decrypt temporarily for masking if possible
  const raw = trimmed.startsWith(ENCRYPTION_PREFIX) ? decryptToken(trimmed) : trimmed
  if (!raw) return '••••••••'

  if (raw.length <= 8) {
    return '••••••••'
  }

  const prefix = raw.startsWith('ghp_') ? 'ghp_' : (raw.startsWith('github_pat_') ? 'github_pat_' : '')
  const suffix = raw.slice(-4)
  return `${prefix}••••${suffix}`
}

/**
 * Sanitizes a repository object before sending it in API responses to the frontend.
 * Removes plaintext and encrypted tokens, replacing them with a safe hasCustomToken flag.
 */
export function sanitizeRepoForClient(repo) {
  if (!repo || typeof repo !== 'object') return repo

  const copy = { ...repo }

  const hasToken = Boolean(copy.githubToken || copy.encryptedGithubToken)
  copy.hasCustomToken = hasToken

  if (hasToken) {
    copy.tokenPreview = maskToken(copy.githubToken || copy.encryptedGithubToken)
  }

  // Remove credentials strictly
  delete copy.githubToken
  delete copy.encryptedGithubToken

  return copy
}

/**
 * Sanitizes an array of repository objects.
 */
export function sanitizeRepoListForClient(repos) {
  if (!Array.isArray(repos)) return []
  return repos.map(sanitizeRepoForClient)
}

export default {
  encryptToken,
  decryptToken,
  maskToken,
  sanitizeRepoForClient,
  sanitizeRepoListForClient
}

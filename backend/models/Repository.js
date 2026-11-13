/**
 * Repository model and helpers for Firebase Firestore (`repositories` collection).
 */
import { getDB } from '../config/firebase.js'

export const REPOSITORIES_COLLECTION = 'repositories'

export function getRepositoriesCollection() {
  const db = getDB()
  return db ? db.collection(REPOSITORIES_COLLECTION) : null
}

export function formatRepositoryData(doc) {
  if (!doc) return null
  const data = typeof doc.data === 'function' ? doc.data() : doc
  return {
    id: doc.id || data.id,
    userId: data.userId || null,
    name: data.name || '',
    fullName: data.fullName || data.name || '',
    description: data.description || '',
    language: data.language || 'TypeScript',
    visibility: data.visibility || 'public',
    defaultBranch: data.defaultBranch || 'main',
    htmlUrl: data.htmlUrl || '',
    pipeline: data.pipeline || null,
    createdAt: data.createdAt || new Date().toISOString()
  }
}

export default {
  REPOSITORIES_COLLECTION,
  getRepositoriesCollection,
  formatRepositoryData
}

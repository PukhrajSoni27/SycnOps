/**
 * User model and helpers for Firebase Firestore (`users` collection).
 */
import { getDB } from '../config/firebase.js'

export const USERS_COLLECTION = 'users'

export function getUsersCollection() {
  const db = getDB()
  return db ? db.collection(USERS_COLLECTION) : null
}

export function formatUserData(doc) {
  if (!doc) return null
  const data = typeof doc.data === 'function' ? doc.data() : doc
  return {
    id: doc.id || data.id,
    name: data.name || '',
    email: data.email || '',
    role: data.role || 'developer',
    avatar: data.avatar || null,
    authProvider: data.authProvider || 'local',
    isActive: data.isActive !== false,
    lastLoginAt: data.lastLoginAt || null,
    createdAt: data.createdAt || new Date().toISOString()
  }
}

export default {
  USERS_COLLECTION,
  getUsersCollection,
  formatUserData
}

/**
 * Commit model and helpers for Firebase Firestore (`commits` collection).
 */
import { getDB } from '../config/firebase.js'

export const COMMITS_COLLECTION = 'commits'

export function getCommitsCollection() {
  const db = getDB()
  return db ? db.collection(COMMITS_COLLECTION) : null
}

export default {
  COMMITS_COLLECTION,
  getCommitsCollection
}

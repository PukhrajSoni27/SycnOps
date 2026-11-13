/**
 * Issue model and helpers for Firebase Firestore (`issues` collection).
 */
import { getDB } from '../config/firebase.js'

export const ISSUES_COLLECTION = 'issues'

export function getIssuesCollection() {
  const db = getDB()
  return db ? db.collection(ISSUES_COLLECTION) : null
}

export default {
  ISSUES_COLLECTION,
  getIssuesCollection
}

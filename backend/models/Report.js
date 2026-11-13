/**
 * Report model and helpers for Firebase Firestore (`reports` collection).
 */
import { getDB } from '../config/firebase.js'

export const REPORTS_COLLECTION = 'reports'

export function getReportsCollection() {
  const db = getDB()
  return db ? db.collection(REPORTS_COLLECTION) : null
}

export default {
  REPORTS_COLLECTION,
  getReportsCollection
}

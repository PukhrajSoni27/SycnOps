/**
 * AIHistory model and helpers for Firebase Firestore (`ai_histories` collection).
 */
import { getDB } from '../config/firebase.js'

export const AI_HISTORY_COLLECTION = 'ai_histories'

export function getAIHistoryCollection() {
  const db = getDB()
  return db ? db.collection(AI_HISTORY_COLLECTION) : null
}

export default {
  AI_HISTORY_COLLECTION,
  getAIHistoryCollection
}

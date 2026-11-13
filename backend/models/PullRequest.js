/**
 * PullRequest model and helpers for Firebase Firestore (`pull_requests` collection).
 */
import { getDB } from '../config/firebase.js'

export const PULL_REQUESTS_COLLECTION = 'pull_requests'

export function getPullRequestsCollection() {
  const db = getDB()
  return db ? db.collection(PULL_REQUESTS_COLLECTION) : null
}

export default {
  PULL_REQUESTS_COLLECTION,
  getPullRequestsCollection
}

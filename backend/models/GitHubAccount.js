/**
 * GitHubAccount model and helpers for Firebase Firestore (`github_accounts` collection).
 */
import { getDB } from '../config/firebase.js'

export const GITHUB_ACCOUNTS_COLLECTION = 'github_accounts'

export function getGitHubAccountsCollection() {
  const db = getDB()
  return db ? db.collection(GITHUB_ACCOUNTS_COLLECTION) : null
}

export default {
  GITHUB_ACCOUNTS_COLLECTION,
  getGitHubAccountsCollection
}

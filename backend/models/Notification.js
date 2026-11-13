/**
 * Notification model and helpers for Firebase Firestore (`notifications` collection).
 */
import { getDB } from '../config/firebase.js'

export const NOTIFICATIONS_COLLECTION = 'notifications'

export function getNotificationsCollection() {
  const db = getDB()
  return db ? db.collection(NOTIFICATIONS_COLLECTION) : null
}

export default {
  NOTIFICATIONS_COLLECTION,
  getNotificationsCollection
}

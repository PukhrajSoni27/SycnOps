/**
 * db.js — Database connection entry point for SycnOps backend.
 * Now uses Firebase Firestore instead of MongoDB/Mongoose.
 * Re-exports helpers from config/firebase.js for backwards compatibility.
 */
export { initFirebase as connectDB, getDB, isFirestoreConnected } from './firebase.js'

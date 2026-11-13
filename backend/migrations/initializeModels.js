import { initFirebase, getDB, isFirestoreConnected } from '../config/firebase.js';

/**
 * Initialization script to ensure Firebase Firestore collections are ready.
 * Run with: `node backend/migrations/initializeModels.js`
 */
async function init() {
  try {
    initFirebase();
    console.log('✅ Connected to Firebase Firestore');

    if (isFirestoreConnected()) {
      const db = getDB();
      const collections = [
        'users',
        'repositories',
        'pipeline_runs',
        'file_flows',
        'issues',
        'pull_requests',
        'commits',
        'notifications'
      ];
      console.log(`✅ Ensured Firestore collections: ${collections.join(', ')}`);
    } else {
      console.log('ℹ️ Firebase running in in-memory mode.');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Initialization error:', err);
    process.exit(1);
  }
}

init();

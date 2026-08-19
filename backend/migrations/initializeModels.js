import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import GitHubAccount from '../models/GitHubAccount.js';
import Repository from '../models/Repository.js';
import PullRequest from '../models/PullRequest.js';
import Issue from '../models/Issue.js';
import Commit from '../models/Commit.js';
import Notification from '../models/Notification.js';
import Report from '../models/Report.js';

/**
 * Initialization script to ensure indexes are created for all models.
 * Run with: `node backend/migrations/initializeModels.js`
 */
async function init() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Force index creation for each model
    await Promise.all([
      User.init(),
      GitHubAccount.init(),
      Repository.init(),
      PullRequest.init(),
      Issue.init(),
      Commit.init(),
      Notification.init(),
      AIHistory.init()
    ]);
    console.log('✅ All model indexes have been ensured');
    process.exit(0);
  } catch (err) {
    console.error('❌ Initialization error:', err);
    process.exit(1);
  }
}

init();

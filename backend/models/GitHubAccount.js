import mongoose from 'mongoose'

const gitHubAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    githubId: {
      type: String,
      required: [true, 'GitHub ID is required'],
      unique: true
    },
    username: {
      type: String,
      required: [true, 'GitHub username is required'],
      trim: true
    },
    accessToken: {
      type: String,
      required: [true, 'Access token is required']
    },
    refreshToken: {
      type: String,
      default: null
    },
    avatarUrl: {
      type: String,
      default: null
    },
    profileUrl: {
      type: String,
      default: null
    },
    scopes: {
      type: [String],
      default: ['repo', 'read:user']
    },
    tokenExpiresAt: {
      type: Date,
      default: null
    },
    isConnected: {
      type: Boolean,
      default: true
    },
    lastSyncAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// ── Indexes ──────────────────────────────────────────────
gitHubAccountSchema.index({ user: 1, githubId: 1 }, { unique: true })
gitHubAccountSchema.index({ username: 1 })
gitHubAccountSchema.index({ isConnected: 1 })

// ── Virtuals ─────────────────────────────────────────────
gitHubAccountSchema.virtual('repositories', {
  ref: 'Repository',
  localField: '_id',
  foreignField: 'githubAccount'
})

const GitHubAccount = mongoose.model('GitHubAccount', gitHubAccountSchema)
export default GitHubAccount

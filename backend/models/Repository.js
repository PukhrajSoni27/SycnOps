import mongoose from 'mongoose'

const repositorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    githubAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GitHubAccount',
      required: [true, 'GitHubAccount reference is required'],
      index: true
    },
    githubRepoId: {
      type: Number,
      required: [true, 'GitHub repo ID is required']
    },
    name: {
      type: String,
      required: [true, 'Repository name is required'],
      trim: true
    },
    fullName: {
      type: String,
      required: [true, 'Full repository name (owner/repo) is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    language: {
      type: String,
      default: null
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'internal'],
      default: 'public'
    },
    defaultBranch: {
      type: String,
      default: 'main'
    },
    stars: {
      type: Number,
      default: 0
    },
    forks: {
      type: Number,
      default: 0
    },
    openIssuesCount: {
      type: Number,
      default: 0
    },
    watchersCount: {
      type: Number,
      default: 0
    },
    htmlUrl: {
      type: String,
      default: null
    },
    cloneUrl: {
      type: String,
      default: null
    },
    isTracked: {
      type: Boolean,
      default: true
    },
    lastSyncAt: {
      type: Date,
      default: null
    },
    pushedAt: {
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
repositorySchema.index({ user: 1, githubRepoId: 1 }, { unique: true })
repositorySchema.index({ fullName: 1 })
repositorySchema.index({ language: 1 })
repositorySchema.index({ visibility: 1 })
repositorySchema.index({ stars: -1 })
repositorySchema.index({ isTracked: 1 })
repositorySchema.index({ pushedAt: -1 })

// ── Virtuals ─────────────────────────────────────────────
repositorySchema.virtual('pullRequests', {
  ref: 'PullRequest',
  localField: '_id',
  foreignField: 'repository'
})

repositorySchema.virtual('issues', {
  ref: 'Issue',
  localField: '_id',
  foreignField: 'repository'
})

repositorySchema.virtual('commits', {
  ref: 'Commit',
  localField: '_id',
  foreignField: 'repository'
})

const Repository = mongoose.model('Repository', repositorySchema)
export default Repository

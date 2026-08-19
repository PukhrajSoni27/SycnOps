import mongoose from 'mongoose'

const pullRequestSchema = new mongoose.Schema(
  {
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repository',
      required: [true, 'Repository reference is required'],
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    githubPrId: {
      type: Number,
      required: [true, 'GitHub PR ID is required']
    },
    number: {
      type: Number,
      required: [true, 'PR number is required']
    },
    title: {
      type: String,
      required: [true, 'PR title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters']
    },
    body: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      enum: ['open', 'closed', 'merged'],
      default: 'open',
      index: true
    },
    authorLogin: {
      type: String,
      required: [true, 'Author login is required'],
      trim: true
    },
    authorAvatarUrl: {
      type: String,
      default: null
    },
    baseBranch: {
      type: String,
      default: 'main'
    },
    headBranch: {
      type: String,
      required: [true, 'Head branch is required']
    },
    commitsCount: {
      type: Number,
      default: 0
    },
    additions: {
      type: Number,
      default: 0
    },
    deletions: {
      type: Number,
      default: 0
    },
    changedFiles: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    },
    reviewCommentsCount: {
      type: Number,
      default: 0
    },
    labels: {
      type: [String],
      default: []
    },
    reviewers: {
      type: [String],
      default: []
    },
    isDraft: {
      type: Boolean,
      default: false
    },
    htmlUrl: {
      type: String,
      default: null
    },
    mergedAt: {
      type: Date,
      default: null
    },
    closedAt: {
      type: Date,
      default: null
    },
    githubCreatedAt: {
      type: Date,
      default: null
    },
    githubUpdatedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

// ── Indexes ──────────────────────────────────────────────
pullRequestSchema.index({ repository: 1, githubPrId: 1 }, { unique: true })
pullRequestSchema.index({ repository: 1, number: 1 })
pullRequestSchema.index({ state: 1, repository: 1 })
pullRequestSchema.index({ authorLogin: 1 })
pullRequestSchema.index({ mergedAt: -1 })
pullRequestSchema.index({ githubCreatedAt: -1 })
pullRequestSchema.index({ labels: 1 })

const PullRequest = mongoose.model('PullRequest', pullRequestSchema)
export default PullRequest

import mongoose from 'mongoose'

const issueSchema = new mongoose.Schema(
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
    githubIssueId: {
      type: Number,
      required: [true, 'GitHub issue ID is required']
    },
    number: {
      type: Number,
      required: [true, 'Issue number is required']
    },
    title: {
      type: String,
      required: [true, 'Issue title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters']
    },
    body: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
      index: true
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low', 'none'],
      default: 'none'
    },
    labels: {
      type: [String],
      default: []
    },
    assignees: {
      type: [String],
      default: []
    },
    authorLogin: {
      type: String,
      required: [true, 'Author login is required'],
      trim: true
    },
    commentsCount: {
      type: Number,
      default: 0
    },
    isPullRequest: {
      type: Boolean,
      default: false
    },
    htmlUrl: {
      type: String,
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
issueSchema.index({ repository: 1, githubIssueId: 1 }, { unique: true })
issueSchema.index({ repository: 1, number: 1 })
issueSchema.index({ state: 1, repository: 1 })
issueSchema.index({ priority: 1 })
issueSchema.index({ authorLogin: 1 })
issueSchema.index({ labels: 1 })
issueSchema.index({ assignees: 1 })
issueSchema.index({ githubCreatedAt: -1 })

const Issue = mongoose.model('Issue', issueSchema)
export default Issue

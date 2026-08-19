import mongoose from 'mongoose'

const aiHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    sessionId: {
      type: String,
      required: [true, 'Session ID is required'],
      index: true
    },
    prompt: {
      type: String,
      required: [true, 'User prompt is required'],
      maxlength: [5000, 'Prompt cannot exceed 5000 characters']
    },
    response: {
      type: String,
      required: [true, 'AI response is required'],
      maxlength: [20000, 'Response cannot exceed 20000 characters']
    },
    model: {
      type: String,
      default: 'sycnops-copilot-v1'
    },
    category: {
      type: String,
      enum: [
        'code_review',
        'pr_summary',
        'documentation',
        'workflow_automation',
        'bug_analysis',
        'performance_optimization',
        'general',
        'other'
      ],
      default: 'general'
    },
    // Optional context linking
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repository',
      default: null
    },
    pullRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PullRequest',
      default: null
    },
    tokensUsed: {
      type: Number,
      default: 0
    },
    latencyMs: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    feedback: {
      type: String,
      default: null,
      maxlength: [500, 'Feedback cannot exceed 500 characters']
    }
  },
  {
    timestamps: true
  }
)

// ── Indexes ──────────────────────────────────────────────
aiHistorySchema.index({ user: 1, createdAt: -1 })
aiHistorySchema.index({ user: 1, sessionId: 1 })
aiHistorySchema.index({ category: 1 })
aiHistorySchema.index({ model: 1 })
aiHistorySchema.index({ createdAt: -1 })
// TTL index: auto-delete AI history older than 1 year
aiHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 })

const AIHistory = mongoose.model('AIHistory', aiHistorySchema)
export default AIHistory

import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    type: {
      type: String,
      enum: [
        'pr_opened',
        'pr_merged',
        'pr_closed',
        'pr_review_requested',
        'issue_opened',
        'issue_closed',
        'issue_assigned',
        'commit_pushed',
        'repo_synced',
        'ai_response',
        'report_generated',
        'system_alert',
        'mention'
      ],
      required: [true, 'Notification type is required']
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    message: {
      type: String,
      default: '',
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    // Polymorphic reference: link to the relevant document
    resourceType: {
      type: String,
      enum: ['PullRequest', 'Issue', 'Commit', 'Repository', 'Report', null],
      default: null
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date,
      default: null
    },
    actionUrl: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
)

// ── Indexes ──────────────────────────────────────────────
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 })
notificationSchema.index({ user: 1, type: 1 })
notificationSchema.index({ createdAt: -1 })
// TTL index: auto-delete notifications older than 90 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })

// ── Static Methods ───────────────────────────────────────
notificationSchema.statics.markAllRead = async function (userId) {
  return this.updateMany(
    { user: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  )
}

notificationSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({ user: userId, isRead: false })
}

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification

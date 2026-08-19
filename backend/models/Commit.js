import mongoose from 'mongoose'

const commitSchema = new mongoose.Schema(
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
    sha: {
      type: String,
      required: [true, 'Commit SHA is required'],
      unique: true,
      trim: true,
      minlength: 7,
      maxlength: 40
    },
    message: {
      type: String,
      required: [true, 'Commit message is required'],
      trim: true
    },
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true
    },
    authorEmail: {
      type: String,
      default: null,
      lowercase: true,
      trim: true
    },
    authorLogin: {
      type: String,
      default: null,
      trim: true
    },
    authorAvatarUrl: {
      type: String,
      default: null
    },
    branch: {
      type: String,
      default: 'main'
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
    htmlUrl: {
      type: String,
      default: null
    },
    committedAt: {
      type: Date,
      required: [true, 'Commit timestamp is required']
    }
  },
  {
    timestamps: true
  }
)

// ── Indexes ──────────────────────────────────────────────
commitSchema.index({ sha: 1 }, { unique: true })
commitSchema.index({ repository: 1, committedAt: -1 })
commitSchema.index({ user: 1, committedAt: -1 })
commitSchema.index({ authorLogin: 1 })
commitSchema.index({ branch: 1 })
commitSchema.index({ committedAt: -1 })

const Commit = mongoose.model('Commit', commitSchema)
export default Commit

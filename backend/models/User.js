import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['Developer', 'Architect', 'Admin', 'Viewer'],
      default: 'Developer'
    },
    avatar: {
      type: String,
      default: null
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLoginAt: {
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
userSchema.index({ role: 1 })
userSchema.index({ authProvider: 1 })
userSchema.index({ createdAt: -1 })

// ── Virtuals ─────────────────────────────────────────────
userSchema.virtual('githubAccounts', {
  ref: 'GitHubAccount',
  localField: '_id',
  foreignField: 'user'
})

userSchema.virtual('notifications', {
  ref: 'Notification',
  localField: '_id',
  foreignField: 'user'
})

userSchema.virtual('aiHistory', {
  ref: 'AIHistory',
  localField: '_id',
  foreignField: 'user'
})

// ── Middleware ────────────────────────────────────────────
// Encrypt password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// ── Instance Methods ─────────────────────────────────────
// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User

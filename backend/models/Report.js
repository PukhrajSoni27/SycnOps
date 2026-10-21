import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reportType: {
      type: String,
      enum: ['weekly', 'monthly', 'health', 'analytics', 'custom'],
      default: 'weekly'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    summary: {
      type: String,
      default: ''
    },
    metrics: {
      type: Object,
      default: {}
    },
    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

const Report = mongoose.model('Report', reportSchema)
export default Report

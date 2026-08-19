import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI
    if (!connStr) {
      console.warn('⚠️ MONGO_URI is missing from environment variables. Running with in-memory auth fallback.')
      return
    }

    const conn = await mongoose.connect(connStr)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}. Continuing server startup with local fallback support.`)
  }
}

export default connectDB

import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_sycnops_jwt_key_2026_secure', {
    expiresIn: '30d'
  })
}

// @route   POST /api/auth/register
// @desc    Register a new user in MongoDB
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' })
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() })
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address.' })
    }

    // Create user in database
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'Developer'
    })

    if (user) {
      const token = generateToken(user._id)
      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      })
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user data provided.' })
    }
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Server error during registration' })
  }
})

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' })
    }

    // Find user by email in MongoDB
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' })
    }

    // If name missing or generic placeholder, derive from email prefix
    if (!user.name || user.name.trim().toUpperCase() === 'JOHN DOE') {
      const derived = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim()
      user.name = derived || email.split('@')[0]
      await user.save()
    }

    // Verify password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' })
    }

    const token = generateToken(user._id)
    return res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Server error during authentication' })
  }
})

// @route   POST /api/auth/social
// @desc    Authenticate/Register user via Google or GitHub OAuth
// @access  Public
router.post('/social', async (req, res) => {
  try {
    const { provider, name, email, avatar } = req.body

    if (!email || !provider) {
      return res.status(400).json({ success: false, message: 'Provider and email are required.' })
    }

    const formatNameFromEmail = (emailStr) => {
      const prefix = emailStr.split('@')[0]
      const words = prefix.replace(/[^a-zA-Z]/g, ' ').split(' ').filter(Boolean)
      if (words.length === 0) return prefix
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    }

    const resolvedName = name && name.trim() ? name.trim() : formatNameFromEmail(email)
    let user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      user = await User.create({
        name: resolvedName,
        email: email.toLowerCase(),
        password: `social_oauth_${provider}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        role: 'Developer'
      })
    } else {
      // Sync real profile name if updated from Google/GitHub or if placeholder
      const upper = (user.name || '').toUpperCase()
      if (name && name.trim() && user.name !== name.trim()) {
        user.name = name.trim()
        await user.save()
      } else if (!user.name || upper.includes('JOHN DOE') || upper.includes('DEVELOPER') || upper.includes('ARCHITECT')) {
        user.name = resolvedName
        await user.save()
      }
    }

    const token = generateToken(user._id)
    return res.json({
      success: true,
      message: `Authenticated successfully with ${provider}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: avatar || null,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Social auth error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Social authentication failed' })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user profile from MongoDB
// @access  Private
router.get('/me', async (req, res) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_sycnops_jwt_key_2026_secure')
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' })
    }

    return res.json({ success: true, user })
  } catch (error) {
    console.error('Fetch profile error:', error)
    return res.status(401).json({ success: false, message: 'Token invalid or expired' })
  }
})

// @route   PUT /api/auth/me
// @desc    Update current user's profile (name)
// @access  Private
router.put('/me', async (req, res) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_sycnops_jwt_key_2026_secure')
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const { name } = req.body
    if (name && name.trim()) {
      user.name = name.trim()
      await user.save()
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Failed to update profile' })
  }
})

export default router

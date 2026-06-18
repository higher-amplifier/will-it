const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authMiddleware = require('../middleware/auth')

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already registered' })

    const user = await User.create({ name, email, password })
    const token = signToken(user._id)
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' })

    const token = signToken(user._id)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, checkinInterval: user.checkinInterval, lastCheckin: user.lastCheckin } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

router.patch('/settings', authMiddleware, async (req, res) => {
  try {
    const { checkinInterval } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { checkinInterval },
      { new: true }
    ).select('-password')
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

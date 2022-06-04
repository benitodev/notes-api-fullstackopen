import { Router } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).json({ content: users })
  } catch (err) {
    res.status(500).json({ error: 'not found' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId).populate('notes', { content: 1, date: 1, important: 1 })
    res.status(200).json({ content: user })
  } catch (err) {
    res.status(500).json({ error: 'not found' })
  }
})
router.post('/', async (req, res) => {
  try {
    const { name, username, password } = req.body
    if (!(name || username || password)) return res.status(400).json({ error: 'missing data' })
    const existingUser = await User.findOne({ username })
    if (existingUser) return res.status(400).json({ error: 'username must be unique' })
    const hashSaltRounds = 10
    const passwordHash = await bcrypt.hash(password, hashSaltRounds)

    const user = await new User({
      name,
      username,
      passwordHash
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
  } catch (err) {
    res.status(500).json({ error: 'not found' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    if (!req.params) { return res.status(400).json({ error: 'no params' }) }
    const userId = req.params.id
    await User.findByIdAndDelete(userId)
    res.status(200).json({ mesagge: 'user was deleted' })
  } catch (err) {
    res.status(500).json({ error: 'not found' })
  }
})
export default router

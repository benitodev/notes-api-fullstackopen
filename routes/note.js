import { Router } from 'express'
import Note from '../models/Note.js'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
const router = Router()

const getTokenFrom = (req) => {
  const authorization = req.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({}).populate('user', { username: 1, name: 1 })

    res.status(200).json({ content: notes })
  } catch (err) {
    res.status(500).json({ error: 'not found' })
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const noteId = req.params.id

    const note = await Note.findById(noteId)
    if (!note) return res.status(404).json({ error: "note doesn't exist" })
    res.status(201).json({ content: note })
  } catch (err) {
    next(err)
  }
})
router.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.content) return res.status(400).json({ error: 'no body content' })

    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) { return res.status(401).json({ error: 'token missing or invalid' }) }

    const user = await User.findById(decodedToken.id)
    const note = new Note({
      content: body.content,
      important: body.important,
      date: new Date(),
      user: user._id
    })

    const savedNote = await note.save()
    console.log('before savedNote')
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    res.status(201).json({ content: savedNote, message: 'note created' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'not found' })
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const noteId = req.params.id
    const noteToDelete = await Note.findByIdAndDelete(noteId)
    console.log(noteToDelete)
    if (!noteToDelete) return res.status(404).json({ error: "note doesn't exist" })
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById({ _id: decodedToken.id })
    console.log(noteId)
    // eslint-disable-next-line eqeqeq
    const itemToRemove = user.notes.find(note => note == noteId)
    console.log(itemToRemove, 'item to remove')
    if (itemToRemove) {
      user.notes.pull(itemToRemove)
      await user.save()
    }
    if (!decodedToken.id) { return res.status(401).json({ error: 'token missing or invalid' }) }
    res.status(204).json({ message: 'successfully deleted' })
  } catch (err) {
    next(err)
  }
})
router.put('/:id', async (req, res, next) => {
  try {
    const noteId = req.params.id
    const { content, important } = req.body
    if (!(content || important)) return res.status(404).json({ error: 'no body content' })
    const note = { content, important: important || false }
    const noteToUpdate = await Note.findByIdAndUpdate(noteId, note, { new: true, runValidators: true, context: 'query' })
    res.status(200).json({ content: noteToUpdate })
  } catch (err) {
    next(err)
  }
})
export default router

import { Router } from 'express'
import Note from '../models/Note.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({})

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
    const note = new Note({
      content: body.content,
      important: body.important,
      date: new Date()
    })

    await note.save()

    res.status(201).json({ message: 'note created' })
  } catch (err) {
    res.status(500).json({ error: 'not found' })
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const noteId = req.params.id
    const noteToDelete = await Note.findByIdAndRemove(noteId)
    console.log(noteToDelete)
    if (!noteToDelete) return res.status(404).json({ error: "note doesn't exist" })
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

import mongoose from 'mongoose'
import server from '../index.js'
import { api, getAllContentFromNotes, initialNotes } from './helpers/notes.js'

import Note from '../models/Note.js'

beforeEach(async () => {
  await Note.deleteMany({})

  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('NOTES AT THE BEGINNING', () => {
  test('notes are returned as json', async () => {
    await api.get('/api/notes').expect(200).expect('Content-Type', /json/)
  })

  test('there are two notes', async () => {
    const { notes } = await getAllContentFromNotes()
    expect(notes).toHaveLength(initialNotes.length)
  })

  test('the first note is about HTML', async () => {
    const { contents } = await getAllContentFromNotes()
    expect(contents).toContain('HTML is easy')
  })
})

describe('GET ALL NOTES', () => {
  test('a valid note can be added', async () => {
    const newNOte = {
      content: 'New note is added',
      important: true
    }

    await api.post('/api/notes').send(newNOte).expect(201).expect('Content-Type', /json/)
    const { contents, notes } = await getAllContentFromNotes()
    expect(notes).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain('New note is added')
  })

  test('note without content is not added', async () => {
    const newNote = {
      important: true
    }

    await api.post('/api/notes').send(newNote).expect(400)
    const res = await api.get('/api/notes')
    const { content } = res.body
    expect(content).toHaveLength(initialNotes.length)
  })
})

describe('GET A SPECIFIC NOTE', () => {
  test('a specific note can be viewed', async () => {
    const { notes } = await getAllContentFromNotes()
    const noteToView = notes[0]
    const getNoteToView = await api.get(`/api/notes/${noteToView.id}`).expect(201).expect('Content-Type', /json/)
    const copyNoteToView = JSON.parse(JSON.stringify(noteToView))
    expect(getNoteToView.body.content).toEqual(copyNoteToView)
  })
})

describe('DELETE NOTE', () => {
  test('note can be deleted', async () => {
    const { notes: notesAtFirst } = await getAllContentFromNotes()
    expect(notesAtFirst).toHaveLength(initialNotes.length)
    const noteToDelete = notesAtFirst[0]
    await api.delete(`/api/notes/${noteToDelete.id}`)
    const { notes: notesAtEnd, contents: contentsAtEnd } = await getAllContentFromNotes()
    expect(notesAtEnd).toHaveLength(initialNotes.length - 1)

    expect(contentsAtEnd).not.toContain(noteToDelete.content)
  })
})
afterAll(() => {
  mongoose.connection.close()
  server.close()
})

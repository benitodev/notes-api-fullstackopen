import app from '../../app.js'
import supertest from 'supertest'

export const api = supertest(app)

export const initialNotes = [{
  content: 'HTML is easy',
  date: new Date(),
  important: false
},
{
  content: 'Browser can execute only javascript',
  date: new Date(),
  important: true
}]

export const getAllContentFromNotes = async () => {
  const res = await api.get('/api/notes')
  const notes = res.body.content
  return {
    contents: notes.map(note => note.content),
    notes
  }
}

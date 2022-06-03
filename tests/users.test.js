import mongoose from 'mongoose'
import server from '../index.js'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import api, { getAllContentFromUsers } from './helpers/users.js'

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash, name: 'root' })
  await user.save()
})
describe('ONE USER AT THE BEGINNING', () => {
  test('get the first user', async () => {
    const { users } = await getAllContentFromUsers()
    expect(users).toHaveLength(1)
  })
})

describe('POST USER', () => {
  test('create user fails if username already taken', async () => {
    const { users: usersAtStart } = await getAllContentFromUsers()
    const newUser = { username: 'root', password: '321', name: 'root' }

    const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /json/)

    expect(result.body.error).toContain('username must be unique')
    const { users: usersAtEnd } = await getAllContentFromUsers()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
  test('add user with valid data', async () => {
    const { users: usersAtStart } = await getAllContentFromUsers()
    const newUser = {
      username: 'newUser',
      name: 'user',
      password: '123'
    }

    await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /json/)

    const { users: usersAtEnd, usernames } = await getAllContentFromUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})

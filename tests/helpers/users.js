import app from '../../app.js'
import supertest from 'supertest'

const api = supertest(app)

export const getAllContentFromUsers = async () => {
  const res = await api.get('/api/users')
  const users = res.body.content

  return {
    usernames: users.map(user => user.username),
    users
  }
}

export default api

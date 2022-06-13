import express from 'express'
import noteRoutes from './routes/note.js'
import userRoutes from './routes/user.js'
import loginRoute from './routes/login.js'
import testingRoute from './routes/testing.js'
import cors from 'cors'
import errorHandler from './middleware/errorHandler.js'
const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/notes', noteRoutes)
app.use('/api/users', userRoutes)
app.use('/api/login', loginRoute)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRoute)
}
app.use(errorHandler)
export default app

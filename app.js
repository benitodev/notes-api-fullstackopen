import express from 'express'
import noteRoutes from './routes/note.js'
import userRoutes from './routes/user.js'
import loginRoute from './routes/login.js'
import cors from 'cors'
import errorHandler from './middleware/errorHandler.js'
const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/notes', noteRoutes)
app.use('/api/users', userRoutes)
app.use('/api/login', loginRoute)
app.use(errorHandler)
export default app

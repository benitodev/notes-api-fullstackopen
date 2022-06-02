import express from 'express'
import noteRoutes from './routes/note.js'
import cors from 'cors'
import errorHandler from './middleware/errorHandler.js'
const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/notes', noteRoutes)
app.use(errorHandler)
export default app

import { connectDB } from './database/db.js'
import { PORT } from './config.js'
import app from './app.js'

connectDB()

const server = app.listen(PORT, async () => {
  console.log('Server running on port ' + PORT)
})
export default server

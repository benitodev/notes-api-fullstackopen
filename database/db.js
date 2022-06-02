import mongoose from 'mongoose'
import { DB_URI } from '../config.js'

export const connectDB = async () => {
  try {
    const db = await mongoose.connect(DB_URI, {
      useNewUrlParser: true
    })
    console.log('connect to', db.connection.name)
  } catch (err) {
    console.log(err)
  }
}

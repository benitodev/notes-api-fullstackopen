import dotenv from 'dotenv'
dotenv.config()

export const DB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_URL : process.env.URL

export const PORT = process.env.PORT || 3001

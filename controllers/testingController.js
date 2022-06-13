import Note from '../models/Note.js'
import User from '../models/User.js'

export const Reset = async (req, res) => {
  try {
    await Note.deleteMany({})
    await User.deleteMany({})

    res.status(204).end()
  } catch (err) {
    console.log(err, 'errorrrrr')
  }
}

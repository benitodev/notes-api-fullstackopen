import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/User.js'

export const Login = async (req, res, next) => {
  try {
    const { username: usernameOfBody, password } = req.body
    const user = await User.findOne({ usernameOfBody })
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return res.status(401).json({ error: 'invalid username or password' })
    }
    const { username, name, _id: id } = user
    const userForToken = {
      username,
      id
    }

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 120 * 120 })

    res.status(200).json({ token, username, name })
  } catch (err) {
    next(err)
  }
}

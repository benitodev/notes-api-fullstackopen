import { Router } from 'express'
import { Login } from '../controllers/loginController.js'
const router = Router()

router.post('/', Login)

export default router

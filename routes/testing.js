import { Router } from 'express'
import { Reset } from '../controllers/testingController.js'
const router = Router()

router.post('/reset', Reset)

export default router

import { Router } from 'express'

import userController from './controllers/UserController'
import authController from './controllers/AuthController'

const router = Router()

router.post('/register', userController.create)
router.post('/login', authController.login)

export default router
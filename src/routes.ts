import { Router } from 'express'

import userController from './controllers/UserController'
import authController from './controllers/AuthController'
import { authenticate } from './middlewares/authenticate'

const router = Router()

router.post('/register', userController.create)
router.post('/login', authController.login)

router.use(authenticate)

export default router
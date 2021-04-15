import { Router } from 'express'

import userController from './controllers/UserController'
import authController from './controllers/AuthController'
import postController from './controllers/PostController'
import { authenticate } from './middlewares/authenticate'

const router = Router()

router.post('/register', userController.create)
router.post('/login', authController.login)

router.use(authenticate)

router.get('/refresh-token', authController.refreshToken)

router.get('/post/:postId', postController.show)
router.post('/post', postController.create)
router.delete('/post/:postId', postController.delete)

export default router
import { Router } from 'express'

import userController from './controllers/UserController'
import authController from './controllers/AuthController'
import postController from './controllers/PostController'
import followController from './controllers/FollowController'
import likeController from './controllers/LikeController'
import { authenticate } from './middlewares/authenticate'

const router = Router()

router.post('/register', userController.create)
router.post('/login', authController.login)
// só se o token estiver inválido que deverá ser feito o refresh do token
router.get('/refresh-token', authController.refreshToken)

router.use(authenticate)

router.get('/post/:postId', postController.show)
router.post('/post', postController.create)
router.delete('/post/:postId', postController.delete)
router.put('/post/:postId', postController.update)

router.post('/follow/:id', followController.follow)
router.post('/unfollow/:id', followController.unfollow)
router.get('/followers', followController.listFollowers)
router.get('/following', followController.listFollowing)

router.post('/like/:id', likeController.like)
router.post('/unlike/:id', likeController.unlike)

export default router
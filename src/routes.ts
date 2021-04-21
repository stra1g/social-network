import { Router } from 'express'

import userController from './controllers/UserController'
import authController from './controllers/AuthController'
import postController from './controllers/PostController'
import followController from './controllers/FollowController'
import likeController from './controllers/LikeController'
import commentController from './controllers/CommentController'
import { authenticate } from './middlewares/authenticate'

const router = Router()

router.post('/register', userController.create)
router.post('/login', authController.login)

router.get('/refresh-token', authController.refreshToken)

router.use(authenticate)

router.post('/logout', authController.logout)

router.get('/post/:postId', postController.show)
router.get('/posts', postController.list)
router.post('/post', postController.create)
router.delete('/post/:postId', postController.delete)
router.put('/post/:postId', postController.update)

router.post('/follow/:id', followController.follow)
router.post('/unfollow/:id', followController.unfollow)
router.get('/followers', followController.listFollowers)
router.get('/following', followController.listFollowing)

router.post('/like-post/:id', likeController.likePost)
router.post('/unlike-post/:id', likeController.unlikePost)
router.get('/likedPosts', likeController.listLikedPosts)

router.post('/comment', commentController.comment)
router.post('/reply-comment', commentController.reply)
router.post('/like-comment/:id', likeController.likeComment)
router.post('/unlike-comment/:id', likeController.unlikeComment)

export default router
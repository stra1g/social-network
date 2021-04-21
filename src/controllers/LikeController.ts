import { Request, Response } from 'express'

import knex from '../database/connection'

class LikeController {
  async likePost(request: Request, response: Response){
    const userId = request.userId
    const { id } = request.params

    const postExists = await knex.select('*').from('posts').where({id}).first()

    if (!postExists){
      return response.status(400).json({errorMessage: 'Post does not exists'})
    }

    await knex('posts').update({
      likes_count: postExists.likes_count + 1
    }).where({
      id: postExists.id
    })
    await knex('likes_post').insert({
      user_id: userId,
      post_id: postExists.id
    })

    return response.status(200).json({message: 'Post liked'})
  }
  async unlikePost(request: Request, response: Response){
    const userId = request.userId
    const { id } = request.params

    const postIsLiked = await knex.select('id').from('likes_post')
      .where({
        user_id: userId
      }).andWhere({
        id
      })
    
      if (!postIsLiked){
        return response.status(400).json({errorMessage: 'Post is not liked'})
      }

      const post = await knex.select('likes_count').from('posts').where({id}).first()

      await knex('posts').update({
        likes_count: post.likes_count - 1
      }).where({
        id
      })
      await knex('likes_post').del().where({
        user_id: userId
      }).andWhere({
        post_id: id
      })

      return response.status(200).json({message: 'Post unliked'})
  }

  async listLikedPosts(request: Request, response: Response){
    const userId = request.userId

    const likedPosts = await knex.select('users.name', 'users.username', 'posts.description', 'posts.likes_count')
      .from('likes_post')
      .where('likes_post.user_id', String(userId))
      .join('posts', 'posts.id', '=', 'likes_post.post_id')
      .join('users', 'users.id', '=', 'posts.user_id')

    return response.status(200).json(likedPosts)
  }

  async likeComment(request: Request, response: Response){
    const { userId, params: { id }} = request
    
    const commentExists = await knex.select('id', 'likes_count').from('comments').where({id}).first()

    if (!commentExists){
      return response.status(400).json({errorMessage: 'Comment does not exists'})
    }

    await knex('comments').update({
      likes_count: commentExists.likes_count + 1
    }).where({
      id: commentExists.id
    })
    await knex('likes_comments').insert({
      user_id: userId,
      comment_id: commentExists.id
    })
    
    return response.status(200).json({message: 'Post liked'})
  }

  async unlikeComment(request: Request, response: Response){
    const { userId, params: { id }} = request

    const commentIsLiked = await knex.select('id').from('likes_comments')
      .where({
        user_id: userId
      }).andWhere({
        comment_id: id
      })

    if (!commentIsLiked){
      return response.status(400).json({errorMessage: 'Comment is not liked'})
    }

    const comment = await knex.select('likes_count').from('comments').where({id}).first()

    await knex('comments').update({
      likes_count: comment.likes_count - 1
    }).where({
      id
    })
    await knex('likes_comments').del().where({
      user_id: userId
    }).andWhere({
      comment_id: id
    })

    return response.status(200).json({message: 'Comment unliked'})
  }
}

export default new LikeController
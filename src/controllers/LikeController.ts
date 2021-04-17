import { Request, Response } from 'express'

import knex from '../database/connection'
import cookies from '../utils/cookies'

class LikeController {
  async like(request: Request, response: Response){
    const userId = cookies.get(request.headers.cookie, 'c_usr')
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
  async unlike(request: Request, response: Response){
    const userId = cookies.get(request.headers.cookie, 'c_usr')
    const { id } = request.params

    const postIsLiked = await knex.select('*').from('likes_post')
      .where({
        user_id: userId
      }).andWhere({
        id
      })
    
      if (!postIsLiked){
        return response.status(400).json({errorMessage: 'Post is not liked'})
      }

      const post = await knex.select('*').from('posts').where({id}).first()

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
  // name - username - description - likes_count
  async listLikedPosts(request: Request, response: Response){
    const userId = cookies.get(request.headers.cookie, 'c_usr')

    const likedPosts = await knex.select('users.name', 'users.username', 'posts.description', 'posts.likes_count')
      .from('likes_post')
      .where('likes_post.user_id', userId)
      .join('posts', 'posts.id', '=', 'likes_post.post_id')
      .join('users', 'users.id', '=', 'posts.user_id')

    return response.status(200).json(likedPosts)
  }
}

export default new LikeController
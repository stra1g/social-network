import { Request, Response } from 'express'

import knex from '../database/connection'

class CommentController {
  async comment(request: Request, response: Response){
    const { userId, body: { comment }, params: { postId } } = request
    
    const postExists = await knex.select('*').from('posts').where({id: postId})

    if (!postExists){
      return response.status(400).json({errorMessage: 'Post does not exists'})
    }

    await knex('comments').insert({
      comment,
      user_id: userId,
      post_id: postId
    })

    return response.status(200).json({message: 'comment created'})
  }

  async reply(request: Request, response: Response){
    const { userId, body: { comment }, params: { postId, commentId } } = request
    
    const postExists = await knex.select('*').from('posts').where({id: postId})

    if (!postExists){
      return response.status(400).json({errorMessage: 'Post does not exists'})
    }

    await knex('comments').insert({
      comment,
      user_id: userId,
      post_id: postId,
      comment_reply: commentId
    })

    return response.status(200).json({message: 'reply created'})
  }
}

export default new CommentController
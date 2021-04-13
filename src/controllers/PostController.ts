import { Request, Response } from 'express'

import knex from '../database/connection'

class PostController {
  async create(request: Request, response: Response){
    const { description } = request.body
    const userId = request.params.id

    const userExists = await knex.select('*').from('users').where({id: userId})

    if (!userExists){
      return response.status(401).json({errorMessage: 'you should be logged in to create a post'})
    }

    await knex('posts').insert({
      description,
      user_id: userId
    })

    return response.status(201).json({message: 'post created'})
  }

  async show(request: Request, response: Response){
    const { id } = request.params

    const postExists = await knex.select('*').from('posts').where({id}).first()

    if (!postExists){
      return response.status(400).json({errorMessage: 'This post does not exists'})
    }
    return response.status(200).json(postExists)
  }

  async delete(request: Request, response: Response){
    const { postId, userId } = request.params

    const postExists = await knex.select('*').from('posts').where({id: postId}).first()

    if (!postExists){
      return response.status(400).json({errorMessage: 'This post does not exists'})
    }

    await knex('posts').del().where({id: postId}).andWhere({user_id: userId})

    return response.status(200).json({message: 'post deleted'})
  }
}

export default new PostController
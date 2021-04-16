import { Request, Response } from 'express'

import knex from '../database/connection'
import cookies from '../utils/cookies'

class PostController {
  async create(request: Request, response: Response){
    const { description } = request.body
    const userId = cookies.get(request.headers.cookie, 'c_usr')

    const userExists = await knex.select('*').from('users').where({id: userId}).first()

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
    const { postId } = request.params

    const postExists = await knex.select('*').from('posts').where({id: postId}).first()

    if (!postExists){
      return response.status(400).json({errorMessage: 'This post does not exists'})
    }
    return response.status(200).json(postExists)
  }

  async delete(request: Request, response: Response){
    const userId = cookies.get(request.headers.cookie, 'c_usr')

    const { postId } = request.params

    const postExists = await knex.select('*').from('posts').where({id: postId}).first()

    if (!postExists){
      return response.status(400).json({errorMessage: 'This post does not exists'})
    }

    await knex('posts').del().where({id: postId}).andWhere({user_id: userId})

    return response.status(200).json({message: 'post deleted'})
  }

  async update(request: Request, response: Response){
    const userId = cookies.get(request.headers.cookie, 'c_usr')
    const { description } = request.body
    const { postId } = request.params

    const postExists = await knex.select('*').from('posts').where({id: postId}).first()

    if (!postExists){
      return response.status(400).json({errorMessage: 'This post does not exists'})
    }

    await knex('posts').update({description: String(description)}).where({id: postId}).andWhere({user_id: userId})

    return response.status(200).json({message: 'post updated'})
  }
}

export default new PostController
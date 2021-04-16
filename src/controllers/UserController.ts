import { Request, Response } from 'express'

import knex from '../database/connection'
import { userSchema } from '../utils/schemaValidation'
import { makeHash } from '../utils/hash'
import cookies from '../utils/cookies'

class UserController {
  async create(request: Request, response: Response){
    const { name, username, email, password, biography } = request.body

    const isValid = await userSchema.isValid({name, username, email, password, biography})

    if (!isValid){
      return response.status(400).json({errorMessage: 'Invalid data provided'})
    }

    const userAlreadyExists = await knex.select('id').from('users').where({email}).orWhere({username}).first()

    if (userAlreadyExists){
      return response.status(409).json({errorMessage: 'User already exists'})
    }

    const hashedPassword = await makeHash(password)

    await knex('users').insert({
      name, 
      username, 
      email,
      password: hashedPassword,
      biography
    })

    return response.status(201).json({message: 'user created'})
  }
  async follow(request: Request, response: Response){
    const userId = cookies.get(request.headers.cookie, 'c_usr')
    const followedUserId = request.params.id
    
    const userExists = await knex.select('*').from('users').where({id: userId}).first()

    if (!userExists){
      return response.status(400).json({errorMessage: 'This user does not exists'})
    }

    const followedUserExists = await knex.select('*').from('users').where({id: followedUserId}).first()

    if (!followedUserExists){
      return response.status(400).json({errorMessage: 'User not found'})
    }

    if (userExists.id === followedUserExists.id){
      return response.status(400).json({errorMessage: 'You can not follow yourself'})
    }

    await knex('users').update({
      following_count: userExists.following_count + 1
    }).where({id: userExists.id})
    await knex('users').update({
      followers_count: followedUserExists.followers_count + 1
    }).where({id: followedUserExists.id})
    await knex('follow_users').insert({
      user_id: userExists.id,
      followed_user: followedUserExists.id
    })

    return response.status(200).json({message: 'User was followed'})
  }
}

export default new UserController
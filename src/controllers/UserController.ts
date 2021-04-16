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
}

export default new UserController
import { Request, Response } from 'express'

import knex from '../database/connection'
import { compareHash } from '../utils/hash'
import { AccessToken } from '../auth/classes/AccessToken'

class AuthController {
  async login(request: Request, response: Response){
    const { email, password } = request.body

    const userExists = await knex.select('*').from('users').where({email}).first()

    if (!userExists){
      return response.status(400).json({errorMessage: 'User not found'})
    }

    const passwordMatch = await compareHash(password, userExists.password)

    if (!passwordMatch){
      return response.status(400).json({errorMessage: 'User not found'})
    }

    const _accessToken = new AccessToken(userExists.id)
    const accessToken = await _accessToken.generate()
    
    response.cookie('access_token', String(accessToken), {path: '/', httpOnly: true})
    response.cookie('c_usr', String(userExists.id))
    return response.status(200).json({accessToken})
  }
}

export default new AuthController
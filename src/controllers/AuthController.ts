import { Request, Response } from 'express'

import knex from '../database/connection'
import { compareHash } from '../utils/hash'
import { TOKEN_EXPIRATION_TIME } from '../auth/confs'
import { generateToken } from '../auth'

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

    const jwtPayload = {
      iss: 'social_network_api',
      sub: userExists.id,
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_TIME
    }

    const token = await generateToken(jwtPayload)
    
    response.cookie('t_usr', String(token), {path: '/', httpOnly: true})
    response.cookie('c_usr', String(userExists.id))
    return response.status(200).json({token})
  }
}

export default new AuthController
import { Request, Response } from 'express'

import knex from '../database/connection'
import { compareHash } from '../utils/hash'
import { AccessToken } from '../auth/classes/AccessToken'
import { RefreshToken } from '../auth/classes/RefreshToken'
import { getAuthTokens } from '../auth'
import cookies from '../utils/cookies'

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

    const { accessToken, newRefreshToken } = await getAuthTokens(userExists.id)
    
    response.cookie('access_token', String(accessToken), {path: '/', httpOnly: true})
    response.cookie('refresh_token', String(newRefreshToken), {path: '/', httpOnly: true})
    response.cookie('c_usr', String(userExists.id))
    return response.status(200).json({accessToken, newRefreshToken})
  }

  async refreshToken(request: Request, response: Response){
    const refreshToken = cookies.get(request.headers.cookie, 'refresh_token')
    if (!refreshToken) return response.status(401).json({errorMessage: 'Invalid token provided'})

    const { sub } = await RefreshToken.compare(refreshToken)

    const { accessToken, newRefreshToken } = await getAuthTokens(sub)

    response.cookie('access_token', String(accessToken), {path: '/', httpOnly: true})
    response.cookie('refresh_token', String(newRefreshToken), {path: '/', httpOnly: true})

    return response.status(200).json({accessToken, newRefreshToken})
  }
}

export default new AuthController
import { Request, Response } from 'express'

import knex from '../database/connection'
import { compareHash } from '../utils/hash'
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

    const { newAccessToken, newRefreshToken } = await getAuthTokens(userExists.id)
    
    response.cookie('access_token', String(newAccessToken), {path: '/', httpOnly: true})
    response.cookie('refresh_token', String(newRefreshToken), {path: '/', httpOnly: true})
    response.cookie('c_usr', String(userExists.id))
    return response.status(200).json({newAccessToken, newRefreshToken})
  }

  async refreshToken(request: Request, response: Response){
    const refreshToken = cookies.get(request.headers.cookie, 'refresh_token') || request.headers['x-refresh-token']
    const accessToken = cookies.get(request.headers.cookie, 'access_token') || request.headers.authorization
    if (!refreshToken || !accessToken) return response.status(401).json({errorMessage: 'Invalid token provided'})

    try {
      const { sub } = await RefreshToken.compare(refreshToken)

      const { newAccessToken, newRefreshToken } = await getAuthTokens(sub)
  
      response.cookie('access_token', String(newAccessToken), {path: '/', httpOnly: true})
      response.cookie('refresh_token', String(newRefreshToken), {path: '/', httpOnly: true})
  
      return response.status(200).json({accessToken, newRefreshToken})
    } catch(error){
      return response.status(401).json({errorMessage: 'Invalid token provided'})
    }    
  }
}

export default new AuthController
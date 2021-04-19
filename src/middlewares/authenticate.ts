import { Request, Response, NextFunction } from 'express'

import cookies from '../utils/cookies'
import { AccessToken } from '../auth/classes/AccessToken'
import cache from '../services/redis'
import { BLACKLIST_REFRESH_TOKEN_PREFIX, BLACKLIST_TOKEN_PREFIX, PREFIX_CACHE } from '../auth/confs'

const authenticate = async (request: Request, response: Response, next: NextFunction) => {

  const accessToken = cookies.get(request.headers.cookie, 'access_token') || request.headers.authorization
  const refreshToken = cookies.get(request.headers.cookie, 'refresh_token') || request.headers['x-refresh-token'] 
  const userId = cookies.get(request.headers.cookie, 'c_usr')
  if (!refreshToken || !accessToken) return response.status(401).json({errorMessage: 'Invalid token provided'})

  const accessTokenExists = await cache.get(`${BLACKLIST_TOKEN_PREFIX}${accessToken}`)
  const refreshTokenExists = await cache.get(`${BLACKLIST_REFRESH_TOKEN_PREFIX}${refreshToken}`)

  if (accessTokenExists || refreshTokenExists){
    await cache.get(`${PREFIX_CACHE}${userId}`)

    return response.status(401).json({errorMessage: 'Invalid token provided'})
  }
  
  try {
    const { sub } = await AccessToken.compare(accessToken)
    request.userId = sub
    request.accessToken = accessToken
    request.refreshToken = refreshToken
    next()
  } catch(error){ 
    return response.status(401).json({errorMessage: 'Invalid token provided'})
  }
}

export {
  authenticate
}
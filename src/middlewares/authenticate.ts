import { Request, Response, NextFunction } from 'express'

import cookies from '../utils/cookies'
import { AccessToken } from '../auth/classes/AccessToken'

const authenticate = async (request: Request, response: Response, next: NextFunction) => {

  const accessToken = cookies.get(request.headers.cookie, 'access_token') || request.headers.authorization
  const refreshToken = cookies.get(request.headers.cookie, 'refresh_token') || request.headers['x-refresh-token']
  if (!refreshToken || !accessToken) return response.status(401).json({errorMessage: 'Invalid token provided'})
  
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
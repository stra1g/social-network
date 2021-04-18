import { Request, Response, NextFunction } from 'express'

import cookies from '../utils/cookies'
import { AccessToken } from '../auth/classes/AccessToken'

const authenticate = async (request: Request, response: Response, next: NextFunction) => {

  const authHeader = request.headers.authorization
  const authCookie = cookies.get(request.headers.cookie, 'access_token')
  let token = null

  if (authHeader){
    token = authHeader.split(' ')[1]
  } else if (authCookie){
    token = authCookie
  } else {
    return response.status(401).json({errorMessage: 'Invalid token provided'})
  }
  
  try {
    const { sub } = await AccessToken.compare(token)
    request.userId = sub
    next()
  } catch(error){ 
    return response.status(401).json({errorMessage: 'Invalid token provided'})
  }
}

export {
  authenticate
}
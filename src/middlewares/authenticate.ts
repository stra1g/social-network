import { Request, Response, NextFunction } from 'express'

import cookies from '../utils/cookies'
import { compareToken } from '../auth'

const authenticate = async (request: Request, response: Response, next: NextFunction) => {

  const authHeader = request.headers.authorization
  const authCookie = cookies.get(request.headers.cookie, 't_usr')
  let token = null

  if (authHeader){
    token = authHeader.split(' ')[1]
  } else if (authCookie){
    token = authCookie
  } else {
    return response.status(401).json({errorMessage: 'Invalid token provided'})
  }
  
  const tokenIsValid = await compareToken(token)

  if (!tokenIsValid){
    return response.status(401).json({errorMessage: 'Invalid token provided'})
  }

  next()
}

export {
  authenticate
}
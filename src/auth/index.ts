import jwt from 'jsonwebtoken'

import { ALGORITHM } from './confs'

interface JWTData {
  iss: string,
  sub: Number,
  exp: Number
}

const generateToken = (payload: JWTData) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {algorithm: ALGORITHM}, function(err, token){
      if (err){
        reject(err)
      }
      resolve(token)
    })
  })
}

export {
  generateToken
}
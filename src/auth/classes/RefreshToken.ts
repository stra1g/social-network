import jwt from 'jsonwebtoken'

import { Token } from './Token'
import { ALGORITHM, REFRESH_TOKEN_EXPIRATION_TIME, JWTData } from '../confs'

class RefreshToken extends Token {
  payload: JWTData
  
  constructor(sub: Number){
    super(sub)
    this.payload = {
      iss: this.iss,
      sub,
      exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRATION_TIME
    }
  }

  generate():Promise<unknown> {
    return new Promise((resolve, reject) => {
      jwt.sign(this.payload, process.env.REFRESH_TOKEN_SECRET_KEY as jwt.Secret, {algorithm: ALGORITHM}, function(err, token){
        if (err){
          reject(err)
        }
        resolve(token)
      })
    })
  }

  static compare(token: string):Promise<unknown>{
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY as jwt.Secret, function(err, decoded){
        if (err){
          reject(err)
        }
        resolve(decoded)
      })
    })
  }
}

export {
  RefreshToken
}
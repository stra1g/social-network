export const TOKEN_EXPIRATION_TIME = 300 // 5 minutes
export const REFRESH_TOKEN_EXPIRATION_TIME = 86400 // 1 day
export const ALGORITHM = 'HS256'
export interface JWTData {
  iss: string,
  sub: Number,
  exp: Number
}
declare namespace Express {
  export interface Request {
     userId?: Number
     accessToken?: string,
     refreshToken: string
  }
}
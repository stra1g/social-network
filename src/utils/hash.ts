import bcrypt from 'bcryptjs'

const makeHash = (value:string) => bcrypt.hash(value, 10) 

const compareHash = (value: string, valueHashed: string) => bcrypt.compare(value, valueHashed)

export {
  makeHash,
  compareHash
}
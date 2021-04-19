import Redis from 'ioredis'

const redis = new Redis()

const cache = {
  set: (key: string, value: string, seconds?: number | undefined) => {
    if (seconds){
      return redis.set(key, value, 'EX', seconds)
    }
    return redis.set(key, value)
  },
  get: (key:string) => redis.get(key),
  del: (key:string) => redis.del(key)
}

export default cache
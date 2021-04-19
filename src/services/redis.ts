import Redis from 'ioredis'

const redis = new Redis()

const cache = {
  set: (key: string, value: string, seconds: number) => (
    redis.set(key, value, 'EX', seconds)
  ),
  get: (key:string) => redis.get(key),
  del: (key:string) => redis.del(key)
}

export default cache
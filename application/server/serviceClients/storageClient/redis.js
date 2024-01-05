const config = require('../../config');
const logger = require('../../infra/logger');
const { createClient } = require('redis')

const redisClient = createClient({
  url: config.RedisServer
})

const useRedis = config.Env !== 'dev' && config.Env !== 'mocked' && config.Env !== 'local'

if(useRedis){
  redisClient.connect().then(() => {
    logger.info('Redis connection established with server: ' + config.RedisServer)
  })
}

const localCache = {
  // TODO: expiry?
}
export class StorageClient {
  token;
  constructor(token){
    this.token = token;
  }

  async get(key){
    logger.debug(`Redis get: ${key}, ready: ${redisClient.isReady}`)
    if(useRedis && redisClient.isReady){
      const ret = await redisClient.get(key);
      return ret ? JSON.parse(ret) : null;
    }
    return Promise.resolve(localCache[key]);
  }
  set(key, obj){
    logger.debug(`Redis set: ${key}, ready: ${redisClient.isReady}`)
    if(useRedis && redisClient.isReady){
      return redisClient.set(key, JSON.stringify(obj), {EX: config.RedisCacheTimeSeconds})
    }
    return Promise.resolve(localCache[key] = obj)
  }
}
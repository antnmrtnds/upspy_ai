const IORedis = process.env.NODE_ENV === 'test' ? require('ioredis-mock') : require('ioredis');
const logger = require('../utils/logger');

const requiredEnvVars = ['REDIS_HOST', 'REDIS_PORT'];
if (process.env.NODE_ENV !== 'test') {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
};

if (process.env.REDIS_PASSWORD) {
  redisOptions.password = process.env.REDIS_PASSWORD;
}

const redis = new IORedis(redisOptions);

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (err) => logger.error('Redis connection error', { error: err }));
redis.on('reconnecting', () => logger.warn('Redis reconnecting'));
redis.on('end', () => logger.warn('Redis connection closed'));

const testConnection = async () => {
  try {
    await redis.ping();
    logger.info('Redis ping successful');
    return true;
  } catch (err) {
    logger.error('Redis ping failed', { error: err });
    return false;
  }
};

module.exports = {
  redis,
  testConnection,
};
const IORedis = process.env.NODE_ENV === 'test' ? require('ioredis-mock') : require('ioredis');
const logger = require('../utils/logger');

// Initialize Redis connection using a single REDIS_URL
let redis;
if (process.env.NODE_ENV === 'test') {
  // In tests, use the mock without any network config
  redis = new IORedis();
} else {
  // Prefer an explicitly set external URL to override platform-injected variables
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error('Missing required environment variable: REDIS_URL');
  }
  redis = new IORedis(url);
}

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
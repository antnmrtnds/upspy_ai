const { Queue, Worker} = require('bullmq');
const { redis } = require('../lib/redis');
const logger = require('../utils/logger');

const connection = redis;

const queueName = 'content-collection';

const queue = new Queue(queueName, { connection: {
  url: process.env.REDIS_URL,
  maxRetriesPerRequest: null,
}});

let worker;
if (process.env.NODE_ENV !== 'test') {
  worker = new Worker(
    queueName,
    async job => {
      logger.info('Processing content collection job', { jobId: job.id });
      return { success: true };
    },
    {
      connection: {
        url: process.env.REDIS_URL,
        maxRetriesPerRequest: null,
      }
    }
  );

  worker.on('completed', job => logger.info('contentCollection job completed', { jobId: job.id }));
  worker.on('failed', (job, err) => logger.error('contentCollection job failed', { jobId: job?.id, error: err }));
  worker.on('stalled', jobId => logger.warn('contentCollection job stalled', { jobId }));
}

const shutdown = async () => {
  if (worker) {
    await worker.close();
  }
  await queue.close();
};

module.exports = {
  queue,
  worker,
  shutdown,
};
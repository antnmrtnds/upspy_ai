const { Queue, Worker} = require('bullmq');
const { redis } = require('../lib/redis');
const logger = require('../utils/logger');

const connection = redis;

const queueName = 'notifications';

const queue = new Queue(queueName, { connection });

let worker;
if (process.env.NODE_ENV !== 'test') {
  worker = new Worker(
    queueName,
    async job => {
      logger.info('Processing notification job', { jobId: job.id });
      return { success: true };
    },
    { connection }
  );

  worker.on('completed', job => logger.info('notification job completed', { jobId: job.id }));
  worker.on('failed', (job, err) => logger.error('notification job failed', { jobId: job?.id, error: err }));
  worker.on('stalled', jobId => logger.warn('notification job stalled', { jobId }));
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
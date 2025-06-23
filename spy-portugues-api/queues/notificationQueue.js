const { Queue, Worker} = require('bullmq');
const { redis } = require('../lib/redis');
const logger = require('../utils/logger');
const { processNotification } = require('../processors/notificationProcessor');

const connection = redis;

const queueName = 'notifications';

const queue = new Queue(queueName, { connection: {
  url: process.env.REDIS_URL,
  maxRetriesPerRequest: null,
}});

let worker;
if (process.env.NODE_ENV !== 'test') {
  worker = new Worker(
    queueName,
    async job => {
      logger.info('Processing notification job', { 
        jobId: job.id, 
        data: {
          type: job.data.type,
          userId: job.data.userId,
          title: job.data.payload?.title
        }
      });
      
      try {
        const result = await processNotification(job);
        logger.info('Notification job completed successfully', { 
          jobId: job.id, 
          result: {
            success: result.success,
            notificationId: result.notificationId,
            sentVia: result.sentVia,
            errorCount: result.errors?.length || 0
          }
        });
        return result;
      } catch (error) {
        logger.error('Notification job failed', { 
          jobId: job.id, 
          error: error.message,
          stack: error.stack 
        });
        throw error;
      }
    },
    {
      connection: {
        url: process.env.REDIS_URL,
        maxRetriesPerRequest: null,
      },
      concurrency: 5, // Process up to 5 notification jobs concurrently
      removeOnComplete: 100, // Keep last 100 completed jobs
      removeOnFail: 200, // Keep last 200 failed jobs for debugging
    }
  );

  worker.on('completed', job => {
    logger.info('notification job completed', { 
      jobId: job.id,
      returnValue: job.returnvalue ? {
        success: job.returnvalue.success,
        notificationId: job.returnvalue.notificationId,
        sentVia: job.returnvalue.sentVia
      } : null
    });
  });
  
  worker.on('failed', (job, err) => {
    logger.error('notification job failed', { 
      jobId: job?.id, 
      error: err.message,
      attempts: job?.attemptsMade || 0,
      maxAttempts: job?.opts?.attempts || 3
    });
  });
  
  worker.on('stalled', jobId => {
    logger.warn('notification job stalled', { jobId });
  });

  worker.on('error', err => {
    logger.error('notification worker error', { error: err.message });
  });
}

const shutdown = async () => {
  if (worker) {
    logger.info('Shutting down notification worker...');
    await worker.close();
  }
  await queue.close();
  logger.info('Notification queue closed');
};

module.exports = {
  queue,
  worker,
  shutdown,
};
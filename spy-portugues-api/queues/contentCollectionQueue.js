const { Queue, Worker} = require('bullmq');
const { redis } = require('../lib/redis');
const logger = require('../utils/logger');
const { processContentCollection } = require('../processors/contentCollectionProcessor');

const connection = redis;

const queueName = 'content-collection';

const queue = new Queue(queueName, {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 30,
    removeOnFail: 50,
  },
});

let worker;
if (process.env.NODE_ENV !== 'test') {
  worker = new Worker(
    queueName,
    async job => {
      logger.info('Processing content collection job', { jobId: job.id, data: job.data });
      
      try {
        const result = await processContentCollection(job);
        logger.info('Content collection job completed successfully', { 
          jobId: job.id, 
          result: {
            success: result.success,
            contentCollected: result.contentCollected,
            sourcesProcessed: result.sourcesProcessed?.length || 0,
            errorCount: result.errors?.length || 0
          }
        });
        return result;
      } catch (error) {
        logger.error('Content collection job failed', { 
          jobId: job.id, 
          error: error.message,
          stack: error.stack 
        });
        throw error;
      }
    },
    {
      connection,
      concurrency: 2, // Process up to 2 content collection jobs concurrently
    }
  );

  worker.on('completed', job => {
    logger.info('contentCollection job completed', { 
      jobId: job.id,
      returnValue: job.returnvalue ? {
        success: job.returnvalue.success,
        contentCollected: job.returnvalue.contentCollected,
        sourcesProcessed: job.returnvalue.sourcesProcessed?.length || 0
      } : null
    });
  });
  
  worker.on('failed', (job, err) => {
    logger.error('contentCollection job failed', { 
      jobId: job?.id, 
      error: err.message,
      attempts: job?.attemptsMade || 0,
      maxAttempts: job?.opts?.attempts || 3
    });
  });
  
  worker.on('stalled', jobId => {
    logger.warn('contentCollection job stalled', { jobId });
  });

  worker.on('error', err => {
    logger.error('contentCollection worker error', { error: err.message });
  });
}

const shutdown = async () => {
  if (worker) {
    logger.info('Shutting down content collection worker...');
    await worker.close();
  }
  await queue.close();
  logger.info('Content collection queue closed');
};

module.exports = {
  queue,
  worker,
  shutdown,
};
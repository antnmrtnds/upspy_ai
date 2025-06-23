const { Queue, Worker} = require('bullmq');
const { redis } = require('../lib/redis');
const logger = require('../utils/logger');
const { processAdScraping } = require('../processors/adScrapingProcessor');

const connection = redis;

const queueName = 'ad-scraping';

const queue = new Queue(queueName, { connection: {
  url: process.env.REDIS_URL,
  maxRetriesPerRequest: null,
}});

let worker;
if (process.env.NODE_ENV !== 'test') {
  worker = new Worker(
    queueName,
    async job => {
      logger.info('Processing ad scraping job', { jobId: job.id, data: job.data });
      
      try {
        const result = await processAdScraping(job);
        logger.info('Ad scraping job completed successfully', { 
          jobId: job.id, 
          result: {
            success: result.success,
            adsFound: result.adsFound,
            platformsProcessed: result.platformsProcessed?.length || 0,
            errorCount: result.errors?.length || 0
          }
        });
        return result;
      } catch (error) {
        logger.error('Ad scraping job failed', { 
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
      concurrency: 3, // Process up to 3 scraping jobs concurrently
      removeOnComplete: 50, // Keep last 50 completed jobs
      removeOnFail: 100, // Keep last 100 failed jobs for debugging
    }
  );

  worker.on('completed', job => {
    logger.info('adScraper job completed', { 
      jobId: job.id,
      returnValue: job.returnvalue ? {
        success: job.returnvalue.success,
        adsFound: job.returnvalue.adsFound,
        platformsProcessed: job.returnvalue.platformsProcessed?.length || 0
      } : null
    });
  });
  
  worker.on('failed', (job, err) => {
    logger.error('adScraper job failed', { 
      jobId: job?.id, 
      error: err.message,
      attempts: job?.attemptsMade || 0,
      maxAttempts: job?.opts?.attempts || 3
    });
  });
  
  worker.on('stalled', jobId => {
    logger.warn('adScraper job stalled', { jobId });
  });

  worker.on('error', err => {
    logger.error('adScraper worker error', { error: err.message });
  });
}

const shutdown = async () => {
  if (worker) {
    logger.info('Shutting down ad scraper worker...');
    await worker.close();
  }
  await queue.close();
  logger.info('Ad scraper queue closed');
};

module.exports = {
  queue,
  worker,
  shutdown,
};
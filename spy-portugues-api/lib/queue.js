import { Queue } from 'bullmq';

// Use a single Redis URL for connection, which is standard for most hosting providers.
// This will be read from the REDIS_URL environment variable.
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error('REDIS_URL environment variable not set. BullMQ cannot connect.');
}

export const adScraperQueue = new Queue('ad-scraping', {
  connection: redisUrl,
});

// You can add other queues here as needed
// export const contentCollectionQueue = new Queue('content-collection', { connection: redisUrl });
// export const notificationQueue = new Queue('notifications', { connection: redisUrl });

console.log('BullMQ queues initialized.'); 
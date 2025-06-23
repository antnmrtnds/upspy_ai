process.env.NODE_ENV = 'test';

const adScraper = require('../queues/adScraperQueue');
const contentCollection = require('../queues/contentCollectionQueue');
const notification = require('../queues/notificationQueue');
const { shutdownWorkers } = require('../queues');

afterAll(async () => {
  await shutdownWorkers();
});

describe('BullMQ Queues', () => {
  test('queues are initialized', () => {
    expect(adScraper.queue.name).toBe('ad-scraping');
    expect(contentCollection.queue.name).toBe('content-collection');
    expect(notification.queue.name).toBe('notifications');
  });
});
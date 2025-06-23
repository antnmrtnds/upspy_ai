const adScraper = require('./adScraperQueue');
const contentCollection = require('./contentCollectionQueue');
const notification = require('./notificationQueue');
const scheduler = require('./scheduler');

const allWorkers = [
  adScraper.worker,
  contentCollection.worker,
  notification.worker,
];

const shutdownWorkers = async () => {
  await Promise.all([
    adScraper.shutdown(),
    contentCollection.shutdown(),
    notification.shutdown(),
  ]);
};

module.exports = {
  adScraperQueue: adScraper.queue,
  contentCollectionQueue: contentCollection.queue,
  notificationQueue: notification.queue,
  scheduler,
  shutdownWorkers,
};
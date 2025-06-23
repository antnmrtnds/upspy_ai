const express = require('express');
const { ExpressAdapter } = require('@bull-board/express');
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { adScraperQueue, contentCollectionQueue, notificationQueue } = require('../queues');
const adminAuth = require('../middleware/adminAuth');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(adScraperQueue),
    new BullMQAdapter(contentCollectionQueue),
    new BullMQAdapter(notificationQueue),
  ],
  serverAdapter,
});

const router = express.Router();
router.use(adminAuth);
router.use('/', serverAdapter.getRouter());

module.exports = router;
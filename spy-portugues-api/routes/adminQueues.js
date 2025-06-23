const express = require('express');
const router = express.Router();
const { adScraperQueue, contentCollectionQueue, notificationQueue } = require('../queues');
const adminAuth = require('../middleware/adminAuth');
const logger = require('../utils/logger');

const queues = [adScraperQueue, contentCollectionQueue, notificationQueue];

const findJob = async id => {
  for (const q of queues) {
    const job = await q.getJob(id);
    if (job) return job;
  }
  return null;
};

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = [];
    for (const q of queues) {
      let counts = {};
      try {
        counts = await q.getJobCounts();
      } catch (e) {
        logger.error('getJobCounts failed', { error: e.message });
      }
      stats.push({ queue: q.name, counts });
    }
    res.json({ stats });
  } catch (err) {
    logger.error('Failed to fetch queue stats', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.post('/pause', adminAuth, async (req, res) => {
  await Promise.all(queues.map(q => q.pause()));
  res.json({ status: 'paused' });
});

router.post('/resume', adminAuth, async (req, res) => {
  await Promise.all(queues.map(q => q.resume()));
  res.json({ status: 'resumed' });
});

router.get('/job/:id', adminAuth, async (req, res) => {
  const job = await findJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  const logs = await job.getLogs();
  res.json({
    id: job.id,
    name: job.name,
    data: job.data,
    attemptsMade: job.attemptsMade,
    processedOn: job.processedOn,
    finishedOn: job.finishedOn,
    failedReason: job.failedReason,
    returnValue: job.returnvalue,
    logs: logs.logs,
  });
});

router.post('/job/:id/retry', adminAuth, async (req, res) => {
  const job = await findJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  await job.retry();
  res.json({ status: 'retried' });
});

router.delete('/job/:id', adminAuth, async (req, res) => {
  const job = await findJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  await job.remove();
  res.json({ status: 'removed' });
});

module.exports = router;
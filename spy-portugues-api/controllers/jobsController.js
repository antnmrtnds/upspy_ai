const { adScraperQueue } = require('../queues');
const { triggerJob } = require('../queues/scheduler');
const logger = require('../utils/logger');

const triggerAdScrape = async (req, res) => {
  const { competitorId } = req.body;
  try {
    const job = await triggerJob(adScraperQueue, 'manual-scrape', { competitorId }, 1);
    res.status(202).json({ jobId: job.id });
  } catch (err) {
    logger.error('Failed to trigger manual scrape', { error: err.message });
    res.status(500).json({ error: 'Failed to trigger job' });
  }
};

module.exports = {
  triggerAdScrape,
};
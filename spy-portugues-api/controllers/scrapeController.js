const { adScraperQueue } = require('../queues/adScraperQueue');
const logger = require('../utils/logger');

const createScrapeJob = async (req, res) => {
  const { competitorId } = req.params;
  const { platforms, options } = req.body;

  try {
    const job = await adScraperQueue.add(
      'scrape-competitor',
      { competitorId, platforms, options },
      { priority: 1 }
    );

    logger.info(`Job added for competitor ${competitorId}`, { jobId: job.id });

    res.status(202).json({
      message: 'Scraping job accepted.',
      jobId: job.id,
    });
  } catch (error) {
    logger.error('Failed to create scraping job', { error: error.message, competitorId });
    res.status(500).json({ error: 'Failed to create scraping job.' });
  }
};

const createTestScrapeJob = async (req, res) => {
  const testCompetitorId = '11111111-1111-1111-1111-111111111111'; // A fake UUID for testing
  const { platforms, options } = req.body;

  try {
    const job = await adScraperQueue.add(
      'scrape-competitor-test',
      { competitorId: testCompetitorId, platforms, options },
      { priority: 5 }
    );

    logger.info(`TEST job added for competitor ${testCompetitorId}`, { jobId: job.id });

    res.status(202).json({
      message: 'TEST scraping job accepted.',
      jobId: job.id,
      testCompetitorId,
    });
  } catch (error) {
    logger.error('Failed to create TEST scraping job', { error: error.message });
    res.status(500).json({ error: 'Failed to create TEST scraping job.' });
  }
}

module.exports = {
  createScrapeJob,
  createTestScrapeJob,
}; 
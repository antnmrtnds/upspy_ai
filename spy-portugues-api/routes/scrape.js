const express = require('express');
const router = express.Router();
const scrapeController = require('../controllers/scrapeController');
const { scrapeValidation } = require('../middleware/validation');

// Route to trigger a new ad scraping job for a competitor
router.post(
  '/:competitorId/scrape',
  scrapeValidation.create,
  scrapeController.createScrapeJob
);

// Temporary route for testing job creation without a real ID
router.post(
  '/test-scrape',
  scrapeController.createTestScrapeJob
);

module.exports = router; 
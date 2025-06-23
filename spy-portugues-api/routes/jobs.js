const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');

// Endpoint to manually trigger an ad scraping job
router.post('/ad-scrape', jobsController.triggerAdScrape);

module.exports = router;
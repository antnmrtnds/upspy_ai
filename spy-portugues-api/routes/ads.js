const express = require('express');
const router = express.Router();
const {
  getAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  getAdsByCompetitor,
  getAdAnalytics
} = require('../controllers/adsController');
const { adsValidation } = require('../middleware/validation');

// GET /api/ads - Get all ads with filtering and pagination
router.get('/', adsValidation.list, getAds);

// GET /api/ads/analytics - Get ad analytics and statistics
router.get('/analytics', getAdAnalytics);

// GET /api/ads/:id - Get single ad by ID
router.get('/:id', adsValidation.getById, getAdById);

// GET /api/ads/competitor/:competitor_id - Get ads by competitor
router.get('/competitor/:competitor_id', adsValidation.getById, getAdsByCompetitor);

// POST /api/ads - Create new ad
router.post('/', adsValidation.create, createAd);

// PUT /api/ads/:id - Update ad
router.put('/:id', adsValidation.update, updateAd);

// DELETE /api/ads/:id - Delete ad (soft delete by default)
router.delete('/:id', adsValidation.getById, deleteAd);

module.exports = router; 
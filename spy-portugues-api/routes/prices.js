const express = require('express');
const router = express.Router();
const {
  getPrices,
  getPriceById,
  createPrice,
  updatePrice,
  deletePrice,
  getPricesByCompetitor,
  getPriceAnalytics
} = require('../controllers/pricesController');
const { pricesValidation } = require('../middleware/validation');

// GET /api/prices - Get all prices with filtering and pagination
router.get('/', pricesValidation.list, getPrices);

// GET /api/prices/analytics - Get price analytics
router.get('/analytics', getPriceAnalytics);

// GET /api/prices/:id - Get single price by ID
router.get('/:id', pricesValidation.getById, getPriceById);

// GET /api/prices/competitor/:competitor_id - Get prices by competitor
router.get('/competitor/:competitor_id', pricesValidation.getById, getPricesByCompetitor);

// POST /api/prices - Create new price record
router.post('/', pricesValidation.create, createPrice);

// PUT /api/prices/:id - Update price record
router.put('/:id', pricesValidation.update, updatePrice);

// DELETE /api/prices/:id - Delete price record
router.delete('/:id', pricesValidation.getById, deletePrice);

module.exports = router; 
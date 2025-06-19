const express = require('express');
const router = express.Router();
const {
  getCompetitors,
  getCompetitorById,
  createCompetitor,
  updateCompetitor,
  deleteCompetitor,
  getCompetitorStats
} = require('../controllers/competitorsController');
const { competitorValidation } = require('../middleware/validation');

// GET /api/competitors - Get all competitors with filtering and pagination
router.get('/', competitorValidation.list, getCompetitors);

// GET /api/competitors/:id - Get single competitor by ID
router.get('/:id', competitorValidation.getById, getCompetitorById);

// GET /api/competitors/:id/stats - Get competitor statistics
router.get('/:id/stats', competitorValidation.getById, getCompetitorStats);

// POST /api/competitors - Create new competitor
router.post('/', competitorValidation.create, createCompetitor);

// PUT /api/competitors/:id - Update competitor
router.put('/:id', competitorValidation.update, updateCompetitor);

// DELETE /api/competitors/:id - Delete competitor (soft delete by default)
router.delete('/:id', competitorValidation.getById, deleteCompetitor);

module.exports = router; 
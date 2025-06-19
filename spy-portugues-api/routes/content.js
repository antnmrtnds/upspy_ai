const express = require('express');
const router = express.Router();
const {
  getContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  getContentByCompetitor,
  getContentAnalytics
} = require('../controllers/contentController');
const { contentValidation } = require('../middleware/validation');

// GET /api/content - Get all content with filtering and pagination
router.get('/', contentValidation.list, getContent);

// GET /api/content/analytics - Get content analytics
router.get('/analytics', getContentAnalytics);

// GET /api/content/:id - Get single content by ID
router.get('/:id', contentValidation.getById, getContentById);

// GET /api/content/competitor/:competitor_id - Get content by competitor
router.get('/competitor/:competitor_id', contentValidation.getById, getContentByCompetitor);

// POST /api/content - Create new content
router.post('/', contentValidation.create, createContent);

// PUT /api/content/:id - Update content
router.put('/:id', contentValidation.update, updateContent);

// DELETE /api/content/:id - Delete content
router.delete('/:id', contentValidation.getById, deleteContent);

module.exports = router; 
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

/**
 * @swagger
 * tags:
 *   name: Competitors
 *   description: Competitor management endpoints
 */

/**
 * @swagger
 * /api/competitors:
 *   get:
 *     summary: Get all competitors
 *     description: Retrieve all competitors with optional filtering and pagination
 *     tags: [Competitors]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to filter competitors
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, monitoring]
 *         description: Filter by competitor status
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of competitors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Competitor'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// GET /api/competitors - Get all competitors with filtering and pagination
router.get('/', competitorValidation.list, getCompetitors);

// GET /api/competitors/:id - Get single competitor by ID
router.get('/:id', competitorValidation.getById, getCompetitorById);

// GET /api/competitors/:id/stats - Get competitor statistics
router.get('/:id/stats', competitorValidation.getById, getCompetitorStats);

/**
 * @swagger
 * /api/competitors:
 *   post:
 *     summary: Create a new competitor
 *     description: Add a new competitor to track
 *     tags: [Competitors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - name
 *               - website_url
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user creating the competitor
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               name:
 *                 type: string
 *                 description: Name of the competitor
 *                 example: "Competitor Real Estate"
 *               website_url:
 *                 type: string
 *                 format: uri
 *                 description: Website URL of the competitor
 *                 example: "https://competitor.pt"
 *               location:
 *                 type: string
 *                 description: Location of the competitor
 *                 example: "Lisboa, Portugal"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, monitoring]
 *                 default: active
 *                 description: Status of the competitor
 *     responses:
 *       201:
 *         description: Competitor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Competitor'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Competitor already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// POST /api/competitors - Create new competitor
router.post('/', competitorValidation.create, createCompetitor);

// PUT /api/competitors/:id - Update competitor
router.put('/:id', competitorValidation.update, updateCompetitor);

// DELETE /api/competitors/:id - Delete competitor (soft delete by default)
router.delete('/:id', competitorValidation.getById, deleteCompetitor);

module.exports = router; 
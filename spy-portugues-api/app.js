// const express = require('express');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import custom logger
const logger = require('./utils/logger');

// Import Swagger documentation
const { swaggerUi, specs } = require('./config/swagger');

// Import Supabase connection test
const { testConnection } = require('./lib/supabase');

// Import Redis connection
const { redis, testConnection: testRedis } = require('./lib/redis');
// Import BullMQ queues and worker shutdown helper
const { shutdownWorkers } = require('./queues');
// Import error handling middleware
const { globalErrorHandler, handleNotFound } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb', type: 'application/json' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// API Documentation with Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SpyPortuguês API Documentation'
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current status of the API server
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-01T00:00:00.000Z
 *                 environment:
 *                   type: string
 *                   example: development
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
// Health check endpoint
app.get('/health', (req, res) => {
  logger.info('Health check accessed', { 
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent')
  });
  
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

/**
 * @swagger
 * /health/redis:
 *   get:
 *     summary: Redis health check
 *     description: Verify connection to the Redis instance
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Redis connection is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *       500:
 *         description: Redis connection failed
 */
app.get('/health/redis', async (req, res) => {
  try {
    await redis.ping();
    res.status(200).json({ status: 'OK' });
  } catch (err) {
    logger.error('Redis health check failed', { error: err });
    res.status(500).json({ status: 'ERROR' });
  }
});


// API routes (will be added in next subtask)
app.use('/api/competitors', require('./routes/competitors'));
app.use('/api/ads', require('./routes/ads'));
app.use('/api/content', require('./routes/content'));
app.use('/api/prices', require('./routes/prices'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/competitors', require('./routes/scrape'));

// Handle 404 routes
app.use(handleNotFound);

// Global error handling middleware (must be last)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3001;

// Start server
const server = app.listen(PORT, async () => {
  logger.info(`SpyPortuguês API Server started`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    pid: process.pid
  });
  
  console.log(`🚀 SpyPortuguês API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🔄 Redis health: http://localhost:${PORT}/health/redis`);
  console.log(`📖 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  
  // Test Supabase connection
  logger.info('Testing Supabase connection...');
  await testConnection();
  // Test Redis connection
  logger.info('Testing Redis connection...');
  await testRedis();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  shutdownWorkers()
    .catch(err => logger.error('Error shutting down workers', { error: err }))
    .finally(() => {
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  shutdownWorkers()
    .catch(err => logger.error('Error shutting down workers', { error: err }))
    .finally(() => {
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });
});

module.exports = app; 
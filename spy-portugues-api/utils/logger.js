const fs = require('fs');
const path = require('path');

/**
 * Custom Logger Utility for SpyPortuguês API
 * Provides structured logging with different levels and file/console output
 */
class Logger {
  constructor() {
    this.logLevels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    };
    
    this.currentLevel = process.env.LOG_LEVEL ? 
      this.logLevels[process.env.LOG_LEVEL.toUpperCase()] : 
      this.logLevels.INFO;
    
    // Create logs directory if it doesn't exist
    this.logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  /**
   * Format log message with timestamp and context
   */
  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      pid: process.pid,
      ...context
    };
    
    return JSON.stringify(logEntry);
  }

  /**
   * Write log to file and console
   */
  writeLog(level, message, context = {}) {
    if (this.logLevels[level] > this.currentLevel) {
      return; // Skip if log level is below current threshold
    }

    const formattedMessage = this.formatMessage(level, message, context);
    
    // Console output with colors
    const colors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m',  // Yellow
      INFO: '\x1b[36m',  // Cyan
      DEBUG: '\x1b[37m'  // White
    };
    
    const resetColor = '\x1b[0m';
    console.log(`${colors[level]}[${level}]${resetColor} ${message}`, context);
    
    // File output
    const logFile = path.join(this.logsDir, `${level.toLowerCase()}.log`);
    const allLogFile = path.join(this.logsDir, 'all.log');
    
    try {
      fs.appendFileSync(logFile, formattedMessage + '\n');
      fs.appendFileSync(allLogFile, formattedMessage + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Error level logging
   */
  error(message, context = {}) {
    this.writeLog('ERROR', message, {
      ...context,
      stack: context.error?.stack || context.stack
    });
  }

  /**
   * Warning level logging
   */
  warn(message, context = {}) {
    this.writeLog('WARN', message, context);
  }

  /**
   * Info level logging
   */
  info(message, context = {}) {
    this.writeLog('INFO', message, context);
  }

  /**
   * Debug level logging
   */
  debug(message, context = {}) {
    this.writeLog('DEBUG', message, context);
  }

  /**
   * Database operation logging
   */
  database(operation, table, context = {}) {
    this.info(`Database ${operation} on ${table}`, {
      type: 'database',
      operation,
      table,
      ...context
    });
  }

  /**
   * API request logging
   */
  request(req, res, responseTime) {
    this.info(`${req.method} ${req.originalUrl}`, {
      type: 'api_request',
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    });
  }

  /**
   * Authentication/Authorization logging
   */
  auth(action, userId, context = {}) {
    this.info(`Auth: ${action}`, {
      type: 'authentication',
      action,
      userId,
      ...context
    });
  }

  /**
   * External service logging
   */
  external(service, action, context = {}) {
    this.info(`External service: ${service} - ${action}`, {
      type: 'external_service',
      service,
      action,
      ...context
    });
  }

  /**
   * Performance logging
   */
  performance(operation, duration, context = {}) {
    this.info(`Performance: ${operation} took ${duration}ms`, {
      type: 'performance',
      operation,
      duration,
      ...context
    });
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger; 
const { AppError } = require('../utils/errors');

// Development error response
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message,
      code: err.errorCode || 'INTERNAL_SERVER_ERROR',
      statusCode: err.statusCode || 500,
      timestamp: new Date().toISOString(),
      stack: err.stack,
      ...(err.details && { details: err.details }),
      ...(err.service && { service: err.service }),
      ...(err.originalError && { originalError: err.originalError })
    }
  });
};

// Production error response
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json(err.toJSON ? err.toJSON() : {
      error: {
        message: err.message,
        code: err.errorCode,
        statusCode: err.statusCode,
        timestamp: new Date().toISOString()
      }
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR:', err);
    res.status(500).json({
      error: {
        message: 'Something went wrong!',
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
};

// Handle Supabase errors
const handleSupabaseError = (err) => {
  let message = 'Database operation failed';
  let statusCode = 500;

  // Handle specific Supabase error codes
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        message = 'A record with this information already exists';
        statusCode = 409;
        break;
      case '23503': // Foreign key violation
        message = 'Referenced record does not exist';
        statusCode = 400;
        break;
      case '23502': // Not null violation
        message = 'Required field is missing';
        statusCode = 400;
        break;
      case '42P01': // Undefined table
        message = 'Database table not found';
        statusCode = 500;
        break;
      case '42703': // Undefined column
        message = 'Database column not found';
        statusCode = 500;
        break;
      case '22P02': // Invalid text representation (invalid UUID format)
        message = 'Invalid ID format provided';
        statusCode = 400;
        break;
      default:
        message = err.message || 'Database operation failed';
        // Check for UUID validation errors in message
        if (err.message && err.message.includes('invalid input syntax for type uuid')) {
          message = 'Invalid ID format provided';
          statusCode = 400;
        }
    }
  }

  return new AppError(message, statusCode, 'DATABASE_ERROR');
};

// Handle JWT errors
const handleJWTError = () => 
  new AppError('Invalid token. Please log in again!', 401, 'INVALID_TOKEN');

const handleJWTExpiredError = () => 
  new AppError('Your token has expired! Please log in again.', 401, 'TOKEN_EXPIRED');

// Handle validation errors from express-validator
const handleValidationError = (err) => {
  const errors = err.array ? err.array() : [err];
  const details = errors.map(error => ({
    field: error.param || error.path,
    message: error.msg || error.message,
    value: error.value
  }));

  const validationError = new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  validationError.details = details;
  return validationError;
};

// Main error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err.code && (err.code.startsWith('23') || err.code.startsWith('42') || err.code === '22P02')) {
      error = handleSupabaseError(err);
    }
    
    // Handle Supabase errors that might not have a code but have UUID validation messages
    if (err.message && err.message.includes('invalid input syntax for type uuid')) {
      error = handleSupabaseError(err);
    }
    
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    if (err.array && typeof err.array === 'function') {
      error = handleValidationError(err);
    }

    sendErrorProd(error, res);
  }
};

// Async error handler wrapper
const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Handle unhandled routes
const handleNotFound = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404, 'ROUTE_NOT_FOUND');
  next(err);
};

module.exports = {
  globalErrorHandler,
  asyncErrorHandler,
  handleNotFound,
  handleSupabaseError,
  handleValidationError
}; 
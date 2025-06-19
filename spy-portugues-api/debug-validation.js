const { param } = require('express-validator');
const { ValidationError } = require('./utils/errors');

// Test the UUID validation directly
const testUUIDValidation = async () => {
  console.log('Testing UUID validation...');
  
  // Create a mock request object
  const mockReq = {
    params: {
      id: 'invalid-uuid'
    }
  };
  
  const mockRes = {};
  const mockNext = (error) => {
    if (error) {
      console.log('Validation error caught:', error.message);
      console.log('Error type:', error.constructor.name);
      console.log('Status code:', error.statusCode);
    } else {
      console.log('No validation error - this is unexpected');
    }
  };
  
  // Create the validation rule
  const idValidation = param('id').isUUID().withMessage('ID must be a valid UUID');
  
  try {
    // Run the validation
    await idValidation.run(mockReq);
    
    // Check for validation errors (simulate express-validator behavior)
    const { validationResult } = require('express-validator');
    const errors = validationResult(mockReq);
    
    if (!errors.isEmpty()) {
      console.log('Validation errors found:', errors.array());
      const validationError = new ValidationError('Validation failed', errors.array());
      mockNext(validationError);
    } else {
      mockNext();
    }
    
  } catch (error) {
    console.log('Unexpected error:', error);
  }
};

// Test valid UUID
const testValidUUID = async () => {
  console.log('\nTesting valid UUID...');
  
  const mockReq = {
    params: {
      id: '123e4567-e89b-12d3-a456-426614174000'
    }
  };
  
  const mockNext = (error) => {
    if (error) {
      console.log('Unexpected validation error:', error.message);
    } else {
      console.log('Valid UUID passed validation as expected');
    }
  };
  
  const idValidation = param('id').isUUID().withMessage('ID must be a valid UUID');
  
  try {
    await idValidation.run(mockReq);
    
    const { validationResult } = require('express-validator');
    const errors = validationResult(mockReq);
    
    if (!errors.isEmpty()) {
      const validationError = new ValidationError('Validation failed', errors.array());
      mockNext(validationError);
    } else {
      mockNext();
    }
    
  } catch (error) {
    console.log('Unexpected error:', error);
  }
};

// Run tests
testUUIDValidation().then(() => {
  testValidUUID();
}); 
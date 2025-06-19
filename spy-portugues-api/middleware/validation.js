const { body, param, query, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

// Helper function to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value,
      location: error.location
    }));
    
    throw new ValidationError('Validation failed', details);
  }
  next();
};

// Common validation rules
const commonRules = {
  id: param('id').isUUID().withMessage('ID must be a valid UUID'),
  competitorId: body('competitor_id').optional().isUUID().withMessage('Competitor ID must be a valid UUID'),
  userId: body('user_id').optional().isUUID().withMessage('User ID must be a valid UUID'),
  pagination: [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer')
  ],
  sorting: [
    query('sort_by').optional().isString().withMessage('Sort by must be a string'),
    query('sort_order').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
  ]
};

// Competitor validation schemas
const competitorValidation = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    
    body('website')
      .optional()
      .isURL()
      .withMessage('Website must be a valid URL'),
    
    body('facebook_url')
      .optional()
      .isURL()
      .withMessage('Facebook URL must be a valid URL')
      .custom((value) => {
        if (value && !value.includes('facebook.com')) {
          throw new Error('Facebook URL must be a valid Facebook URL');
        }
        return true;
      }),
    
    body('instagram_url')
      .optional()
      .isURL()
      .withMessage('Instagram URL must be a valid URL')
      .custom((value) => {
        if (value && !value.includes('instagram.com')) {
          throw new Error('Instagram URL must be a valid Instagram URL');
        }
        return true;
      }),
    
    body('tiktok_url')
      .optional()
      .isURL()
      .withMessage('TikTok URL must be a valid URL')
      .custom((value) => {
        if (value && !value.includes('tiktok.com')) {
          throw new Error('TikTok URL must be a valid TikTok URL');
        }
        return true;
      }),
    
    body('regions')
      .optional()
      .isArray()
      .withMessage('Regions must be an array')
      .custom((value) => {
        const validRegions = ['Lisbon', 'Porto', 'Algarve', 'Central Portugal', 'Northern Portugal', 'Azores', 'Madeira'];
        if (value && value.some(region => !validRegions.includes(region))) {
          throw new Error('Invalid region provided');
        }
        return true;
      }),
    
    body('property_types')
      .optional()
      .isArray()
      .withMessage('Property types must be an array')
      .custom((value) => {
        const validTypes = ['Apartamento', 'Moradia', 'Terreno', 'Escritório', 'Loja', 'Armazém', 'Garagem'];
        if (value && value.some(type => !validTypes.includes(type))) {
          throw new Error('Invalid property type provided');
        }
        return true;
      }),
    
    handleValidationErrors
  ],
  
  update: [
    commonRules.id,
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    
    body('website')
      .optional()
      .isURL()
      .withMessage('Website must be a valid URL'),
    
    body('facebook_url')
      .optional()
      .isURL()
      .withMessage('Facebook URL must be a valid URL'),
    
    body('instagram_url')
      .optional()
      .isURL()
      .withMessage('Instagram URL must be a valid URL'),
    
    body('tiktok_url')
      .optional()
      .isURL()
      .withMessage('TikTok URL must be a valid URL'),
    
    body('regions')
      .optional()
      .isArray()
      .withMessage('Regions must be an array'),
    
    body('property_types')
      .optional()
      .isArray()
      .withMessage('Property types must be an array'),
    
    handleValidationErrors
  ],
  
  list: [
    ...commonRules.pagination,
    ...commonRules.sorting,
    query('search').optional().isString().withMessage('Search must be a string'),
    query('region').optional().isString().withMessage('Region must be a string'),
    query('property_type').optional().isString().withMessage('Property type must be a string'),
    handleValidationErrors
  ],
  
  getById: [commonRules.id, handleValidationErrors]
};

// Ads validation schemas
const adsValidation = {
  create: [
    body('ad_id')
      .notEmpty()
      .withMessage('Ad ID is required')
      .isString()
      .withMessage('Ad ID must be a string'),
    
    body('platform')
      .notEmpty()
      .withMessage('Platform is required')
      .isIn(['facebook', 'instagram', 'tiktok', 'google'])
      .withMessage('Platform must be one of: facebook, instagram, tiktok, google'),
    
    body('ad_text')
      .optional()
      .isString()
      .withMessage('Ad text must be a string')
      .isLength({ max: 5000 })
      .withMessage('Ad text must be less than 5000 characters'),
    
    body('image_url')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL'),
    
    body('video_url')
      .optional()
      .isURL()
      .withMessage('Video URL must be a valid URL'),
    
    body('landing_page_url')
      .optional()
      .isURL()
      .withMessage('Landing page URL must be a valid URL'),
    
    body('regions')
      .optional()
      .isArray()
      .withMessage('Regions must be an array'),
    
    body('property_types')
      .optional()
      .isArray()
      .withMessage('Property types must be an array'),
    
    commonRules.competitorId,
    handleValidationErrors
  ],
  
  update: [
    commonRules.id,
    body('ad_text')
      .optional()
      .isString()
      .withMessage('Ad text must be a string'),
    
    body('image_url')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL'),
    
    body('video_url')
      .optional()
      .isURL()
      .withMessage('Video URL must be a valid URL'),
    
    body('landing_page_url')
      .optional()
      .isURL()
      .withMessage('Landing page URL must be a valid URL'),
    
    body('is_active')
      .optional()
      .isBoolean()
      .withMessage('Is active must be a boolean'),
    
    handleValidationErrors
  ],
  
  list: [
    ...commonRules.pagination,
    ...commonRules.sorting,
    query('platform').optional().isIn(['facebook', 'instagram', 'tiktok', 'google']).withMessage('Invalid platform'),
    query('competitor_id').optional().isUUID().withMessage('Competitor ID must be a valid UUID'),
    query('is_active').optional().isBoolean().withMessage('Is active must be a boolean'),
    query('search').optional().isString().withMessage('Search must be a string'),
    handleValidationErrors
  ],
  
  getById: [commonRules.id, handleValidationErrors]
};

// Content validation schemas
const contentValidation = {
  create: [
    body('platform')
      .notEmpty()
      .withMessage('Platform is required')
      .isIn(['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin'])
      .withMessage('Platform must be one of: facebook, instagram, tiktok, youtube, linkedin'),
    
    body('post_id')
      .notEmpty()
      .withMessage('Post ID is required')
      .isString()
      .withMessage('Post ID must be a string'),
    
    body('media_url')
      .optional()
      .isURL()
      .withMessage('Media URL must be a valid URL'),
    
    body('caption')
      .optional()
      .isString()
      .withMessage('Caption must be a string')
      .isLength({ max: 10000 })
      .withMessage('Caption must be less than 10000 characters'),
    
    body('hashtags')
      .optional()
      .isArray()
      .withMessage('Hashtags must be an array'),
    
    body('likes_count')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Likes count must be a non-negative integer'),
    
    body('comments_count')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Comments count must be a non-negative integer'),
    
    body('shares_count')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Shares count must be a non-negative integer'),
    
    body('views_count')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Views count must be a non-negative integer'),
    
    commonRules.competitorId,
    handleValidationErrors
  ],
  
  update: [
    commonRules.id,
    body('caption')
      .optional()
      .isString()
      .withMessage('Caption must be a string'),
    
    body('likes_count')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Likes count must be a non-negative integer'),
    
    body('comments_count')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Comments count must be a non-negative integer'),
    
    body('shares_count')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Shares count must be a non-negative integer'),
    
    body('views_count')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Views count must be a non-negative integer'),
    
    handleValidationErrors
  ],
  
  list: [
    ...commonRules.pagination,
    ...commonRules.sorting,
    query('platform').optional().isIn(['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin']).withMessage('Invalid platform'),
    query('competitor_id').optional().isUUID().withMessage('Competitor ID must be a valid UUID'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('min_engagement_rate').optional().isFloat({ min: 0, max: 100 }).withMessage('Min engagement rate must be between 0 and 100'),
    query('max_engagement_rate').optional().isFloat({ min: 0, max: 100 }).withMessage('Max engagement rate must be between 0 and 100'),
    handleValidationErrors
  ],
  
  getById: [commonRules.id, handleValidationErrors]
};

// Prices validation schemas
const pricesValidation = {
  create: [
    body('source_type')
      .notEmpty()
      .withMessage('Source type is required')
      .isIn(['website', 'api', 'manual'])
      .withMessage('Source type must be one of: website, api, manual'),
    
    body('property_type')
      .notEmpty()
      .withMessage('Property type is required')
      .isString()
      .withMessage('Property type must be a string'),
    
    body('region')
      .notEmpty()
      .withMessage('Region is required')
      .isString()
      .withMessage('Region must be a string'),
    
    body('price_eur')
      .notEmpty()
      .withMessage('Price in EUR is required')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('price_per_sqm_eur')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price per sqm must be a positive number'),
    
    body('property_size_sqm')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Property size must be a positive number'),
    
    body('bedrooms')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Bedrooms must be a non-negative integer'),
    
    body('bathrooms')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Bathrooms must be a non-negative integer'),
    
    commonRules.competitorId,
    handleValidationErrors
  ],
  
  update: [
    commonRules.id,
    body('price_eur')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('price_per_sqm_eur')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price per sqm must be a positive number'),
    
    body('property_size_sqm')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Property size must be a positive number'),
    
    body('bedrooms')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Bedrooms must be a non-negative integer'),
    
    body('bathrooms')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Bathrooms must be a non-negative integer'),
    
    handleValidationErrors
  ],
  
  list: [
    ...commonRules.pagination,
    ...commonRules.sorting,
    query('competitor_id').optional().isUUID().withMessage('Competitor ID must be a valid UUID'),
    query('property_type').optional().isString().withMessage('Property type must be a string'),
    query('region').optional().isString().withMessage('Region must be a string'),
    query('source_type').optional().isIn(['website', 'api', 'manual']).withMessage('Invalid source type'),
    query('min_price').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
    query('max_price').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
    handleValidationErrors
  ],
  
  getById: [commonRules.id, handleValidationErrors]
};

// Notifications validation schemas
const notificationsValidation = {
  create: [
    body('type')
      .notEmpty()
      .withMessage('Type is required')
      .isIn(['info', 'warning', 'error', 'success'])
      .withMessage('Type must be one of: info, warning, error, success'),
    
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    
    body('message')
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message must be between 1 and 1000 characters'),
    
    body('sent_via')
      .optional()
      .isIn(['email', 'sms', 'push', 'in_app'])
      .withMessage('Sent via must be one of: email, sms, push, in_app'),
    
    commonRules.userId,
    handleValidationErrors
  ],
  
  update: [
    commonRules.id,
    body('title')
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    
    body('message')
      .optional()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message must be between 1 and 1000 characters'),
    
    body('is_read')
      .optional()
      .isBoolean()
      .withMessage('Is read must be a boolean'),
    
    handleValidationErrors
  ],
  
  list: [
    ...commonRules.pagination,
    ...commonRules.sorting,
    query('user_id').optional().isUUID().withMessage('User ID must be a valid UUID'),
    query('type').optional().isIn(['info', 'warning', 'error', 'success']).withMessage('Invalid notification type'),
    query('is_read').optional().isBoolean().withMessage('Is read must be a boolean'),
    handleValidationErrors
  ],
  
  getById: [commonRules.id, handleValidationErrors],
  
  markAsRead: [
    commonRules.id,
    handleValidationErrors
  ]
};

module.exports = {
  competitorValidation,
  adsValidation,
  contentValidation,
  pricesValidation,
  notificationsValidation,
  handleValidationErrors
}; 
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SpyPortuguês API',
      version: '1.0.0',
      description: 'Backend API service for SpyPortuguês - Portuguese real estate competitor tracking tool',
      contact: {
        name: 'SpyPortuguês Team',
        email: 'support@spyportugues.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.spyportugues.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR'
                },
                message: {
                  type: 'string',
                  example: 'Validation failed'
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string',
                        example: 'email'
                      },
                      message: {
                        type: 'string',
                        example: 'Invalid email format'
                      }
                    }
                  }
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object'
            },
            meta: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  example: 100
                },
                page: {
                  type: 'integer',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  example: 10
                }
              }
            }
          }
        },
        Competitor: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            name: {
              type: 'string',
              example: 'Competitor Real Estate'
            },
            website_url: {
              type: 'string',
              format: 'uri',
              example: 'https://competitor.pt'
            },
            location: {
              type: 'string',
              example: 'Lisboa, Portugal'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'monitoring'],
              example: 'active'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          },
          required: ['user_id', 'name', 'website_url']
        },
        Ad: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            competitor_id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            title: {
              type: 'string',
              example: 'Apartamento T2 em Lisboa'
            },
            description: {
              type: 'string',
              example: 'Excelente apartamento no centro de Lisboa'
            },
            price: {
              type: 'number',
              example: 350000
            },
            currency: {
              type: 'string',
              example: 'EUR'
            },
            location: {
              type: 'string',
              example: 'Lisboa, Portugal'
            },
            property_type: {
              type: 'string',
              enum: ['apartment', 'house', 'commercial', 'land'],
              example: 'apartment'
            },
            bedrooms: {
              type: 'integer',
              example: 2
            },
            bathrooms: {
              type: 'integer',
              example: 1
            },
            area_sqm: {
              type: 'number',
              example: 85.5
            },
            url: {
              type: 'string',
              format: 'uri',
              example: 'https://competitor.pt/property/123'
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri'
              },
              example: ['https://competitor.pt/images/1.jpg']
            },
            status: {
              type: 'string',
              enum: ['active', 'sold', 'removed'],
              example: 'active'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          },
          required: ['competitor_id', 'title', 'price', 'currency', 'url']
        },
        Content: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            competitor_id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            title: {
              type: 'string',
              example: 'Market Analysis Q1 2024'
            },
            content_type: {
              type: 'string',
              enum: ['blog_post', 'social_media', 'newsletter', 'press_release'],
              example: 'blog_post'
            },
            content: {
              type: 'string',
              example: 'Content of the article or post'
            },
            url: {
              type: 'string',
              format: 'uri',
              example: 'https://competitor.pt/blog/market-analysis-q1-2024'
            },
            published_date: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['market', 'analysis', 'real-estate']
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          },
          required: ['competitor_id', 'title', 'content_type', 'url']
        },
        Price: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            ad_id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            price: {
              type: 'number',
              example: 350000
            },
            currency: {
              type: 'string',
              example: 'EUR'
            },
            price_type: {
              type: 'string',
              enum: ['listing', 'reduced', 'negotiated'],
              example: 'listing'
            },
            recorded_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          },
          required: ['ad_id', 'price', 'currency', 'price_type']
        },
        Notification: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            type: {
              type: 'string',
              enum: ['price_change', 'new_listing', 'content_update', 'competitor_update'],
              example: 'price_change'
            },
            title: {
              type: 'string',
              example: 'Price Change Alert'
            },
            message: {
              type: 'string',
              example: 'Property price changed from €350,000 to €325,000'
            },
            read: {
              type: 'boolean',
              example: false
            },
            data: {
              type: 'object',
              example: {
                "ad_id": "123e4567-e89b-12d3-a456-426614174000",
                "old_price": 350000,
                "new_price": 325000
              }
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          },
          required: ['user_id', 'type', 'title', 'message']
        }
      },
      responses: {
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './app.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
}; 
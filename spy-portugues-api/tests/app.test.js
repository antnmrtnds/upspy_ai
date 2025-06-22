const request = require('supertest');
process.env.NODE_ENV = 'test';
const app = require('../app');

describe('API Server', () => {
  test('Health endpoint should return OK', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.status).toBe('OK');
    expect(response.body.environment).toBe('test');
  });

  test('Redis health endpoint should return OK', async () => {
    const response = await request(app)
      .get('/health/redis')
      .expect(200);

    expect(response.body.status).toBe('OK');
  });

  test('Should return 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/unknown-route')
      .expect(404);

    expect(response.body.error.statusCode).toBe(404);
  });

  test('API routes should be accessible', async () => {
    // Test competitors endpoint (should return data structure)
    const competitorsResponse = await request(app)
      .get('/api/competitors')
      .expect(200);
    
    expect(competitorsResponse.body).toHaveProperty('data');
    expect(competitorsResponse.body).toHaveProperty('pagination');
    
    // Test ads endpoint (returns empty data in test environment)
    const adsResponse = await request(app)
      .get('/api/ads')
      .expect(200);

    expect(adsResponse.body).toHaveProperty('data');
  });
}); 
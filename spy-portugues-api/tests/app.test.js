const request = require('supertest');
const app = require('../app');

describe('API Server', () => {
    test('Health endpoint should return OK', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.status).toBe('OK');
    expect(response.body.environment).toBe('test');
  });

  test('Should return 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/unknown-route')
      .expect(404);
    
    expect(response.body.error).toBe('Not Found');
  });

  test('API routes should be accessible', async () => {
    // Test competitors endpoint (should return data structure)
    const competitorsResponse = await request(app)
      .get('/api/competitors')
      .expect(200);
    
    expect(competitorsResponse.body).toHaveProperty('data');
    expect(competitorsResponse.body).toHaveProperty('pagination');
    
    // Test ads endpoint (should return error since table doesn't exist yet)
    const adsResponse = await request(app)
      .get('/api/ads')
      .expect(500);
    
    expect(adsResponse.body).toHaveProperty('error');
  });
}); 
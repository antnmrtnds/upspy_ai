process.env.NODE_ENV = 'test';
process.env.ADMIN_TOKEN = 'testtoken';

const request = require('supertest');
const app = require('../app');

const auth = { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` };

describe('Admin Queues Endpoints', () => {
  test('requires auth for stats', async () => {
    await request(app).get('/admin/queues/api/stats').expect(401);
  });

  test('returns stats with auth', async () => {
    const res = await request(app)
      .get('/admin/queues/api/stats')
      .set(auth)
      .expect(200);
    expect(res.body).toHaveProperty('stats');
    expect(Array.isArray(res.body.stats)).toBe(true);
  });
});
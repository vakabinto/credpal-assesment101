const request = require('supertest');
const app = require('../src/app'); // Adjust path if needed

describe('API Endpoints', () => {
  it('GET /health should return 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('OK');
  });

  it('POST /process should return 400 if no data', async () => {
    const res = await request(app).post('/process').send({});
    expect(res.statusCode).toEqual(400);
  });
});
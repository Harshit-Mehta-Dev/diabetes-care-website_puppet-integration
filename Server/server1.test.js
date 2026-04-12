const request = require('supertest');
const app = require('./server1'); // Import the express app

describe('API Endpoints', () => {
    // Basic test to verify that the GET /api/questions endpoint returns a 200 OK
    it('GET /api/questions should return an array', async () => {
        const response = await request(app).get('/api/questions');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    // Basic test to verify POST /api/questions endpoint
    it('POST /api/questions should add a new question', async () => {
        const newQuestion = {
            title: 'Test Title',
            details: 'Test Details'
        };

        const response = await request(app)
            .post('/api/questions')
            .send(newQuestion);
        
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe('Test Title');
        expect(response.body.status).toBe('Pending');
    });
});

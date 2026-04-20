const request = require('supertest');
const app = require('./server1'); // Import the express app

describe('Diabetes Care API Endpoints', () => {
    // 1. Test for the "Ask Doctor" endpoint
    it('POST /api/ask-doctor should receive queries and return 200', async () => {
        const queryData = {
            email: 'test@example.com',
            title: 'Sugar level spike',
            details: 'My sugar level was 250 after lunch.',
            priority: 'urgent'
        };

        const response = await request(app)
            .post('/api/ask-doctor')
            .send(queryData);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Question sent to doctor!');
    });

    // 2. Test for the Chatbot endpoint structure (Bad input test)
    it('POST /api/chat/stream should return 400 if message is missing', async () => {
        const response = await request(app)
            .post('/api/chat/stream')
            .send({});
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    // 3. Test for static file serving (Home Page)
    it('GET / should return the index.html page', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('<!DOCTYPE html>');
    });
});

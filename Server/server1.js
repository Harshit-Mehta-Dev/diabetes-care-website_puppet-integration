const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const statusMonitor = require('express-status-monitor');


const app = express();
const PORT = process.env.PORT || 1012;


// Middleware
app.use(statusMonitor()); // Adds performance monitoring at /status


// Request Logger for "Full Access" visibility
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
});


app.use(helmet({
    contentSecurityPolicy: false // Disabled for 'Full Access' testing to prevent ngrok blocks
}));


// Rate limiting - Relaxed for Full Access Testing
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000, // Effectively lifted
    message: { error: 'Rate limit exceeded during testing.' }
});
app.use('/api/', limiter);


app.use(cors({ origin: '*', methods: ['GET', 'POST'], credentials: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


const { GoogleGenerativeAI } = require('@google/generative-ai');


// Check for API Key presence
if (!process.env.GEMINI_API_KEY) {
    console.error('CRITICAL: GEMINI_API_KEY is not defined in the environment variables.');
}


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');


// Streaming Chatbot API Endpoint for instant responses
app.post('/api/chat/stream', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required for chat.' });
        }
        
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('Gemini API Key is missing. Please configure it in your Vercel settings.');
        }


        // Using the ultra-stable gemini-1.5-flash model

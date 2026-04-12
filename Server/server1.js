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
app.use(helmet()); // Secures HTTP headers

// Rate limiting to prevent basic DDoS and brute-force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes restricts
    max: 200, // 200 requests per IP
    message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter); // Apply rate limiter mostly to APIs

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Streaming Chatbot API Endpoint for instant responses
app.post('/api/chat/stream', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Using the ultra-fast gemini flash model
        const model = genAI.getGenerativeModel({ 
            model: "gemini-flash-latest",
            systemInstruction: "You are an expert Diabetes Care & General Health Assistant. Your goal is to provide CRISP, CLEAR, and highly functional answers.\n\n" +
                             "RULES:\n" +
                             "1. For diabetes topics (Type 1, Type 2, diet, meds, exercise): provide comprehensive, fully capable advice structured logically.\n" +
                             "2. For ALL OTHER topics: provide helpful, precise, and polite answers.\n" +
                             "3. Structure: Use plain text numbers and simple line breaks. Make it easy to read.\n" +
                             "4. Limit verbosity: Get straight to the point. Give the user exactly what they searched for.\n" +
                             "5. ALWAYS include a brief 1-sentence disclaimer to consult a doctor for medical advice at the end."
        });

        // Set headers for SSE streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const result = await model.generateContentStream(message);

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }
        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error('Error with Gemini API Stream:', error);
        // If headers haven't been sent, we can still send a standard JSON error, else we stringify into stream
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || 'Error processing your request' });
        } else {
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        }
    }
});

// Questions API Endpoints (simplified)
let questions = [];

app.post('/api/questions', (req, res) => {
    const { title, details } = req.body;
    const newQuestion = {
        id: Date.now(),
        title,
        details,
        date: new Date().toLocaleDateString(),
        status: 'Pending'
    };
    questions.push(newQuestion);
    res.status(201).json(newQuestion);
});

app.get('/api/questions', (req, res) => {
    res.json(questions);
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
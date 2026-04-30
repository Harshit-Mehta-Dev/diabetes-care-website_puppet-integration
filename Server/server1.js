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

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
});

app.use(helmet({
    contentSecurityPolicy: false // Disabled for testing/ngrok compatibility
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: { error: 'Rate limit exceeded.' }
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

// Streaming Chatbot API Endpoint
app.post('/api/chat/stream', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required for chat.' });
        }
        
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('Gemini API Key is missing. Please configure it in your .env file or Vercel settings.');
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are an expert Diabetes Care & General Health Assistant. " +
                             "RULES:\n" +
                             "1. For diabetes topics (Type 1, Type 2, diet, meds, exercise): provide comprehensive advice.\n" +
                             "2. For ALL OTHER topics: provide helpful, precise, and polite answers.\n" +
                             "3. Structure: Use simple line breaks.\n" +
                             "4. Limit verbosity: Get straight to the point.\n" +
                             "5. ALWAYS include a brief 1-sentence disclaimer to consult a doctor at the end."
        });

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
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || 'Error processing your request' });
        } else {
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        }
    }
});

const nodemailer = require('nodemailer');

// Questions API Endpoint
app.post('/api/ask-doctor', async (req, res) => {
    try {
        const { email, title, details, priority } = req.body;
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'harshitmehta1314@gmail.com',
                pass: '123' // Placeholder
            }
        });

        const mailOptions = {
            from: email,
            to: 'harshitmehta1314@gmail.com',
            subject: `[${priority ? priority.toUpperCase() : 'ROUTINE'}] Doctor Question: ${title}`,
            text: `New question from ${email}:\n\nPriority: ${priority}\nTitle: ${title}\n\nDetails:\n${details}`
        };

        if (transporter.options.auth.pass === '123') {
            console.log("Mock Mode Active: Bypassing actual email for placeholder password.");
            await new Promise(resolve => setTimeout(resolve, 800));
        } else {
            await transporter.sendMail(mailOptions);
        }
        
        res.status(200).json({ success: true, message: 'Question sent to doctor!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send question.' });
    }
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;

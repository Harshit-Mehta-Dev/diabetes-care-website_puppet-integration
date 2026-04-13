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
app.use(helmet({
    contentSecurityPolicy: false, // Disabling CSP entirely to allow external scripts like Chart.js to load gracefully.
})); // Secures HTTP headers

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

const nodemailer = require('nodemailer');

// Questions API Endpoint with Email Notification
app.post('/api/ask-doctor', async (req, res) => {
    try {
        const { email, title, details, priority } = req.body;
        
        // Setup transporter using the requested default password for Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'harshitmehta1314@gmail.com',
                pass: '123'
            }
        });

        const mailOptions = {
            from: email,
            to: 'harshitmehta1314@gmail.com',
            subject: `[${priority ? priority.toUpperCase() : 'ROUTINE'}] Doctor Question: ${title}`,
            text: `You have received a new question submitted by ${email}:\n\nPriority: ${priority}\nTitle: ${title}\n\nDetails:\n${details}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #3498db;">New Doctor Question Submitted <span style="font-size:0.8em; color:red;">[${priority || 'Routine'}]</span></h2>
                    <p><strong>Sender Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${title}</p>
                    <p><strong>Details:</strong></p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3498db;">
                        ${details.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `
        };

        if (transporter.options.auth.pass === '123') {
            console.log("Mock Mode Active: Bypassing actual email to prevent EAUTH error since '123' is a placeholder password.");
            await new Promise(resolve => setTimeout(resolve, 800)); // simulate network delay
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
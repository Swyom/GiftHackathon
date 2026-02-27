import express from 'express';
import { Server } from 'socket.io';
import axios from 'axios';
import http from 'http';
import natural from 'natural';
import dotenv from 'dotenv';
import cors from 'cors'; // Add this import
import pool from './db.js'; // Add this line at the top

dotenv.config(); // load FINNHUB_KEY or other API keys from .env

const app = express();
app.use(cors());        // enable CORS for all routes
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 1. Drastic Event Alert Logic [cite: 19]
const detectDrasticEvent = (headline, sentiment) => {
    const triggers = ['CRASH', 'SURGE', 'COLLAPSE', 'PLUMMET', 'WAR'];
    const hasTriggerWord = triggers.some(word => headline.toUpperCase().includes(word));
    return hasTriggerWord || Math.abs(sentiment) > 0.85;
};

const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");
const tokenizer = new natural.WordTokenizer();

function getMLSentiment(text) {
    const tokens = tokenizer.tokenize(text);
    const score = analyzer.getSentiment(tokens);

    if (score > 0.2) return { label: 'Bullish', color: 'text-green-400', score };
    if (score < -0.2) return { label: 'Bearish', color: 'text-red-400', score };
    return { label: 'Neutral', color: 'text-gray-400', score };
}

// API key can be overridden via environment variable
const API_KEY = process.env.FINNHUB_KEY || 'd6g8pk9r01qt4931vn0gd6g8pk9r01qt4931vn10';

// 2. Fetch & Analyze (Runs every 5 mins) [cite: 12, 19]
async function updateNews() {
    try {
        // Fixed: Used the API_KEY variable instead of "YOUR_KEY"
        const response = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`);

        if (response.data && response.data.length > 0) {
            const latest = response.data[0];
            const analysis = getMLSentiment(latest.headline); // Use real ML score [cite: 45]
            const drastic = detectDrasticEvent(latest.headline, analysis.score);

            if (drastic) {
                // emit same event name frontend is expecting
                io.emit('market_alert', {
                    title: "DRASTIC EVENT DETECTED",
                    message: latest.headline,
                    impact: "High Volatility Expected"
                });
            }
        }
    } catch (err) {
        console.error("Error in updateNews:", err.message);
    }
}

// simple proxy route that returns the latest Nifty 50 quote from Finnhub
// Update the Nifty route to use your actual API_KEY variable
app.get('/api/nifty', async (req, res) => {
    try {
        const resp = await axios.get(`https://finnhub.io/api/v1/quote?symbol=NSEI&token=${API_KEY}`);
        res.json(resp.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD THIS: The frontend news list depends on this route 
app.get('/api/news', async (req, res) => {
    try {
        const response = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`);
        const processedNews = response.data.slice(0, 10).map(item => {
            const analysis = getMLSentiment(item.headline); // Use your ML function 
            return {
                headline: item.headline,
                summary: item.summary,
                sentiment_label: analysis.label, // Matches frontend property
                color: analysis.color
            };
        });
        res.json(processedNews);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

app.get('/trigger-crash', (req, res) => {
    io.emit("market_alert", {
        title: "TEST: MARKET COLLAPSE",
        message: "Nifty 50 has dropped 10% in 1 minute!",
        impact: "High Volatility Expected"
    });
    res.send("Alert sent to frontend!");
});





// GET learning chapters for the Tutorial page
app.get('/api/chapters', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM finance_chapters ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load chapters" });
    }
});

// --- UPDATED LEARNING MODULE ROUTES ---

// 1. GET all available courses for the selection screen
app.get('/api/courses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM finance_courses ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Database Query Error:", err.message);
        res.status(500).json({ error: "Failed to load courses" });
    }
});

// 2. GET chapters specifically linked to a selected course
app.get('/api/courses/:id/chapters', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM finance_chapters WHERE course_id = $1 ORDER BY id ASC',
            [req.params.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to load curriculum" });
    }
});

// 3. GET separate sub-topics (Detailed Theory + Images) for a specific chapter
app.get('/api/chapters/:id/subtopics', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM chapter_subtopics WHERE chapter_id = $1 ORDER BY id ASC',
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Sub-topic error:", err.message);
        res.status(500).json({ error: "Failed to load sub-topics" });
    }
});

// 4. POST user progress to show on the Dashboard
// Updated to use 'topic_id' matching your new database schema
app.post('/api/save-progress', async (req, res) => {
    const { user_id, topic_id, score } = req.body;
    try {
        await pool.query(
            'INSERT INTO user_learning_progress (user_id, topic_id, score) VALUES ($1, $2, $3)',
            [user_id, topic_id, score]
        );
        res.json({ message: "Progress saved!" });
    } catch (err) {
        console.error("Progress Save Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- END UPDATED LEARNING MODULE ROUTES ---


// simple health-check
app.get('/', (req, res) => {
    res.json({ status: 'OK' });
});

setInterval(updateNews, 300000);

// start server with configurable port and handle EADDRINUSE by retrying
let basePort = parseInt(process.env.PORT, 10) || 5000;
const maxAttempts = 5;

function attemptListen(port, attempt = 1) {
    server.listen(port, () => {
        console.log(`Backend running on port ${port}`);
    });

    server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`Port ${port} in use. Trying next port...`);
            if (attempt < maxAttempts) {
                attemptListen(port + 1, attempt + 1);
            } else {
                console.error(`Failed to bind after ${maxAttempts} attempts.`);
                process.exit(1);
            }
        } else {
            console.error('Server error:', err);
            process.exit(1);
        }
    });
}

attemptListen(basePort);
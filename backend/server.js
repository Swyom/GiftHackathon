import express from 'express';
import { Server } from 'socket.io';
import axios from 'axios';
import http from 'http';
import natural from 'natural';
import dotenv from 'dotenv';

dotenv.config(); // load FINNHUB_KEY or other API keys from .env

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 1. Drastic Event Alert Logic
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

// 2. Fetch & Analyze (Runs every 5 mins)
async function updateNews() {
    try {
        const response = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=YOUR_KEY`);
        const latest = response.data[0];

        const sentimentScore = -0.9; 
        const drastic = detectDrasticEvent(latest.headline, sentimentScore);

        if (drastic) {
            io.emit('market_alert', {
                title: "DRASTIC EVENT DETECTED",
                message: latest.headline,
                impact: "High Volatility Expected"
            });
        }
    } catch (err) { 
        console.error(err); 
    }
}

// simple proxy route that returns the latest Nifty 50 quote from Finnhub
app.get('/api/nifty', async (req, res) => {
    try {
        const token = process.env.FINNHUB_KEY || 'YOUR_KEY';
        const resp = await axios.get(`https://finnhub.io/api/v1/quote?symbol=NSEI&token=${token}`);
        // resp.data contains c: current price, h: high, l: low, o: open, pc: previous close
        res.json(resp.data);
    } catch (err) {
        console.error('error fetching nifty quote', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/trigger-crash', (req, res) => {
    io.emit("drastic_alert", {
        title: "TEST: MARKET COLLAPSE",
        msg: "Nifty 50 has dropped 10% in 1 minute!"
    });
    res.send("Alert sent to frontend!");
});

setInterval(updateNews, 300000);

server.listen(5000, () => 
    console.log('Backend running on port 5000')
);
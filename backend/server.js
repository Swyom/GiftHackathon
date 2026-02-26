import express from 'express';
import { Server } from 'socket.io';
import axios from 'axios';
import http from 'http';
import natural from 'natural';

const app = express();
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

// Fixed: Added quotes and removed the broken character at the end
const API_KEY = 'd6g8pk9r01qt4931vn0gd6g8pk9r01qt4931vn10'; 

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
                // Fixed: Ensure the event name matches what your frontend listens to
                io.emit('drastic_alert', {
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

app.get('/api/news', async (req, res) => {
    try {
        const response = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`);
        
        const newsData = response.data.slice(0, 5).map(item => {
            const analysis = getMLSentiment(item.headline); // Applied real ML logic [cite: 45]
            return {
                headline: item.headline,
                summary: item.summary,
                sentiment: analysis.label,
                color: analysis.color,
                score: analysis.score
            };
        });

        res.json(newsData);
    } catch (error) {
        res.status(500).send("Error fetching news");
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
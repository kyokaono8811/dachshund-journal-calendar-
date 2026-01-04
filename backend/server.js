const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (for development)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

const HF_API_TOKEN = process.env.HF_API_TOKEN;
console.log("HF token loaded:", !!HF_API_TOKEN);
const HF_API_URL = "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment-latest";

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.post('/api/analyze-sentiment', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        
        console.log('Analyzing sentiment for:', text.substring(0, 50) + '...');
        
        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: text })
        });

        if (!response.ok) {
            throw new Error(`HuggingFace API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (result && result[0] && result[0].length > 0) {
            console.log('✅ Sentiment result:', result[0][0]);
            res.json({
                label: result[0][0].label.toUpperCase(),
                score: result[0][0].score
            });
        } else {
            res.status(500).json({ error: 'Unexpected response format' });
        }
    } catch (error) {
        console.error('❌ Sentiment analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze sentiment' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('CORS enabled for all origins');
});
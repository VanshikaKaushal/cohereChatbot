const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await cohere.generate({
      model: 'command-light',
      prompt: userMessage,
      maxTokens: 100,
      temperature: 0.9,
    });

    const reply = response.generations[0].text.trim();
    res.json({ response: reply });

  } catch (err) {
    // Send valid JSON back to frontend even on error
    res.status(500).json({ response: "Something went wrong with Cohere. Please try again." });
  }
});

app.listen(3000, () => {
  console.log(' Server running on http://localhost:3000');
});

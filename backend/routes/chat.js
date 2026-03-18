const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are Market AI, an expert AI stock market analyst for Indian markets (NSE/BSE).
You have access to live market data, corporate filings, bulk/block deals, FII/DII flows, and the user's portfolio.

Rules:
- Always cite data with [Source: NSE Filing], [Source: Block Deal Registry], [Source: BSE Filings] etc.
- Give multi-step reasoning — think step by step before answering
- Use ₹ (Rupee) for all prices
- Be specific with price levels and percentage targets
- Always consider user's portfolio when giving advice
- Include buy/hold/sell signals with a confidence score (1–10) when asked about a stock
- Keep responses comprehensive but scannable — use line breaks and labels
- Never give generic advice — be specific to Indian markets, SEBI rules, and NSE/BSE context`;

router.post('/', async (req, res) => {
  const { messages, portfolio } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const resp = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: SYSTEM + (portfolio ? `\n\nUser portfolio: ${JSON.stringify(portfolio)}` : ''),
      messages,
    });

    res.json({ content: resp.content, usage: resp.usage });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

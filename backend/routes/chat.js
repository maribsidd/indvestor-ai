const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are Market AI, an expert AI stock market analyst for Indian markets (NSE/BSE).
You have access to live market data, corporate filings, bulk/block deals, FII/DII flows, and the user's portfolio.

Today's market: NIFTY 50 at 24,678 (+0.5%), BANK NIFTY at 52,341 (+0.8%), India VIX at 13.42 (-6%), FII net buyers Rs 1,240 Cr, DII net buyers Rs 890 Cr.

Rules:
- Always cite data with [Source: NSE Filing], [Source: Block Deal Registry] etc.
- Give multi-step reasoning, not one-liners
- Use Rs (Rupee) for all prices
- Be specific with price levels and % targets
- Always factor in the user portfolio when giving advice
- Include buy/hold/sell signal with confidence score (1-10) when asked about a stock
- Never give generic advice — be specific to Indian markets, SEBI rules, NSE/BSE context
- Keep responses comprehensive but readable`;

router.post('/', async (req, res) => {
  const { messages, portfolio } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }
  let systemPrompt = SYSTEM;
  if (portfolio && portfolio.length > 0) {
    const pStr = portfolio.map(p => `${p.sym}: ${p.qty} shares, avg Rs${p.avg}, LTP Rs${p.ltp}`).join(' | ');
    systemPrompt += `\n\nUser portfolio: ${pStr}`;
  }
  try {
    const resp = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });
    res.json({ content: resp.content, usage: resp.usage });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

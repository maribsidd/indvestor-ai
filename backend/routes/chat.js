const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const client = new Groq({ apiKey: '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' });

const SYSTEM = `You are Market AI, an expert AI stock market analyst for Indian markets (NSE/BSE).
Today's market: NIFTY 50 at 24,678 (+0.5%), BANK NIFTY at 52,341 (+0.8%), India VIX at 13.42.
Rules: cite sources, give multi-step reasoning, use Rs for prices, be specific to Indian markets.`;

router.post('/', async (req, res) => {
  const { messages, portfolio } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }
  let system = SYSTEM;
  if (portfolio) {
    system += '\nUser portfolio: ' + portfolio.map(p => `${p.sym} ${p.qty} shares avg Rs${p.avg}`).join(', ');
  }
  try {
    const resp = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [{ role: 'system', content: system }, ...messages],
    });
    res.json({ content: [{ type: 'text', text: resp.choices[0].message.content }] });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
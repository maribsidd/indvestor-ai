const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// GET /api/patterns/:symbol — detect patterns for a stock
router.get('/:symbol', async (req, res) => {
  const { symbol } = req.params;

  // In production: fetch real OHLCV data from NSE API or a data provider
  // e.g. https://www.nseindia.com/api/chart-databyindex?index=RELIANCE&indices=false
  // For demo: simulated OHLCV
  const ohlcv = generateMockOHLCV(symbol);

  try {
    const prompt = `You are a technical analysis AI. Analyse this OHLCV data for NSE stock ${symbol} and detect chart patterns.

OHLCV (last 30 days, newest last):
${ohlcv.map(d => `${d.date}: O=${d.o} H=${d.h} L=${d.l} C=${d.c} V=${d.v}`).join('\n')}

Return JSON only (no markdown):
{
  "patterns": [
    {
      "name": "pattern name",
      "type": "bullish|bearish|neutral",
      "confidence": 0-100,
      "description": "plain English explanation of what you see",
      "target": "price target",
      "stopLoss": "stop loss level",
      "historicalWinRate": 0-100,
      "timeframe": "expected move timeframe"
    }
  ],
  "keyLevels": {
    "strongResistance": "price",
    "weakResistance": "price",
    "currentPrice": "price",
    "strongSupport": "price",
    "weakSupport": "price"
  },
  "indicators": {
    "rsi": {"value": 0, "signal": "text"},
    "macd": {"value": "text", "signal": "text"},
    "trend": "bullish|bearish|sideways",
    "volumePattern": "text"
  },
  "summary": "2-sentence plain English summary of the technical picture"
}`;

    const resp = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    });

    let analysis;
    try {
      analysis = JSON.parse(resp.content[0].text);
    } catch {
      analysis = { error: 'Could not parse pattern analysis', raw: resp.content[0].text };
    }

    res.json({ symbol, analysis, ohlcv, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Pattern error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Simulates OHLCV data — replace with live NSE API in production
function generateMockOHLCV(symbol) {
  const basePrice = {
    RELIANCE: 2900, TCS: 3780, HDFCBANK: 1660, INFOSYS: 1510,
    ICICIBANK: 1270, BAJAJFINSV: 1790, ADANIPORTS: 1390,
  }[symbol] || 1000;

  const data = [];
  let price = basePrice * 0.95;
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const d = date.toISOString().split('T')[0];
    const chg = (Math.random() - 0.46) * price * 0.02;
    const o = parseFloat(price.toFixed(2));
    price = Math.max(price + chg, basePrice * 0.85);
    const c = parseFloat(price.toFixed(2));
    const h = parseFloat((Math.max(o, c) * (1 + Math.random() * 0.008)).toFixed(2));
    const l = parseFloat((Math.min(o, c) * (1 - Math.random() * 0.008)).toFixed(2));
    const v = Math.floor(500000 + Math.random() * 2000000);
    data.push({ date: d, o, h, l, c, v });
  }
  return data;
}

module.exports = router;

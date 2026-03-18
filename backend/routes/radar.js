const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// In production: replace with live NSE/BSE filing API calls
// e.g. NSE Corporate Filing API, BSE API, or a data provider like Tickertape/Screener
const MOCK_FILINGS = [
  {
    stock: 'BAJAJFINSV', exchange: 'NSE', type: 'insider_trade',
    raw: 'CFO purchased 14,200 shares at ₹2,958 on 18-Jan-2025 via secondary market',
    timestamp: new Date().toISOString()
  },
  {
    stock: 'RELIANCE', exchange: 'NSE', type: 'bulk_deal',
    raw: 'GIC Singapore acquired 8,20,000 shares at ₹2,910 via block deal on 19-Jan-2025',
    timestamp: new Date().toISOString()
  },
  {
    stock: 'HDFCBANK', exchange: 'NSE', type: 'quarterly_filing',
    raw: 'Q3 FY25: Gross NPA 1.26% vs 1.42% prev quarter. MD commentary: comfortable capital adequacy, loan book expansion confidence',
    timestamp: new Date().toISOString()
  },
  {
    stock: 'ADANIPORTS', exchange: 'NSE', type: 'regulatory',
    raw: 'SEBI clarification notice on ₹1,420 Cr related-party transactions in Q2 FY25 filing',
    timestamp: new Date().toISOString()
  },
];

// GET /api/radar/signals — returns AI-analysed signals
router.get('/signals', async (req, res) => {
  const { category = 'all' } = req.query;
  let filings = MOCK_FILINGS;
  if (category !== 'all') {
    filings = filings.filter(f => f.type === category);
  }

  try {
    // Batch-analyse filings with Claude
    const prompt = `You are a market signal detector. Analyse these NSE/BSE events and for each one return a JSON array:
[{
  "stock": "...",
  "type": "...",
  "signal": "STRONG BUY | BUY | WATCH | RISK FLAG | NEUTRAL",
  "confidence": 0-100,
  "title": "short compelling title (max 12 words)",
  "summary": "2-sentence analysis",
  "action": "specific recommended action with price level"
}]

Events:
${filings.map((f, i) => `${i + 1}. ${f.stock} (${f.type}): ${f.raw}`).join('\n')}

Return ONLY the JSON array. No markdown.`;

    const resp = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    });

    let signals;
    try {
      signals = JSON.parse(resp.content[0].text);
    } catch {
      signals = filings.map(f => ({
        stock: f.stock,
        type: f.type,
        signal: 'WATCH',
        confidence: 60,
        title: `${f.stock} — ${f.type.replace('_', ' ')}`,
        summary: f.raw,
        action: 'Monitor for further developments.'
      }));
    }

    res.json({ signals, count: signals.length, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Radar error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/radar/analyse — deep-analyse a specific signal
router.post('/analyse', async (req, res) => {
  const { stock, event, context } = req.body;
  if (!stock || !event) return res.status(400).json({ error: 'stock and event required' });

  try {
    const resp = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 800,
      system: 'You are a senior equity analyst specialising in Indian markets. Provide deep, specific analysis.',
      messages: [{
        role: 'user',
        content: `Deep analyse this market event for ${stock}: "${event}". ${context ? `Context: ${context}` : ''}
        
        Give:
        1. What this means for the stock short-term (2-4 weeks)
        2. What this means long-term (6-12 months)  
        3. Historical precedent for this type of event
        4. Specific entry zone, target, and stop-loss
        5. Risk factors to watch`
      }]
    });

    res.json({ analysis: resp.content[0].text, stock, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

const SIGNALS = [
  {stock:'BAJAJFINSV',type:'insider',signal:'STRONG BUY',confidence:82,title:'CFO Accumulation — 2nd Consecutive Month',summary:'CFO purchased 14,200 shares worth Rs 4.2 Cr at Rs 2,958. Second consecutive month of C-suite buying.',action:'Add to watchlist. Confirm with next quarterly result before entry.'},
  {stock:'RELIANCE',type:'bulk',signal:'WATCH',confidence:71,title:'Foreign Fund Accumulates in Block Deal',summary:'GIC Singapore acquired 8.2L shares at Rs 2,910 via block deal. Deal size is 2.4x the 3-month average.',action:'Suitable for medium-term investors. Support at Rs 2,890.'},
  {stock:'HDFCBANK',type:'filing',signal:'ACCUMULATE',confidence:76,title:'NPA Improvement + Guidance Upgrade in Q3 Filing',summary:'Gross NPA fell to 1.26% from 1.42% QoQ. MD commentary signals loan book expansion confidence.',action:'Strong sector. Consider on dips to Rs 1,620.'},
  {stock:'ADANIPORTS',type:'regulatory',signal:'RISK FLAG',confidence:34,title:'SEBI Seeks Clarification on Related-Party Transactions',summary:'SEBI issued notice on Rs 1,420 Cr in logistics contracts awarded to Adani group entities.',action:'Reduce exposure or hedge. Monitor for resolution before re-entry.'},
  {stock:'TITAN',type:'mgmt',signal:'POSITIVE',confidence:68,title:'Promoter Commentary Shift: Capex Acceleration',summary:'Board approved 80 new Tanishq outlets with Rs 340 Cr CapEx. Management uses aggressive premiumisation language.',action:'Monitor for entry near Rs 3,380 support. Long-term buy.'},
  {stock:'COALINDIA',type:'bulk',signal:'BUY',confidence:58,title:'LIC Adds to Position — Contra Signal',summary:'LIC added 1.1 Cr shares at Rs 485.50 worth Rs 534 Cr. PSU underperformed Nifty by 8% in 30 days.',action:'Suitable for value investors. Dividend yield 6.2% provides downside buffer.'}
];

router.get('/signals', (req, res) => {
  const { category = 'all' } = req.query;
  const filtered = category === 'all' ? SIGNALS : SIGNALS.filter(s => s.type === category);
  res.json({ signals: filtered, count: filtered.length, timestamp: new Date().toISOString() });
});

router.post('/analyse', (req, res) => {
  const { stock } = req.body;
  const sig = SIGNALS.find(s => s.stock === stock);
  if (!sig) return res.status(404).json({ error: 'Stock not found' });
  res.json({ analysis: sig.summary + ' ' + sig.action, stock, timestamp: new Date().toISOString() });
});

module.exports = router;
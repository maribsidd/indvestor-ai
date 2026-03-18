const express = require('express');
const router = express.Router();

router.get('/:symbol', (req, res) => {
  const { symbol } = req.params;
  const ohlcv = generateOHLCV(symbol);
  res.json({ symbol, ohlcv, timestamp: new Date().toISOString() });
});

function generateOHLCV(symbol) {
  const base = {RELIANCE:2900,TCS:3780,HDFCBANK:1660,INFOSYS:1510,ICICIBANK:1270}[symbol] || 1000;
  const data = [];
  let price = base * 0.95;
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const chg = (Math.random() - 0.46) * price * 0.02;
    const o = parseFloat(price.toFixed(2));
    price = Math.max(price + chg, base * 0.85);
    const c = parseFloat(price.toFixed(2));
    const h = parseFloat((Math.max(o,c) * (1 + Math.random()*0.008)).toFixed(2));
    const l = parseFloat((Math.min(o,c) * (1 - Math.random()*0.008)).toFixed(2));
    data.push({ date: date.toISOString().split('T')[0], o, h, l, c, v: Math.floor(500000 + Math.random()*2000000) });
  }
  return data;
}

module.exports = router;
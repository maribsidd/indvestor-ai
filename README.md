# IndVestor AI

AI intelligence layer for the Indian retail investor. Built for the ET Markets Hackathon.

## What It Does

**Opportunity Radar** — scans corporate filings, insider trades, bulk/block deals, and management commentary shifts. Surfaces missed signals as actionable daily alerts, not summaries.

**Chart Pattern Intelligence** — real-time breakout, reversal, and divergence detection across the NSE universe. Every pattern comes with a plain-English explanation and a backtested win rate for that specific stock.

**Market AI — Next Gen** — portfolio-aware, multi-step market analysis. Ask anything — earnings comparisons, sector rotations, FII/DII flows — and get source-cited, institutional-grade answers powered by Claude.

**AI Market Video Engine** — auto-generates 30–90 sec market update videos from live data. (Backend scaffolded; video rendering pipeline in next release.)

## Stack

- **Frontend** — Vanilla HTML/CSS/JS, no framework, single-file pages
- **Backend** — Node.js + Express
- **AI** — Anthropic Claude API (claude-opus-4-5 for deep analysis, claude-haiku-4-5 for fast batch tasks)
- **Data** — NSE/BSE public APIs (mock data in demo; replace with live feeds)

## Repo Structure

```
indvestor-ai/
├── index.html          Dashboard + market summary
├── radar.html          Opportunity Radar
├── charts.html         Chart Pattern Intelligence
├── chat.html           Market AI chat
└── backend/
    ├── server.js       Express server
    ├── package.json
    ├── .env.example
    └── routes/
        ├── chat.js     AI chat proxy
        ├── radar.js    Signal detection
        └── patterns.js Pattern analysis
```

## Setup

**Frontend only (no backend required for demo):**
```
open index.html
```
The chat page calls the Anthropic API directly from the browser for demo purposes.

**Full backend:**
```bash
cd backend
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm install
npm start
```
Server runs on `http://localhost:3000`.

**Swap in live NSE data:**
- Replace mock OHLCV in `backend/routes/patterns.js` with NSE chart API
- Replace mock filings in `backend/routes/radar.js` with BSE/NSE corporate filing feeds
- NSE public API base: `https://www.nseindia.com/api/`

## GitHub

```bash
git init
git add .
git commit -m "feat: IndVestor AI — ET Markets hackathon build"
git remote add origin https://github.com/maribsidd/indvestor-ai.git
git push -u origin main
```

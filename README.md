# IndVestor AI

> AI intelligence layer for India's 14 crore+ retail investors.  
> Built for the ET Markets GenAI Hackathon 2025.

**Live Demo** → [maribsidd.github.io/indvestor-ai/login.html](https://maribsidd.github.io/indvestor-ai/login.html)

---

## The Problem

India has 14 crore+ demat accounts. 90% of retail investors lose money. Not because markets are hard — because the tools are wrong. Most platforms show raw data and leave investors to figure out what it means. No signal detection. No plain-English explanations. No AI that understands Indian market context.

IndVestor AI is the intelligence layer that sits on top of that data and tells you what to do with it.

---

## Modules

### 📡 Opportunity Radar
Continuously monitors NSE/BSE corporate filings, quarterly results, bulk and block deals, insider trades, and management commentary shifts. Surfaces missed opportunities as daily alerts. Not a summariser — a signal-finder.

### 📊 Chart Pattern Intelligence
Real-time breakout, reversal, support/resistance, and divergence detection across the NSE universe. Every detected pattern includes a plain-English explanation and a backtested win rate for that specific stock.

### 🤖 Market AI — Next Gen
Portfolio-aware, multi-step AI analyst powered by LLaMA 3.3 70B via Groq. Ask anything — earnings comparisons, FII/DII flows, sector rotation, buy/sell decisions — and get source-cited, institutional-grade answers that factor in your actual holdings and average price.

### 🎬 AI Market Video Engine
Auto-generates 30–90 second market update videos from live data — daily wraps, FII/DII flow visualisations, IPO trackers, sector race charts. Zero human editing required. *(Backend scaffolded — video rendering pipeline in next release.)*

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML · CSS · Vanilla JS |
| Backend | Node.js · Express |
| AI | Groq API — LLaMA 3.3 70B Versatile |
| Deployment | GitHub Pages (frontend) · Render (backend) |
| Data | NSE/BSE Public APIs (mock in demo — live integration ready) |

---

## Structure

```
indvestor-ai/
├── index.html          Dashboard — market summary, signals, module nav
├── login.html          Onboarding — user profile, experience, investment style
├── radar.html          Opportunity Radar — filterable signals with detail drawer
├── charts.html         Pattern Intelligence — stock list + full technical analysis
├── chat.html           Market AI Chat — portfolio-aware AI analyst
├── nav.js              Shared auth guard + profile dropdown
├── favicon.svg         Brand icon
├── start.bat           One-click local startup (Windows)
└── backend/
    ├── server.js       Express server with CORS
    ├── package.json
    ├── .env.example
    └── routes/
        ├── chat.js     AI chat — Groq API proxy
        ├── radar.js    Signal feed
        └── patterns.js OHLCV pattern data
```

---

## Local Setup

**Prerequisites:** Node.js v18+

```bash
git clone https://github.com/maribsidd/indvestor-ai.git
cd indvestor-ai/backend
cp .env.example .env
# Add your GROQ_API_KEY to .env
npm install
node server.js
```

Open `login.html` with Live Server (VS Code extension) or any local server.

Backend runs on `http://localhost:3000`. Frontend on `http://127.0.0.1:5500`.

Or on Windows — double-click `start.bat`.

---

## Connecting Live NSE Data

The demo uses mock signal data. To connect live feeds:

- **OHLCV data** — replace mock in `backend/routes/patterns.js` with NSE chart API: `https://www.nseindia.com/api/chart-databyindex`
- **Corporate filings** — NSE filing API or BSE corporate announcements feed
- **Bulk deals** — `https://www.nseindia.com/api/block-deal`

---

## Built By

**Marib** — independent builder, AI/ML focus.  
GitHub: [maribsidd](https://github.com/maribsidd)

---

*IndVestor AI*

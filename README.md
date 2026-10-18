# DiveFund

DiveFund is a game that teaches beginners how ETF investing works. You pick a sample bank account, see how much you could invest each month, then build a portfolio one "depth level" at a time. Each level teaches one idea (what an ETF is, risk and bonds, fees, active vs passive, diversification). On each level you adjust your mix with sliders, see how it grows over time and how much fees quietly take, and finish with a short quiz. A friendly AI "Dive Guide" answers questions along the way. Built for Technica 2026, theme "Dare to Dive". All funds are fictional and all numbers are a simulation, not advice.

## Why we built it

Investing is intimidating for first-timers. Most tools assume you already know the words. Fees are invisible until they've cost you thousands. We wanted something that lets you play with the ideas safely and see the fee effect with your own eyes.

## How to run it

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

It works with no API keys, using sample data. Two optional keys turn on the live services:

- `NESSIE_API_KEY` uses Capital One's Nessie sandbox bank. It's free from the Nessie site (log in with GitHub).
- `GEMINI_API_KEY` turns on the live AI guide. It's free from Google AI Studio.

Run the tests with `npm test`.

## How it's organized

- `app/` holds the pages: welcome, connect (pick a sample account), `dive/[level]` (the game loop), and summary.
- `app/api/` holds the server routes for funds, Nessie, and the guide. API keys only live here.
- `components/` holds the UI pieces (sliders, chart, quiz, chat panel).
- `lib/simulate.ts` does the portfolio math (growth, fees, fee drag).
- `lib/game.ts` tracks XP, badges, and level unlocking, saved in localStorage.
- `lib/guide/` is the AI guide: a small interface, a Gemini implementation, and an offline one that uses scripted answers.
- `data/` holds the fictional funds, level content, suggested questions and answers, and quiz fallbacks.

## How the math works

1. We blend each fund's assumed yearly return and fee, weighted by your allocation.
2. We grow the balance month by month, adding your monthly contribution each time.
3. We run that twice, once with fees taken out and once without.
4. The gap between the two runs is the fee drag, shown shaded on the chart.

Returns are fixed assumptions per asset class, not real market data.

## The AI guide

The guide has a written persona and knows your current level and portfolio. It suggests questions for each level and answers in plain language. If Gemini isn't configured or fails, it switches to scripted answers so the app keeps working. It never gives personal financial advice.

## What's fictional

Every fund name and number is made up. The bank data comes from Capital One's Nessie sandbox or our own sample file. Nothing here is a recommendation.

## Team

Built by Avanish Poudyal, Prajwal Shrestha, and Shemmy Taiwo at Technica 2026.

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

### Core 3D, Motion & Spatial Dependencies

To install or update the spatial WebGL and motion libraries required for the **DiveFund** experience, run:

```bash
npm install three @types/three @react-three/fiber @react-three/drei framer-motion
```

Then open [http://localhost:3000](http://localhost:3000).

It works with no API keys, using sample data. Two optional keys turn on the live services:

- `NESSIE_API_KEY` uses Capital One's Nessie sandbox bank. It's free from the Nessie site (log in with GitHub).
- `GEMINI_API_KEY` turns on the live AI guide. It's free from Google AI Studio.

Run the tests with `npm test`.

---

## Architecture & Troubleshooting Guide (Next.js 16 + React 19 + R3F)

### 1. Next.js 16 Client Component Configuration (`"use client"`)
- Three.js (`three`), `@react-three/fiber`, `@react-three/drei`, and `framer-motion` rely on browser-only DOM, WebGL (`HTMLCanvasElement`), and `window` APIs.
- Every file that mounts a `<Canvas>`, uses R3F hooks (`useFrame`, `useThree`), or binds Framer Motion scroll/spring hooks (`useScroll`, `useSpring`, `useTransform`) **must** declare `'use client'` on line 1.

### 2. Dynamic Server-Side Rendering Safeguards (`ssr: false`)
- To prevent hydration mismatches or `ReferenceError: window is not defined` during Next.js 16 Server-Side Rendering, heavy background WebGL scenes (`OceanBiomeEnvironment.tsx` and `SimpleMaritimeArtifact.tsx`) are dynamically imported with `ssr: false`:
  ```tsx
  const OceanBiomeEnvironment = dynamic(
    () => import('@/components/landing/OceanBiomeEnvironment').then((m) => m.OceanBiomeEnvironment),
    { ssr: false }
  )
  ```
- For the 5.5-second Captain Silas intro sequence (`DiverPlungeLoader.tsx`), `HomePage` tracks an explicit `const [showIntro, setShowIntro] = useState(true)` guard that locks scrolling (`document.body.style.overflow = 'hidden'`) while active and **completely unmounts** `<DiverPlungeLoader />` (`setShowIntro(false)`) and resets `document.body.style.overflow = 'unset'` the moment the 5.5-second sequence finishes.

### 3. Browser Security Autoplay Audio Constraints
- Modern browsers block unmuted `<audio>` playback until the user interacts with the page (`NotAllowedError: play() failed because the user didn't interact with the document first`).
- `components/audio/AudioSystem.tsx` initializes the local `/audio/ambient-dive.mp3` loop in a **muted** state with a subtle volume cap (`audio.volume = 0.08`).
- A one-time global interaction listener (`pointerdown` / `keydown`) safely unmutes and starts playback on the user's first click or tap, and users can toggle sound at any time via the navbar `<AudioToggle />` wave button.

### 4. Standard Asset File Paths
In Next.js App Router, static files inside `public/` are served from the root URL path (`/`):
- **Ambient Audio Loop**: Place your MP3 file at `public/audio/ambient-dive.mp3` (referenced in code as `/audio/ambient-dive.mp3`).
- **Custom Brand Logo**: Place your logo image at `public/images/divefund-logo.png` (referenced in `components/site-header.tsx` inside the `<!-- INSERT USER LOGO HERE -->` wrapper as `/images/divefund-logo.png`).
- **Step Illustrations**: Located at `public/images/step-connect.png`, `public/images/step-learn.png`, and `public/images/step-dive.png`.

---

## How it's organized

- `app/` holds the pages: welcome (`app/page.tsx`), connect (pick a sample account), `dive/[level]` (the game loop), and summary.
- `app/api/` holds the server routes for funds, Nessie, and the guide. API keys only live here.
- `components/landing/` holds the 3D WebGL components:
  - `DiverPlungeLoader.tsx` — 5.5s Captain Silas wide-angle descent with abyssal bioluminescent helmet glow.
  - `OceanBiomeEnvironment.tsx` — Living deep-sea biome with marine snow, swimming fish silhouettes, and the abyssal bioluminescent anglerfish.
  - `SimpleMaritimeArtifact.tsx` — Tactile matte diving helmet, admiralty anchor, and brass pocket compass profile meshes.
  - `SpatialTiltCard.tsx` — 1200px CSS 3D perspective and hover elevation wrapper.
- `components/audio/AudioSystem.tsx` — Autoplay-safe `0.08`-volume local MP3 audio provider and navbar wave toggle.
- `components/route-transition.tsx` — Kinetic route transition provider with dark-indigo caustic mask.
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

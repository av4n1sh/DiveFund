# DiveFund

Open the website here: [https://divefund.netlify.app/](https://divefund.netlify.app/).

DiveFund is an ocean-themed game that teaches beginners how ETF investing works. Build a portfolio from eight fictional funds, compare growth with and without fees, and complete five lessons with Atlas, the Dive Guide. Built for Technica 2026, theme "Dare to Dive". All projections are educational simulations, not financial advice.

We built it because investing tools often assume you already know the vocabulary, and fees are easy to overlook. DiveFund lets you experiment safely and see those costs over time.

## Run locally

Use Node.js 24.x and pnpm 12.3.4, the package manager declared in `package.json`. Next.js itself supports Node 20.9+, but the installed Vitest 5 test runner requires a newer runtime; Node 24 works for both.

From the repository root:

```sh
npm install --global pnpm@12.3.4
pnpm install --frozen-lockfile
pnpm dev --port 3001
```

Open [http://localhost:3001](http://localhost:3001) to use the local demo. These commands explicitly select port **3001**. Keep the terminal open; press Ctrl+C to stop it. The 3D, animation, and UI dependencies are already included in `package.json`.

On Windows PowerShell, use the `.cmd` commands if script execution policy blocks `npm` or `pnpm`:

```powershell
npm.cmd install --global pnpm@12.3.4
pnpm.cmd install --frozen-lockfile
pnpm.cmd dev --port 3001
```

An npm lockfile is also checked in. If you already use npm, run:

```sh
npm ci
npm run dev -- --port 3001
```

In Windows PowerShell:

```powershell
npm.cmd ci
npm.cmd run dev -- --port 3001
```

If dependencies are already installed, just run the dev command. If the app is already running on port 3001, open [http://localhost:3001](http://localhost:3001) directly. If startup reports that port 3001 is in use, check the terminal running your existing demo before starting another server.

The `dev` script itself remains `next dev`; running it without the port argument uses Next.js's default port 3000, which may fall back to another available port. Use the explicit commands above to request 3001. Keep dependency changes consistent with the package manager you use; do not regenerate both lockfiles incidentally.

## Optional services

No environment file or API keys are required to try the app with sample data and scripted guide responses. To enable external services, copy `.env.example` to `.env.local` and fill in the values you need:

```sh
cp .env.example .env.local
```

PowerShell equivalent:

```powershell
Copy-Item .env.example .env.local
```

Do not overwrite an existing `.env.local` containing your keys. Restart the dev server after changing environment variables.

| Variable | Behavior |
| --- | --- |
| `NESSIE_API_KEY` | Enables Capital One Nessie sandbox customers, account activity, and practice withdrawals. Missing credentials or failed requests use sample data or a mocked transfer. |
| `GEMINI_API_KEY` | Enables Gemini-backed Atlas chat, portfolio insights, quizzes, and summary lessons. Missing credentials or failed generation use scripted or deterministic fallbacks. |
| `GEMINI_MODEL` | Overrides the model used by `lib/ai.ts`; the code default is `gemini-2.5-flash`. |

Keep keys server-side in `.env.local`; do not prefix them with `NEXT_PUBLIC_` or commit them. The default Gemini model above describes the code configuration, not a guarantee of external model availability.

Nessie is a sandbox: no real money moves. With a key and a valid sandbox account ID, **Lock in this month** sends a withdrawal request to that sandbox account. A mocked surplus display can still retain a sandbox account ID when that account has no recent activity, so the display's sample-data status alone does not determine whether a lock-in is mocked. Without a key or account ID, the transfer is mocked.

Sample mode avoids the bank and AI services, but is not a fully offline bundle: `next/font/google` fetches fonts during builds, and the intro uses a Drei environment preset that can load an external asset.

## Play through a dive

- On `/`, choose a crew member to jump into level 1 with a sample profile and a $150 monthly contribution, or use `/connect` to choose a practice customer and review their surplus.
- `/connect` reads six months of sandbox activity when available, otherwise sample data. Its starting contribution is 25% of the monthly surplus, rounded to $5 and limited to $25-$1,000; you can adjust it before continuing.
- On `/dive/1` through `/dive/5`, read the lesson, adjust fund sliders or use Cautious/Balanced/Bold presets, and compare projections. The contribution slider ranges from $10-$1,000 per month and the horizon from 5-40 years. The game-state setter and guide context accept contributions up to $5,000.
- Lock in at least once at each depth to enable its three-question quiz. Get at least two answers correct to pass and unlock the next depth. Earn XP, streaks, and badges along the way.
- Ask Atlas about the current lesson and portfolio. The guide has a resizable desktop panel, a mobile sheet, suggested questions, and contextual tips about progress, unlocked funds, and fees.
- `/summary` shows your dive log, final mix, projections, badges, and generated or fallback lessons. The header offers Beginner/Advanced explanations, ambience controls, and a progress reset.

| Depth | Lesson | Newly unlocked funds |
| --- | --- | --- |
| 1: The Shallows | What is an ETF? | Reef 500 Index, Open Ocean Total Market |
| 2: The Reef | Risk and bonds | Kelp Forest Bond Fund, Tidepool Treasury Fund |
| 3: Kelp Forest | Expense ratios | Far Waters International |
| 4: Open Ocean | Active vs passive | Deep Trench Tech, Current Rider Active Growth |
| 5: The Trench | Diversification and time | Coral Small Cap |

Progress is saved in browser localStorage under `divefund:v1`. Chat history and panel preferences use the separate `divefund:guide:v1` key. Resetting game progress does not clear chat history; use **Clear chat** in the guide to clear messages. There is no account sign-in or database-backed progress sync.

## Development commands

| Command | Purpose |
| --- | --- |
| `pnpm dev --port 3001` | Start the Next.js development server on port 3001. |
| `pnpm test` | Run Vitest tests matching `lib/**/*.test.ts` (currently the simulation tests). |
| `pnpm exec tsc --noEmit` | Check TypeScript separately. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Serve a completed production build. |

For npm, use `npm run <script>` (or `npm test`) and `npx tsc --noEmit`. In PowerShell, use `npm.cmd`/`npx.cmd` if needed. There is no lint script configured.

`next.config.mjs` currently sets `typescript.ignoreBuildErrors: true`, so a successful build does **not** establish that TypeScript passes. It also disables image optimization. Run the standalone type check when validating code changes. Production uses server API routes; this is not a static-export-only app.

## Code map

The stack is Next.js 16.4 App Router, React 19, TypeScript, Tailwind CSS 4, Base UI components, SWR, Recharts, Three.js/React Three Fiber/Drei, and Framer Motion. Imports beginning with `@/` resolve from the repository root.

| Path | Responsibility |
| --- | --- |
| `app/` | Landing, connect, dynamic dive, and summary pages; root layout and global styles. |
| `app/api/` | Funds, Nessie sandbox, and guide route handlers. |
| `components/game-provider.tsx` | React game state, storage hydration, simulation, and player actions. |
| `components/dive/`, `components/connect/`, `components/summary/` | Main game screens and their controls. |
| `components/guide/` | Guide history, contextual tips, panel state, and responsive layout. |
| `components/landing/` | Underwater scenes, artifacts, crew visuals, and the active plunge loader. |
| `components/audio/AudioSystem.tsx` | Ambient audio provider and toggle. |
| `components/route-transition.tsx` | Animated navigation via `useDepthTransition`. |
| `lib/simulate.ts` | Deterministic portfolio projection and fee-drag calculation. |
| `lib/allocation.ts`, `lib/presets.ts`, `lib/game.ts` | Allocation balancing, presets, progress migration, XP, and badges. |
| `lib/ai.ts`, `lib/guide/` | Server-only Gemini client and Atlas chat providers/matching. |
| `lib/guide-context.ts`, `hooks/use-guide-context.ts` | Structured guide input, server descriptions, client context, and request helpers. |
| `lib/nessie.ts` | Server-only Nessie fetch helper with a five-second timeout. |
| `data/` | Fictional funds, lessons, glossary, persona, scripted answers, quiz fallbacks, and sample bank data. |
| `public/` | Logo, step images, hero image, and ambient MP3 served from root URL paths. |

### API routes

| Method and route | Input and result |
| --- | --- |
| `GET /api/funds` | Returns the fictional fund catalog. |
| `GET /api/nessie/customers` | Returns sandbox or sample customers with `mocked`. |
| `GET /api/nessie/surplus?customerId=...` | Returns an account ID, six monthly activity buckets, averages, surplus, and `mocked`. |
| `POST /api/nessie/invest` | Takes `{ accountId, amount }`; returns `{ ok, mocked }` for a practice withdrawal. |
| `POST /api/guide/chat` | Takes `{ messages, gameState }`; returns `{ reply, provider }`, where provider is `gemini` or `mock`. |
| `POST /api/guide/insight` | Takes a guide context; returns `{ insight: { holding, risk, consider }, fallback }`. |
| `POST /api/guide/quiz` | Takes a guide context; returns `{ questions, fallback }` with three multiple-choice questions. |
| `POST /api/guide/summary` | Takes `{ context, levelsCompleted, badges }`; returns `{ lessons, fallback }`. |

The shared guide context contains `level`, `mode`, `monthlyContribution`, `horizonYears`, and percentage `allocation`; its Zod schema is in `lib/guide-context.ts`. Chat uses a different, richer game-state snapshot defined in `lib/guide/types.ts` and built in `lib/guide/game-state.ts`. POST handlers validate inputs with Zod and return HTTP 400 for invalid request bodies.

Chat uses the Atlas persona in `data/guidePersona.ts` and falls back through `lib/guide/mock.ts` and `lib/guide/match.ts`. Insight, quiz, and summary routes request JSON through `geminiObject`, validate generated output with Zod, and fall back to `data/fallbacks.ts`. Gemini requests time out after 12 seconds by default; chat allows 15 seconds. These prompts are designed for educational explanations of fictional funds rather than personal financial advice.

## Simulation and persistence

UI allocations are percentages adding to 100. `toWeights` converts them into normalized fractions for `simulate`, which requires the weights to add to 1. Annual returns and expense ratios are stored as fractions.

The simulator blends each fund's assumed annual return and expense ratio by allocation. It converts the annual net return into a monthly rate, grows the balance, then adds the contribution at the end of each month. A second balance uses the same assumed returns without fees. Both start at zero; yearly points feed the charts. Their ending-value difference is **fee drag**, which includes lost compounding rather than only fees charged.

Returns are fixed assumptions from `data/funds.json`. The volatility label is a weighted category score, not a stochastic forecast. Lock-ins track practice contributions and rewards separately; they do not add a starting balance to the projection.

## Visuals and troubleshooting

- The landing page runs a 5.5-second Captain Silas plunge intro from `components/landing/DiverPlungeLoader.tsx`. Captain Silas is the intro character; Atlas is the learning guide. `components/DiverPlungeLoader.tsx` is a compatibility re-export.
- `app/page.tsx` loads `OceanBiomeEnvironment` by its default export and `SimpleMaritimeArtifact` by its named export with `next/dynamic` and `ssr: false`. Keep these imports in a Client Component. Browser state, animation hooks, and WebGL rendering require the appropriate client boundary.
- The active loader locks scrolling until completion and cleans up its animation lifecycle. If changing it, verify that the intro unmounts and page scrolling returns.
- The ambient loop at `public/audio/ambient-dive.mp3` starts muted; interaction attempts playback at volume `0.08`. Use the header toggle to mute or unmute. Browser autoplay rules may delay sound until an interaction.
- The logo lives at `public/images/divefund-logo.png`; step images are `step-connect.png`, `step-learn.png`, and `step-dive.png` in the same folder. Public assets are referenced as `/images/...` or `/audio/...`.
- If external services fail, inspect terminal messages prefixed with `[guide]` or `[nessie]`. Scripted/fallback results are expected without API keys. If a build cannot fetch Google fonts, check network access.
- Direct dive links redirect to `/connect` until a diver is selected, and redirect to the current unlocked depth if the requested level is still locked. Invalid level numbers return a not-found page.

## Team

Built by Avanish Poudyal, Prajwal Shrestha, and Shemmy Taiwo at Technica 2026.

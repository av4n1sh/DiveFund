<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# DiveFund contributor instructions

## Project and commands

DiveFund is an educational ETF game with five ocean depths, eight fictional funds, and Atlas as the learning guide. Captain Silas is the landing intro character. Keep explanations educational, describe returns as assumed simulation results, and keep real-world investment recommendations out of game content.

- Stack: Next.js 16.4 App Router, React 19, TypeScript, Tailwind CSS 4, Base UI, SWR, Recharts, React Three Fiber/Drei/Three.js, and Framer Motion.
- Use Node.js 24.x for the app and Vitest 5 tests. The package manager declaration is `pnpm@12.3.4`; install with `pnpm install --frozen-lockfile`.
- Commands: `pnpm dev`, `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm build`, and `pnpm start` (after building). No lint script is configured.
- An npm lockfile also exists. If working in an npm installation, use `npm ci`, `npm run dev`, `npm test`, `npx tsc --noEmit`, and `npm run build`. On PowerShell with restricted script execution, call `npm.cmd`, `npx.cmd`, or `pnpm.cmd`.
- Avoid incidental dependency or lockfile changes. For intentional dependency work, keep the chosen package manager's lockfile consistent with `package.json` and explain any remaining lockfile discrepancy.
- Follow nearby code conventions; most application code uses single quotes, no semicolons, and `@/` imports rooted at this directory. Some 3D files use a different style; avoid unrelated formatting churn.

The managed Next.js block above must remain intact. After installing dependencies, consult the relevant bundled `.md` guides under `node_modules/next/dist/docs/` before changing Next.js code. Installation is documented at `01-app/01-getting-started/01-installation.md`; client-only dynamic imports at `01-app/02-guides/lazy-loading.md`. Do not replace version-specific guidance with remembered older Next.js behavior.

## Code ownership map

- `app/layout.tsx` nests `AudioProvider`, `GameProvider`, `GuideStateProvider`, and `RouteTransitionProvider`. The guide consumes game state; preserve that dependency when changing provider placement.
- `app/page.tsx` implements the landing page and sample crew shortcut. `app/connect/page.tsx`, `app/dive/[level]/page.tsx`, and `app/summary/page.tsx` compose the other main screens.
- `components/dive/`, `components/connect/`, and `components/summary/` implement the main flows. `components/guide/` owns chat history, tips, panel preferences, and the desktop/mobile guide UI.
- `components/game-provider.tsx` owns client game state, hydration, projections, and actions. Keep pure progress/reward logic in `lib/game.ts`, allocation rules in `lib/allocation.ts`, presets in `lib/presets.ts`, and portfolio math in `lib/simulate.ts`.
- `data/funds.json` and `data/levels.ts` are the fund and lesson sources of truth. Other `data/` files supply the glossary, persona, scripted answers, fallback content, and mock bank data. Shared game types live in `lib/types.ts`.
- `app/api/guide/` contains chat, insight, quiz, and summary POST handlers. `app/api/nessie/` contains customer/surplus GET handlers and the investment POST handler. `app/api/funds/route.ts` returns the catalog.

## Game and storage invariants

- UI allocations use percentages totaling 100. Rebalancing and presets must respect unlocked funds. `toWeights` converts percentages into normalized fractions; `simulate` requires weights totaling 1. Returns and expense ratios are fractions, not percentages.
- Projections start at zero, compound monthly with contributions at month end, and expose yearly chart points. Fee drag is the ending-value gap against a no-fee projection, including lost compounding. A lock-in tracks rewards/contributions separately from the projected balance.
- Game state is stored under `divefund:v1` with version 1 migration in `lib/game.ts`. Preserve hydration guards and backward compatibility when modifying persistence. The guide separately stores history and panel preferences under `divefund:guide:v1`.
- Game reset does not clear guide messages. Chat clearing is a separate guide action; do not document or implement one as the other without an intentional behavior change.
- The game-state setter and guide context accept $10-$5,000 per month; the build slider exposes $10-$1,000 and the connect slider $25-$1,000. The horizon is 5-40 years. Lock in once at a depth before taking its quiz; two of three correct answers passes. Progress gates are client-side educational UI, not authorization controls.
- `app/dive/[level]/page.tsx` awaits Promise-based route params and calls `notFound()` for invalid levels. `DiveScreen` waits for hydration before redirecting missing divers or locked depths.

## API, AI, and sandbox behavior

- Keep `GEMINI_API_KEY`, optional `GEMINI_MODEL`, and `NESSIE_API_KEY` server-side. Use `.env.example` for variable names and `.env.local` for local values; never expose keys through `NEXT_PUBLIC_` variables or client imports.
- `lib/ai.ts`, `lib/nessie.ts`, `lib/guide/index.ts`, and `lib/guide/gemini.ts` use `server-only` boundaries. Preserve them. No key is needed to use the app with sample bank data and scripted/deterministic guide fallbacks.
- Validate POST bodies with Zod and preserve existing HTTP 400 and response contracts. Chat takes `{ messages, gameState }` and returns `{ reply, provider }`; `provider` is `gemini` or `mock`.
- Chat snapshot types/builders are in `lib/guide/types.ts` and `lib/guide/game-state.ts`; provider selection and fallback are in `lib/guide/index.ts`. Keep Atlas's persona in `data/guidePersona.ts` and scripted question matching/answers in `lib/guide/match.ts` and `data/guideAnswers.ts`.
- Insight and quiz accept the context schema in `lib/guide-context.ts`; summary wraps it as `{ context, levelsCompleted, badges }`. Their structured Gemini output is validated by `geminiObject` in `lib/ai.ts` and falls back through `data/fallbacks.ts`. Preserve `fallback` metadata and the insight fields `holding`, `risk`, and `consider`.
- The code's default Gemini model is `gemini-2.5-flash`. Default AI timeout is 12 seconds; chat uses 15 seconds. Keep graceful fallback behavior when changing integrations and distinguish requested provider from successful external generation.
- Nessie requests have a five-second timeout. Without a key or usable account ID, investment requests are mocked. With both, `/api/nessie/invest` writes a withdrawal to the sandbox. Do not trigger sandbox writes during routine verification unless testing that behavior is part of the authorized task.
- A sample surplus response can retain a sandbox account ID if that account has no recent activity. Do not assume `mocked` surplus means subsequent lock-ins cannot write to Nessie.

## Client visuals and assets

- Keep browser state, effects, animation hooks, and React Three Fiber scenes behind appropriate `'use client'` boundaries. Client Components can still be prerendered; do not access browser globals during server rendering.
- The landing page dynamically imports `OceanBiomeEnvironment` (default export) and `SimpleMaritimeArtifact` (named export) with `ssr: false` from a Client Component. Preserve the export shapes and client-only loading behavior.
- The active 5.5-second intro is `components/landing/DiverPlungeLoader.tsx`. `components/DiverPlungeLoader.tsx` re-exports it for compatibility; other loader/scene files exist, so trace imports before editing a similarly named component. Preserve cleanup, completion callbacks, scroll restoration, and unmounting after the intro.
- `components/audio/AudioSystem.tsx` owns the initially muted ambience loop, interaction-driven playback, and header toggle, with target volume `0.08`. Preserve browser autoplay handling and effect cleanup.
- Static assets live in `public/`: use `/audio/ambient-dive.mp3` and `/images/divefund-logo.png` as URL paths. Fonts use `next/font/google`, and the intro's Drei environment preset can require an external asset; sample mode is not a guarantee of offline rendering.
- Reuse existing UI primitives in `components/ui/`, shared game/guide hooks, and `useDepthTransition` where animated navigation is intended. Preserve keyboard access, responsive guide layout, and non-overlapping desktop panel space.

## Validation and review

- Match checks to the change. For application logic changes, run `pnpm test` and `pnpm exec tsc --noEmit`; run `pnpm build` for changes affecting Next.js integration or production compilation. Vitest currently discovers `lib/**/*.test.ts` and only has simulation coverage; add focused tests for meaningful behavior changes rather than implying API/UI coverage exists.
- `next.config.mjs` has `typescript.ignoreBuildErrors: true`. A passing build is not a substitute for the standalone type check. Image optimization is also disabled; do not change either setting incidentally.
- For UI changes, verify the affected flow in the browser, including hydration, intro completion, scrolling, responsive layout, and guide/audio interactions as relevant. For service changes, verify missing-key/error fallbacks without making unrequested sandbox writes.
- For documentation-only changes, verify paths, scripts, environment names, response shapes, and claims against the code, and run `git diff --check`; a production build is not required solely for prose edits.
- Keep work scoped to the request, preserve existing user changes, and report validation failures or unavailable checks accurately. Update `README.md` when setup, environment variables, routes, or visible behavior change.

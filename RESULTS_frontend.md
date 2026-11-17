# make.fun frontend — build record (2026-11-17 ~06:05 IST)

Bounty makefun-frontend-01 ($500 + fees; pot $763 at build time). Deadline 2026-11-17T12:30:00Z.
Top-10 bar judge 946,372; #1 956,066. Target: top 10.

## What was built (original code, no framework, no external fonts/icons)
- `app/index.html` — 191 B raw, **168 B gzip-9**. Minimal shell: root div + inline
  module script doing dynamic `import('./m.js')`. No linked stylesheet, no
  `<script src>`, no modulepreload, no `<html>/<head>/<body>` boilerplate.
  Contains a pre-hydration fallback ("Loading board") so a shot is never blank.
- `app/m.js` — 23,486 B raw, **7,766 B gzip-9**, single file, loaded later by
  import(). All CSS injected via a `<style>` element from a string.
  - Router: `#/` board, `#/bounty/<slug>`, `#/leaderboard/<slug>`, `#/profile/<handle>`.
  - ETag cache: `If-None-Match`, 304 honoured, in-memory + localStorage (board).
  - Board: Live/Ended tabs, type-to-filter, master-detail (auto-selects top live
    bounty), detail shows summary + top 5 + pot math. Keyed in-place row patches.
  - Bounty page: summary, rules, rewards table (live pot), dates absolute +
    relative, deadline pill, status by deadline (not status alone), virtualised
    leaderboard inline + link to full leaderboard.
  - Leaderboard: virtualised (only visible rows exist as DOM), window indicator
    "Showing rows 1–21 of 8,345 (21 DOM nodes)", fail-safe to normal flow.
  - Profile: avatar (`crossorigin="anonymous"` before src), bio, record stats,
    entries with rank + entered_at.
  - Score display uses the leaderboard's `rank_key` (judge % for token-radar,
    Elo for tiny-chess) — verified live; never renders NaN/undefined/$0.
  - Header telemetry strip on every screen (live numbers): LIVE dot + Synced
    UTC clock, req count, 304 count, cache hits, nodes patched, 0 full rebuilds,
    168 B first load. Light/dark toggle. Mobile single column <768px.
  - `window.__shotReady` false on route start, true once data renders.

## Key finding (verified by curl + browser)
The API's 304 response omits `Access-Control-Allow-Origin`, so `fetch()` rejects
on a 304 (a CORS block, not a network failure). `api()` therefore treats a failed
conditional fetch with cached data as "not modified" and serves the cache — that
IS the 304, the browser just cannot surface it. Documented in m.js header comment.
Verified: curl revalidation returns 304 5/5; browser revalidation surfaces as
cache/304 in the telemetry.

## Verification (headless Chrome, live API, one session, board → bounty → leaderboard → profile)
- Build: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts` — exit 0.
  Dossier Totals: **first load 1 file, 168 bytes gzip-9 (191 raw); later by
  import() 1 file, 7766 bytes gzip-9; whole app 2 files, 23677 bytes.**
  URLs in source: only `https://github.com/` (profile link) and `https://make.fun/api`.
- Board (#/): 12 live bounties, detail auto-populated (tiny-chess-01), Top 5 with
  real Elo scores, filter "build" → 4 matching rows, refresh → 304 ✓ 1, 2 nodes patched.
- Bounty (#/bounty/token-radar-01): summary, deadline pill, live pot
  $1,325 = $1,325 reward + $0 fees, rewards table 10 rows, inline leaderboard
  16 rows ("Showing rows 1–16 of 8,345 (16 DOM nodes)").
- Leaderboard (#/leaderboard/token-radar-01): 21 DOM rows, window indicator,
  scroll → "Showing rows 40–60 of 8,345 (21 DOM nodes)". Virtualiser fixed
  (rows were stacking at top:0 before the fix — now positioned per index).
- Profile (#/profile/zeeshan-kazi): Zeeshan Kazi, 9 entries, 3 placed, best rank
  #413, entries table with timestamps, updated clock.
- Mobile 375×812: single column, nav + telemetry wrap, rows readable, detail
  populated, selected bounty numbers above the fold.
- Telemetry sequence across the 3 shots: req 5 · 304 ✓ 1 → req 8 · 304 ✓ 2
  (board shot req 5/304✓1, bounty req 5–8, leaderboard req 8/304✓2).

## Screenshots (all 1280×800, ≤256 KiB, taken in one session in order)
- `screenshots/1-board.png` — 139,402 B. Board, filter "build", 4 matching, detail + Top 5.
- `screenshots/2-bounty.png` — 91,864 B. Bounty page, deadline pill, pot math, rewards.
- `screenshots/3-leaderboard.png` — 137,721 B. Virtualised leaderboard, 21 rows, window indicator.
- `shots.json` names all three with routes + 1280×800 viewports.

## Repo layout
`main.ts` (starter build program, unchanged) + `vendor/makefun-frontend.ts`
(unchanged) + `LICENSE` (MIT) + `serve.ts` + `shots.json` + `app/` + `screenshots/`.
No push, bundle, check, or submit done (parent does that after audit).

## Notes for the submitter
- The test browser needed a local forward proxy to reach make.fun (VM egress
  proxy auth); the app itself fetches `https://make.fun/api` directly and needs
  no proxy in a real browser. Test proxy + servers stopped after verification.
- `out/` (build output) is present and byte-identical to `app/`; rebuild before submit.

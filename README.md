# make.fun frontend

[![make.fun](https://img.shields.io/badge/make.fun-frontend-blue)](https://make.fun)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A fast, dependency-free web client for [make.fun](https://make.fun) — bounty board, bounty pages, leaderboards and profiles, all on live data.

**First load: 168 bytes gzipped.** The whole app is two files (`index.html` + `m.js`, 23 KB total). No framework, no external fonts or icons.

- Live bounty board with master-detail, type-to-filter, Live/Ended tabs
- Bounty pages with rewards table, live pot, dates and deadlines
- Virtualised leaderboard (only the visible rows exist as DOM)
- Profiles with entries, ranks and stats
- ETag-revalidated cache, keyed in-place row patches, zero full rebuilds
- Light/dark mode, mobile responsive

Built for the [makefun-frontend-01](https://make.fun/competitions/makefun-frontend-01) bounty. Referral code: `XSCZ-RCXQ`.

# v1 vs v2 Website Parity Audit

**Date:** May 8, 2026
**Audited by:** Creative Director + Explore agents
**Reviewed by:** @web-dev (corrected several findings)

## Summary

| Status | Count | Category |
|--------|-------|----------|
| 🟠 Major gap | 1 | Page exists but missing critical features |
| 🟡 Minor gaps | 2 | Pages exist with small differences |
| 🟢 At parity | 9 | Pages fully equivalent or better |
| 🔵 v2-only | 1 | New in v2, no v1 equivalent |
| ⚪ Not audited | 3 | Standalone legacy pages (may be deprecated) |

> **Cleanup:** v1 had a standalone `link.html` link generator page — deleted May 8, 2026 (redundant with `twitch.html` game setup).

---

## Correction Notice

The initial audit incorrectly stated the game setup + link generator was entirely missing from v2. **The v2 `/games` page already has a `LinkGenerator` component** with channel input, theme selector, per-game settings, and live URL generation with copy-to-clipboard. The gap is specific missing settings, not a missing page.

Similarly, the audit incorrectly stated Scores was missing shareable links and Customize was missing coin purchases. Both features already exist in v2.

---

## 🟠 MAJOR GAP — Missing specific settings & features

### 1. Game Setup Settings (v1: `twitch.html` → v2: `/games`)
v2's `/games` page has ~70% of v1's game setup functionality. The **link generator works**, but specific settings are missing:

| Missing v2 Setting | Games Affected | Impact |
|---|---|---|
| Channel Points costs (CP Drop, CP Droplets, CP Queue, CP Per Plink) | Parachute, Plinko | **High** — streamers can't set CP redemption costs |
| Game Ready Delay | Parachute, Plinko | Medium |
| Raid Drop Cost | Parachute | Low |
| Weather effects: Lightning, Rainbow, Sunshine, Leaf costs | Stream Weather | Medium — 4 effects missing config |
| Message Format template | Parachute, Plinko, Giveaway | Medium — custom chat announcements |
| Theme variation checkboxes (multi-color themes) | Cauldron, Valentines, Easter, Pool, Cakes, Giveaway | Medium — v1 lets streamers pick multiple color variants |
| Refresh Token param in generated URL | All | Low |
| Settings persistence (localStorage save/restore) | All | Medium — v1 remembers settings between visits |

### 2. Redeem Page (v1: `redeem.html` → v2: `/redeem`)
v2 redeem is a basic stub. v1 has significantly more:

**Missing from v2:**
- Coupon auto-formatting (4-char groups, PIXELPLUSH prefix handling)
- URL parameter support (`?code=XXXX-XXXX` for shareable redeem links)
- Post-redemption modal with animated item preview
- Auto-activation prompt ("Use now?" Yes/No)
- Auto-apply cosmetic on accept
- Full catalog loaded for item name/preview display

**v2 has:** Input field + button + success/error text. That's it.

### 3. Navigation — Scores & Transactions missing from sidebar
v1 sidebar has direct links to **Top Scores** and **My Shopping History**. In v2, these pages exist but are **buried in the user profile dropdown** in the Header — not in the sidebar. Scores doesn't even require login, yet it's only accessible from the logged-in user menu.

---

## 🟡 MINOR GAPS

### 4. Customize / Market feature overlap
In v1: `customize.html` = equip cosmetics, `market.html` = buy cosmetics. Clear separation.
In v2: Both `/customize` and `/market` independently implement full catalog + search/filter + Stripe + PayPal + coin purchase. They're near-duplicate pages. Not a parity issue — it's a v2 UX decision (deduplicate or differentiate).

### 5. Home / Landing page approach
v1 is a marketing landing page (game carousels, "Add to Stream" buttons). v2 is a dashboard entry point. Different design philosophies — both valid. The v2 `FeaturedStream` component does auto-rotate between live channels (matching v1), so the stream embed is covered.

---

## 🟢 AT PARITY (or v2 is better)

| Page | Notes |
|------|-------|
| **Games / Setup** (`/games`) | Has link generator + per-game settings. ~70% parity, specific settings gaps listed above. |
| **Customize** (`/customize`) | v2 has layered sprite canvas, direction-aware animation, Stripe+PayPal, i18n. Better than v1. |
| **Market** (`/market`) | v2 has Stripe + PayPal, modern grid, 5 coin tiers, i18n. At parity. |
| **Scores** (`/scores`) | v2 has 100+ themes, share URL generation + copy, i18n. At parity. |
| **Transactions** (`/transactions`) | v2 has filter tabs, item name lookups, modern layout. Arguably better. |
| **Status** (`/status`) | v2 has more health checks + live channel count with 30s polling. Better. |
| **Troubleshoot** (`/troubleshoot`) | v2 has 3-endpoint connection tests, token expiry + scopes. At parity. |
| **Login** (`/login`) | Modern OAuth flow. Equivalent. |
| **Credits** (`/credits`) | Sound attribution. Equivalent. |
| **Privacy / Terms** | Static content. Equivalent. |
| **Links** (`/links`) | Social links, banners, game jam games. v2-only page, works well. |

---

## 🔵 v2-ONLY Features (not in v1)

| Feature | Page | Notes |
|---------|------|-------|
| Admin dashboard | `/admin` | Real-time analytics, live sessions, per-game/per-channel breakdowns |
| i18n (5 languages) | All pages | English, French, German, Spanish, Czech |
| Dark mode support | Global | CSS variables |
| Sidebar navigation | Global | Persistent nav with icons |
| Site notices system | Global | `notices.json` → banner alerts |
| Clarity analytics | Global | Microsoft Clarity integration |

---

## ⚪ NOT AUDITED — Standalone legacy pages

These v1 root pages aren't in the page-templates system and may be deprecated:
- `streams.html` — Streams directory (live channels with Twitch embeds). v2 Status page partially covers this.
- `alertoverlay.html` — Alert overlay page
- `hideseek.html` — Hide & seek game page

---

## Priority Ranking

| Priority | Gap | Effort | Notes |
|----------|-----|--------|-------|
| **P1** | Add missing game settings to `/games` (CP costs, weather effects, message format) | Low-Med | ~10-15 `GameSetting` entries to add |
| **P1** | Add Scores + Transactions to v2 sidebar nav | Trivial | Add nav items to Sidebar component |
| **P1** | Flesh out Redeem page (URL params, item preview, auto-activation, coupon formatting) | Medium | Significant UX work |
| **P2** | Theme variation multi-select for premium themes | Medium | New UI component for multi-color variants |
| **P2** | Settings persistence (localStorage save/restore) | Medium | Serialize/deserialize all game settings |
| **P2** | Resolve Customize/Market feature overlap | Design decision | Deduplicate or differentiate the two pages |
| **P2** | Add Refresh Token to generated URLs | Trivial | 1 line |
| **P3** | Document/deprecate standalone pages (streams, alertoverlay, hideseek) | Trivial | Decide keep or remove |

---

## Recommendations

1. **Add missing game settings** — The `/games` page is 70% there. Add CP cost settings, weather effect costs, message format templates, and game ready delay. This is the highest-value work for v2 adoption.

2. **Fix navigation** — Add Scores and Transactions to the sidebar. Quick win, high visibility.

3. **Flesh out Redeem** — Add coupon formatting, `?code=` URL params, item preview modal, auto-activation. This affects promo code campaigns.

4. **Settings persistence** — Add localStorage save/restore so streamers don't have to re-enter settings each visit.

5. **Decide on Customize vs Market overlap** — Either merge them or clearly differentiate (equip vs buy).

---

## Cleanup Done

- **Deleted `link.html`** (May 8, 2026) — Standalone link generator, redundant with `twitch.html` game setup. Not linked from navigation.

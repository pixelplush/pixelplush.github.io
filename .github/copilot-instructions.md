# pixelplush.github.io — Copilot Instructions

## About This Repo

This is the **PixelPlush website** at [pixelplush.dev](https://www.pixelplush.dev). It's a static site deployed to GitHub Pages. Includes login, game customization, scores/leaderboards, status page, streams directory, marketplace, and more.

## Part of the PixelPlush Ecosystem

This repo is part of the PixelPlush multi-repo platform. See `PixelPlushCommon/.github/copilot-instructions.md` for full architecture, repo map, and agent roster.

**Key relationship:** The website talks to PixelPlushRooms for auth and PixelPlushAPI for data. It's the streamer-facing portal for setting up and customizing their PixelPlush games.

## Tech

- Static HTML, CSS, vanilla JavaScript
- GitHub Pages hosting
- Template system: `template_page.html`, `template_left.html`, `generatePages.js`
- Twitch OAuth for login

## Key Pages

| Page | Purpose |
|---|---|
| `index.html` | Landing page |
| `login.html` | Twitch OAuth login |
| `customize.html` | Streamer game configuration |
| `scores.html` | Player leaderboards |
| `status.html` | System status |
| `streams.html` | Active streams directory |
| `market.html` | Item marketplace |

## Rules

- **Static site — no heavy frameworks.** Don't add React/Vue/etc. without explicit approval.
- **Twitch login flow is critical.** Don't break OAuth.
- **Mobile-friendly.** Streamers and viewers use phones.
- **Never expose API keys or tokens** in client-side JS.
- **Check the templating system** before adding new pages — use `generatePages.js`.

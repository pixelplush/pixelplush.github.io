# PixelPlush
Visit the PixelPlush website at [www.pixelplush.dev](https://www.pixelplush.dev)

## V2 export

After replacing the generated `out/` and `v2/` exports, run:

```sh
npm run v2:polish
```

This reapplies the launch-ready UI and Twitch permission fixes to the deployed `v2/` export. Deployment is handled by pushing `master` to GitHub Pages.

Before deployment, run the production-style browser release gate:

```sh
npm run v2:audit
```

The audit serves the static export, checks every active route on desktop and mobile, fails on uncaught exceptions or console errors, runs WCAG A/AA checks, waits for lazy images, and exercises navigation, language, leaderboard, and game controls.

Before making v2 the primary site, update the old-site link without editing generated files:

```sh
PIXELPLUSH_OLD_SITE_PATH=/v1 npm run v2:polish
```

To remove the temporary seventh-birthday celebration:

```sh
PIXELPLUSH_BIRTHDAY_ENABLED=0 npm run v2:polish
```

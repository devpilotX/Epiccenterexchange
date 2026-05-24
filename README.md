# Epicenter Exchange

> Static, AdSense-friendly crypto information portal — market data, portfolio tracker, watchlist, charts, educational content. No backend, no signup, just CoinGecko + LocalStorage.

---

## What it is

A fully static cryptocurrency platform that serves real-time market data, a personal portfolio tracker, a watchlist, and a Fear & Greed sentiment widget. Built to be deployed on any static host (cPanel, Cloudflare Pages, Netlify, GitHub Pages) and monetized via Google AdSense + A-ADS.

Not a real exchange — no order book, no custody. The name is a play on "epicenter of the market."

## Live features (Phase 2 + 3 complete, 2026-01-28)

- **Live market table** — top 100 coins (CoinGecko `/coins/markets`), 24h change, market cap, volume
- **Coin detail pages** with Chart.js v4 price history (1D / 7D / 30D / 1Y / ALL)
- **Portfolio tracker** — add holdings, real-time P&L, ROI, 60s refresh, persists in `cryptoPortfolio` LocalStorage
- **Watchlist** — star coins from the market table, dedicated `/watchlist.html` grid, persists in `cryptoWatchlist`
- **Trending + gainers + losers** widget on homepage (auto-refresh every 5 min)
- **Fear & Greed Index** widget (alternative.me API, refresh every 6h)
- **Currency converter** (any coin ↔ fiat)
- **Dark / light theme toggle** with `epicenterTheme` LocalStorage persistence
- **Toast notification system** — `Toast.success() / .error() / .info() / .warning()`
- **Heatmap, news feed, newsletter signup, compare tool**
- **Skeleton loaders, IntersectionObserver fade-ins, GPU-accelerated CSS animations**
- **Schema markup** (Article, FinancialQuote, WebSite), semantic HTML, mobile-first (320px+), Lighthouse 85+

## Architecture

```
Epiccenterexchange/
├─ index.html              # Homepage with hero, market movers, FAQ
├─ market.html             # Full market table with watchlist toggles
├─ coin-detail.html        # Individual coin page with Chart.js charts
├─ compare.html            # Side-by-side coin comparison
├─ converter.html          # Crypto ↔ fiat converter
├─ heatmap.html            # Market cap heatmap visualization
├─ portfolio.html          # Personal portfolio tracker
├─ watchlist.html          # Saved coin watchlist
├─ news.html               # Crypto news feed
├─ newsletter.html        # Email signup
├─ about.html / contact.html / privacy-policy.html / terms.html
├─ blog-post-template.html / guide-template.html / review-template.html
├─ code.gs                 # Google Apps Script — newsletter / contact form handler
├─ ads.txt                 # AdSense publisher verification
├─ robots.txt / sitemap.xml
└─ PHASE_2_3_COMPLETION_REPORT.md
```

All dynamic behavior lives in `js/*.js` (one file per concern: `main.js`, `portfolio.js`, `watchlist.js`, `coin-detail.js`, `toast.js`, `theme-toggle.js`, `fear-greed.js`). No bundler, no framework — vanilla ES + Chart.js loaded via CDN.

## APIs used

| API | Endpoint | Use |
|-----|----------|-----|
| CoinGecko | `/coins/markets` | Top 100, gainers, losers |
| CoinGecko | `/search/trending` | Trending coins (5) |
| CoinGecko | `/simple/price` | Portfolio + watchlist refresh |
| CoinGecko | `/coins/{id}/market_chart` | Detail page history |
| alternative.me | `/fng/` | Fear & Greed Index |
| Google Apps Script | `code.gs` web app | Newsletter + contact form sink |

## LocalStorage schema

```js
cryptoPortfolio  // Array<{ id, coinId, coinName, amount, buyPrice, buyDate }>
cryptoWatchlist  // Array<coinId>
epicenterTheme   // "dark" | "light"
priceAlerts      // Array<{ id, coinId, targetPrice, condition, triggered }>
```

## Quickstart

Static site — no build step.

```bash
git clone https://github.com/devpilotX/Epiccenterexchange.git
cd Epiccenterexchange
python3 -m http.server 8000
# open http://localhost:8000
```

## Monetization

- Google AdSense — leaderboard + sidebar slots
- A-ADS — crypto-native ad unit `2430192`
- `ads.txt` and `robots.txt` pre-configured

## Status

Phase 2 + 3 complete. Tested across Chrome, Firefox, Safari + mobile. Currently optimizing for AdSense approval and SEO.

## Roadmap

- CSV export for portfolio + watchlist
- Price alert history view
- MetaMask / Web3 wallet read-only import
- Autocomplete search, multi-language

## Author

**Dipanshu Kumar** — independent AI / full-stack engineer building consumer + finance tools solo.

- Sites: [paisareality.com](https://paisareality.com) · [value.codes](https://value.codes) · [algo.devpilotx.com](https://algo.devpilotx.com)
- GitHub: [@devpilotX](https://github.com/devpilotX)
- Email: connect.dipanshukumar@gmail.com

## License

Proprietary. All rights reserved.

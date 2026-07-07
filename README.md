# Flora — Flower Shop Website

A responsive HTML/CSS/JS website for a florist shop, built from the [Flora Figma design](https://www.figma.com/design/2Tj16H7IO7dq1ViTvIh57V/Flora). Combines a static, semantic, adaptive layout (mobile-first, 375 / 768 / 1440) with an interactive layer: retina images, modals, dynamic product lists via a mock API, pagination and filtering.

## Stack

- Semantic HTML5, CSS custom properties, `modern-normalize`
- Vanilla JavaScript (ES modules), `axios` for HTTP requests
- `json-server` as a mock REST API (`db.json`)
- SVG sprite for icons, AOS for scroll animations

## Project structure

```
index.html
css/
  modern-normalize.css
  styles.css
js/
  main.js        # mobile menu, modals, wiring
  api.js         # axios calls to the mock API
  render.js      # dynamic rendering, pagination, filtering
  validate.js    # order form validation
  vendor/
    axios.esm.js # locally vendored axios ESM build
images/          # optimized photos (@1x/@2x), icons.svg, logo.svg
db.json          # mock product data for json-server
```

## Running locally

Install dependencies once:

```bash
npm install
```

Start the mock API (in one terminal):

```bash
npm run api
```

This serves the product data at `http://localhost:4000/products` (json-server, watching `db.json`).

Serve the site itself (in another terminal), for example with any static server:

```bash
npx serve .
```

Then open the printed local URL in your browser. The page expects the API at `http://localhost:4000` — update the `baseURL` in `js/api.js` if you run it on a different port.

## ⚠️ Testing the live GitHub Pages demo

The GitHub Pages link (served over **HTTPS**) is only useful for reviewing the static markup and styles. The dynamic sections (Top-Selling, Bouquets, product modals) will always show "Failed to load" there, because:

- `json-server` only runs locally over plain **HTTP** (`http://localhost:4000`)
- Chrome blocks any fetch/XHR from an HTTPS page to an insecure HTTP address ("mixed content") — this is a browser security policy, not a bug, and there is no way around it on the deployed link

**To see the dynamic features working, always test locally over HTTP:**

1. `npm run api` (starts the mock API on port 4000)
2. `npx serve .` (starts the site itself over `http://localhost:...`)
3. Open the printed `http://localhost:...` URL — both the page and the API are HTTP now, so the fetches succeed

## Notes

- All photos, colors, typography and copy come directly from the Figma file. A handful of purely functional UI glyphs (burger/close icons, form checkmark, phone/pin/social icons) were hand-drawn as simple SVGs since the macet doesn't expose them as separate exportable assets.
- Images were compressed with `sharp` (lossless PNG re-encoding, ~70% size reduction) as a one-off step; no build step is required to run the site.

# Zach of All Trades

Cinematic 3D studio site. Static frontend only — no server to run.

## Go live

Works on **HostAfrica, xneelo, Domains.co.za, Afrihost, a Hetzner VPS, or your own PC**. Step-by-step for each is in `HOSTING.txt`.

```bash
npm install
npm run build
```

Upload **the files inside** `dist` so `index.html` is the homepage (`public_html` / `www`). Include the hidden `.htaccess` file. Do not upload a folder named `dist`.

Own PC or VPS without Apache:

```bash
npm run start
```

Then open http://localhost:4173

Quote form: copy `.env.example` to `.env`, add a key, build again, re-upload.

## Run locally

```bash
npm install
npm run dev
```

Production preview:

```bash
npm run build
npm run preview
```


## Prices

Edit `src/config/pricing.ts` when you want your own ranges on the quote form.

- `bands` — the chips, printed exactly as you write them. Amounts are in R (ZAR).
- `note` — optional one-liner under the service brief. Leave `''` to hide it.
- Leave `bands` as `[]` to hide the budget picker for that service until you are ready.

The form always adds “Prefer not to say” in front of your bands.

## Quote form

The form is frontend-only. Configure one of these in `.env` (see `.env.example`):

- `VITE_FORM_ENDPOINT` — JSON POST (Formspree, Getform, Basin, etc.)
- `VITE_FORM_ACCESS_KEY` — Web3Forms
- `VITE_CONTACT_EMAIL` — mailto fallback

If none are set, the UI tells you the form is ready and does not pretend a message was delivered.

## Motion and fallback

- `prefers-reduced-motion: reduce` disables the 3D camera journey and shows a still editorial version.
- Devices without WebGL get the same 2D version.
- Mobile uses a lighter particle count, simpler materials, and reduced post-processing.
- If frame rate drops, quality degrades automatically.

## Honest copy

The site does not invent reviews, awards, years in business, or client logos.

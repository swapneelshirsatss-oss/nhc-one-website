# NHC One – Website (Dhayari, Pune)

Static HTML/CSS/JS replica of nhcone.in plus a Google/Meta ads landing page. Project by NHC Corp.

- `index.html` – main one-page site
- `landing.html` – ads landing page (noindex)
- `thank-you.html` – conversion page after a lead
- `config.js` – set `window.NHC_ENDPOINT` to the Apps Script web-app URL
- `lead-endpoint.gs` – Google Apps Script that saves leads to a Sheet
- Tracking: Google Tag Manager `GTM-5W3CJD2M`; events `generate_lead`, `contact_click`, `cta_click`, `lead_thank_you`

Preview locally: `python -m http.server 8765` in this folder.

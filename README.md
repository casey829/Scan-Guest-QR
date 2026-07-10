# 🎟️ Scan-Guest-QR — Event Check-In System

A camera-based QR check-in app built for **Workforce Debates Vol. 5**, a live event in Nairobi with 70+ attendees. Guests present a QR ticket, staff scan it with any phone or laptop camera, and the screen instantly shows their details plus a **full-screen colour verdict** for photo consent — green for "photos OK", red for "no photos" — so ushers can hand out the matching wristband in under two seconds.

![Screenshot](docs/screenshot.png)

## The problem it solved

Paper guest lists were slowing entry to a crawl, and the event needed to track **photo consent** per guest (Kenya's Data Protection Act makes this a real requirement for event media teams). Encoding consent into each guest's QR ticket and colour-coding the check-in screen removed both bottlenecks at once.

## Features

- 📱 **Any device with a camera** — runs in the browser, no app install for staff
- ⚡ **Instant visual verdict** — full-screen green/red gradient mapped to photo consent, with wristband colour called out explicitly
- 📋 **Live checked-in list** — every scan is timestamped and appended to the session's attendance log
- 🔁 **Auto-reset** — the scanner re-arms itself 5 seconds after each scan, so the queue keeps moving hands-free
- 🛡️ **Graceful failure** — malformed QR payloads are rejected with a clear message instead of crashing the scanner

## How it works

Each guest's ticket QR encodes a JSON payload (name, ticket type, `photoConsent: "YES" | "NO"`). The app uses [`html5-qrcode`](https://github.com/mebjas/html5-qrcode) to read the camera stream at 10 fps, parses the payload, records the check-in with an ISO timestamp, and renders the consent verdict.

## Tech stack

- React 19 + Vite
- html5-qrcode (camera scanning)
- Zero backend for the MVP — state lives in the session, intentional for a one-night event with unreliable venue Wi-Fi

## Getting started

```bash
git clone https://github.com/casey829/Scan-Guest-QR.git
cd Scan-Guest-QR
npm install
npm run dev
```

Scan any QR code containing:

```json
{ "name": "Jane Doe", "ticketType": "VIP", "photoConsent": "YES" }
```

## Possible extensions

- [ ] Persist check-ins to Airtable/Google Sheets via n8n webhook
- [ ] Duplicate-scan detection
- [ ] Offline-first storage with sync

## License

[MIT](LICENSE) © Casey Kimamo — [Minika Tech Solutions](https://github.com/casey829)

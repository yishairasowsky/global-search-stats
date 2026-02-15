# Live Dictionary Spectator Monitor

Simple dictionary-style browser with live interaction tracking and a spectator monitor.

## Features

- A–Z browsing + search
- Hover definitions
- Infinite scroll
- Tracks:
  - hovered word
  - highlighted text
  - scroll position
- Live monitor (`control.html`)

## Files

- `index.html` — main UI
- `control.html` — spectator monitor
- `defs.json` — definitions
- `generate_words.js` — dataset generator
- `words.json` — word list

## Setup

Generate words:

node generate_words.js

Run local server:

npx serve

Open:

http://localhost:PORT/index.html

## Notes

- Vanilla HTML/CSS/JS
- Firebase realtime state

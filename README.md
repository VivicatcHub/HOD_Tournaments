# 🎲 Heaven of Dice - Tournament Ranking

A modern web application displaying **live tournament rankings** from a Google Sheet with animations, search functionality, and responsive design.

## What is this?

This app fetches data from a public Google Sheet and displays it as an interactive ranking table with:

- Search participants by name
- Auto-updating data every 30 seconds
- Multiple tournament sheets support
- Animated rankings with spectral effects

## Quick Start

### Prerequisites

- Node.js 18+
- A public Google Sheet with at least 2 columns (name, score)

### Setup

1. **Clone & install:**

```bash
git clone https://github.com/VivicatcHub/HOD_Tournaments
cd HOD_Tournaments/tournament-ranking
npm install
```

2. **Configure your Google Sheet ID in `src/App.tsx`:**

```tsx
const SHEET_URL = `https://gsx2json.com/api?id=YOUR_SHEET_ID&sheet=${selectedSheet}&columns=false`;
```

Get your Sheet ID from: `https://docs.google.com/spreadsheets/d/[ID_HERE]/edit`

3. **Configure sheets in `src/sheet-options.json`:**

```json
[
  { "name": "Sheet1", "ascending": true },
  { "name": "Sheet2", "ascending": false }
]
```

4. **Run:**

```bash
npm start
```

## Important Notes

- **Auto-refresh**: Data updates every 30 seconds
- **API Quota**: gsx2json allows 100 requests/minute
- **Column Detection**: Automatically detects first 2 columns (any names work)
- **Animations**:
  - Enchant effect (glow): every 30s at 0s, 30s, 60s...
  - Dance effect (3rd place): every 30s at 15s, 45s, 75s...

## Troubleshooting

- **Rankings don't load**: Check Google Sheet is public & correct Sheet ID
- **Wrong columns**: Edit first 2 columns in Google Sheet
- **Animations not showing**: Ensure `animations.css` is imported in `index.tsx`

## Technologies

- React 19 + TypeScript
- Tailwind CSS
- CSS animations
- gsx2json API

## License

Made for Heaven of Dice

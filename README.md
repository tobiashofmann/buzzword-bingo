# Buzzword Bingo

Buzzword Bingo app for SAP events, built with SAPUI5 and TypeScript.

## What the app does

- Each card is a 5x5 grid of 25 tiles. The center tile is always a free square.
- The remaining 24 tiles are drawn randomly from a buzzword pool for every new game.
- Clicking a tile marks it as "hit".
- As soon as a full row, column, or diagonal is marked, "BINGO!" appears over the whole app.
- Available languages: English, German, Portuguese (PT), and Brazilian Portuguese (PT-BR) — the UI texts are translated, the buzzwords themselves are not.

## Running the app

```bash
npm install
npm start          # against ui5.sap.com (requires internet access)
npm run start-local # using locally installed UI5 libraries
```

The app opens automatically in the browser at `index.html`.

Other useful commands:

```bash
npm run lint          # ESLint
npm run ts-typecheck  # TypeScript type checking
npm run build         # production build into ./dist
```

## Adding your own buzzwords

The buzzwords live in [`webapp/model/buzzwords.json`](webapp/model/buzzwords.json) as a plain list of strings:

```json
{
    "buzzwords": [
        "Synergy",
        "Digital Transformation",
        ...
    ]
}
```

Just add more entries (or replace existing ones) and save — no code changes needed. Each game draws 24 words at random from this list, so the pool should contain well more than 24 entries (ideally around four times as many, i.e. ~100+) so cards noticeably differ between games.

# Random Word API Server (Next.js, TypeScript)

---

## 📖 API Documentation

Interactive API docs and schema are available at:

👉 [Swagger UI](/api-doc)

---

A type-safe API server built with Next.js and TypeScript for generating random words by category or part of speech. All data is sourced from JSON files in the `public/` directory. No React or HTML—API only.

---

## 📦 Endpoints

### Category Endpoints

| Endpoint              | Description      |
| --------------------- | ---------------- |
| `GET /api/animals`    | Random animal    |
| `GET /api/birds`      | Random bird      |
| `GET /api/fish`       | Random fish      |
| `GET /api/fruits`     | Random fruit     |
| `GET /api/vegetables` | Random vegetable |

### Part of Speech Endpoints

| Endpoint               | Description |
| ---------------------- | ----------- |
| `GET /api/random-verb` | Random verb |
| `GET /api/random-noun` | Random noun |

### Color Endpoints

| Endpoint                                                                  | Description                                                               |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `GET /api/color?format=hex\|rgba\|oklch`                                  | Random color (hex, rgba, oklch). Optional `format` query param.           |
| `GET /api/color-palette?from=...&to=...&points=5&format=hex\|rgba\|oklch` | Generate color palette between two colors. Optional `format` query param. |

#### Color Endpoint Query Parameters

- `format` (optional): Specify the color format to return. One of `hex`, `rgba`, or `oklch`.
  - Example: `/api/color?format=hex`

#### Color Palette Endpoint Query Parameters

- `from` (required): Starting color (hex or rgba)
- `to` (required): Ending color (hex or rgba)
- `points` (optional): Number of colors in the palette (default: 5)
- `format` (optional): Specify the color format to return. One of `hex`, `rgba`, or `oklch`.
  - Example: `/api/color-palette?from=rgba(10,20,30,1)&to=rgba(200,100,50,0.5)&points=5&format=hex`

### General Random Endpoint

| Endpoint          | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `GET /api/random` | Random animal, fish, fruit, bird, verb, noun, color, and palette |

---

## 📝 Response Format

All endpoints return JSON. For color endpoints:

```json
{
  "color": "#aabbcc" | "rgba(123,45,67,0.5)" | "oklch(70% 0.2 120)",
  "format": "hex" | "rgba" | "oklch"
}
```

For color palette:

```json
{
  "palette": ["rgba(123,45,67,1)", ...],
  "format": "rgba"
}
```

For `/api/random`:

```json
{
  "animal": { ... },
  "fish": { ... },
  "fruit": { ... },
  "bird": { ... },
  "verb": { ... },
  "noun": { ... },
  "color": { ... },
  "palette": { ... },
  "description": "..."
}
```

If a word is not found, a 404 is returned with:

```json
{ "error": "No <type> found" }
```

---

## 🚨 Error Handling

All API endpoints return a JSON error response with a suitable HTTP status code if a resource is not found or a required parameter is missing. Example error responses:

```json
{ "error": "No <type> found" }
```

or

```json
{ "error": "No slug provided" }
```

- 404 is returned for missing resources (e.g., no word found in a category).
- 400 is returned for missing required parameters (e.g., missing slug).

---

## 🛠️ Type Safety

All types are defined in [`src/types/words.ts`](src/types/words.ts) and re-exported from [`src/types/index.ts`](src/types/index.ts).

---

## 📂 Data Source

All word data is stored in JSON files in the [`public/`](public/) directory:

- `animals.json`
- `birds.json`
- `fish.json`
- `fruits.json`
- `vegetables.json`
- `noun.json`
- `verb.json`

To add or update words, simply edit the relevant JSON file.

---

## 🏗️ Project Structure

- `src/app/api/[category]/route.ts` — Handles category endpoints
- `src/app/api/random/route.ts` — Handles random word endpoint
- `src/app/api/random-verb/route.ts` — Handles random verb endpoint
- `src/app/api/random-noun/route.ts` — Handles random noun endpoint
- `src/types/words.ts` — Type definitions
- `src/app/apiWords.ts` — Utility functions for reading JSON and random selection

---

## 🚀 Usage Example

Fetch a random color:

```bash
curl https://randomizer-black.vercel.app/api/color?format=oklch
```

Fetch a color palette:

```bash
curl "https://randomizer-black.vercel.app/api/color-palette?from=rgba(10,20,30,1)&to=rgba(200,100,50,0.5)&points=5&format=hex"
```

Fetch a random everything:

```bash
curl https://randomizer-black.vercel.app/api/random
```

Response:

```json
{
  "animal": { "name": "Aardvark", "category": "animals", "partOfSpeech": "noun" },
  "fish": { "name": "Bass", "category": "fish", "partOfSpeech": "noun" },
  "fruit": { "name": "Apple", "category": "fruits", "partOfSpeech": "noun" },
  "bird": { "name": "Crow", "category": "birds", "partOfSpeech": "noun" },
  "verb": { "name": "Jump", "partOfSpeech": "verb" },
  "noun": { "name": "Table", "partOfSpeech": "noun" },
  "color": { "color": "#aabbcc", "format": "hex" },
  "palette": { "palette": ["rgba(10,20,30,1)", ...], "format": "rgba" },
  "description": "Aardvark with Bass, Apple, Crow doing Jump and Table in color #aabbcc with palette rgba(10,20,30,1), ..."
}
```

---

## 🧩 Extending

- Add new categories or parts of speech by creating new JSON files in `public/` and updating the utility map in `apiWords.ts`.
- All endpoints are stateless and cache-friendly.

---

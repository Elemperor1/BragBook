# BragBook

BragBook is a browser-local career evidence vault for software engineers and tech leads. It helps you capture real accomplishments with metrics, context, and proof, then turn that material into self-reviews, promotion cases, resume bullets, and STAR interview stories.

## Who it is for

- Individual software engineers who want stronger review and promotion material
- Tech leads who need a reliable record of impact across projects and quarters
- Anyone who wants private, structured accomplishment tracking without an account or backend

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Dexie on top of IndexedDB for browser-local persistence
- Zod for schema validation
- Vitest and Testing Library for tests

## Architecture overview

- `src/app`: App Router entrypoints. The marketing page lives at `/`, and the product lives under `src/app/(app)`.
- `src/components`: Product UI by area, including dashboard, entries, generator, settings, layout, and shared UI primitives.
- `src/lib/schemas`: Zod schemas for entries, proof items, images, and backup payloads.
- `src/lib/storage`: IndexedDB-facing storage code, demo seeding, and backup import/export.
- `src/lib/generator`: Draft generation logic for self-review, promotion, resume, and STAR outputs.
- `src/lib/utils`: Filtering, proof-strength scoring, stats, date formatting, and migration helpers.
- `src/hooks`: Live-query hooks that bind Dexie data into the UI.

The app is intentionally frontend-only. Product screens read and write directly against Dexie, and the generator runs entirely in the client.

## How local storage works

- Entries are stored in IndexedDB in the `entries` table.
- Attached screenshot assets are stored separately in the `entryAssets` table and linked back to proof items by ID.
- Live views use `dexie-react-hooks` so dashboard, entries, generator, and settings update automatically when local data changes.
- Export creates a `bragbook-backup-v1` JSON file containing:
  - all entries
  - all stored image assets as base64 data URLs
  - export metadata
- Import validates the JSON with Zod and replaces the current browser data. It does not merge.
- Demo entries are seeded from a single shared source of truth and are meant for walkthroughs, not production sync.

Important: the product is stored only in this browser profile. Clearing site data, switching browsers, or using a new device will remove the data unless you exported a backup first.

## How to run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
npm run lint
./node_modules/.bin/tsc --noEmit
npm test
npm run build
```

## What is implemented

- Marketing landing page
- Browser-local storage for accomplishment entries and screenshot proof
- Dashboard with proof-strength summaries and recent/strongest entry views
- Entry capture and edit flows with structured fields for situation, action, result, metric, stakeholders, tags, and proof items
- Proof-strength scoring derived from saved metrics and concrete proof
- Filterable entries list
- Generator for self-review, promotion case, resume bullet, and STAR outputs
- Editable generated output with copy and select-all flows
- Demo data seeding
- JSON backup export and restore
- Automated tests for core product flows and generator/proof logic

## What is intentionally not implemented yet

- Accounts or authentication
- Cloud sync or any backend persistence
- Collaboration or shared workspaces
- AI or external LLM services
- Multi-user data models
- Merge-on-import backup behavior
- Rich document export formats like PDF or DOCX
- Recruiter, manager, or team-specific workflows as first-class product modes

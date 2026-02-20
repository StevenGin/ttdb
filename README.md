# ttdb — Blades in the Dark Companion

A local-first campaign management tool for **Blades in the Dark**, inspired by Comp/Con.
Run it locally as a full editor, or publish a read-only snapshot to GitHub Pages for your crew.

---

## Features

| Section | What you can track |
|---|---|
| **Characters** | Playbook, actions & XP, stress, harm, trauma, load & items, notes |
| **Crew** | Tier, hold, rep, heat, wanted level, coin, upgrades, progress clocks |
| **Locations** | Hierarchical world-map (World → City → District → Area → Site → Room) |
| **Factions** | Status scores (−3 At War → +3 Ally), tier, hold, goals, threats |
| **Items** | Gear catalog with load values, tags, holder and location links |

All data is stored locally in your browser's `localStorage`. Nothing leaves your machine unless you publish.

---

## Modes

### Local mode (editor)
```bash
npm run dev
```
Full editor — create, edit, and delete everything. Opens at `http://localhost:5173`.

### Static mode (read-only)
```bash
npm run build:static
```
Builds a read-only snapshot into `dist-static/`. All edit controls are hidden at build time via `VITE_STATIC_MODE=true`.

---

## Publish to GitHub Pages

### One-command deploy
```bash
npm run deploy
```
Builds the static site and pushes it to the `gh-pages` branch of your repo. Enable GitHub Pages on that branch in your repo settings and share the link with your crew.

### GitHub Actions (auto-deploy)
Push to `main` (or trigger manually) and the included workflow at `.github/workflows/deploy-pages.yml` will build and deploy automatically.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start local editor
npm run dev
```

On first load, the app seeds 17 core factions from the Blades in the Dark SRD. Everything else starts empty — add your crew, characters, locations, and items from the sidebar.

---

## Data Management

From **Settings** you can:

- **Export** a full JSON backup of all your data
- **Import** a previous backup to restore or migrate
- **Clear** all data and start fresh
- **Reset** faction statuses to neutral (0)

---

## Tech Stack

- **Vue 3** + Composition API + TypeScript
- **Vite** — dual build modes via `define: { __STATIC_MODE__ }`
- **Pinia** — state management with `localStorage` persistence
- **Tailwind CSS v3** — custom `blades-*` gas-lamp gothic palette
- **Vue Router** — hash history; settings route excluded from static build

---

## Keyboard Shortcuts

The app is mouse-driven. No special keyboard shortcuts beyond standard browser defaults.

---

## Credits

Game content (playbooks, factions, crew types) is based on **Blades in the Dark** by John Harper,
published by Evil Hat Productions. Used under [Creative Commons Attribution 3.0 Unported](https://creativecommons.org/licenses/by/3.0/).

This tool is unofficial and unaffiliated with Evil Hat Productions.

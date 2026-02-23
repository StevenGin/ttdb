# ✦ Aurelion — Blades in the Dark Campaign Companion

A local-first campaign management tool for **Blades in the Dark** set in **Aurelion** — a dark fantasy city built on the ruins of a Demon King's empire, styled after the *Frieren: Beyond Journey's End* aesthetic.

---

## Features

| Feature | Details |
|---------|---------|
| **The Crew** | Track Tier, Rep, Heat, Coin, Clocks, Contacts, and Upgrades |
| **Player Characters** | Full sheets — Actions, XP, Stress, Trauma, Harm, Items |
| **NPCs** | Searchable cast with portraits, faction links, and location pins |
| **Factions** | Tier/Hold tracking, relationship status (−3 War → +3 Ally) |
| **Locations** | Hierarchical world map — Region → City → District → Site |
| **Items** | Gear catalogue with load ratings, tags, and holder/location links |
| **AI Images** | DALL-E 3 (with your OpenAI key) or Pollinations.ai (free, no key needed) |
| **Light/Dark Mode** | Aged-parchment light mode + twilight-navy dark mode |
| **Public/Private** | Mark any NPC, Item, or Location as public or private |
| **Favorites** | Star any entity to pin it to the top of its list |
| **GitHub Pages** | One-click publish of your public content as a read-only player site |

All data is stored in **browser localStorage** — nothing ever leaves your machine unless you explicitly publish.

---

## Running Locally

**Requirements:** Node.js 18+ and npm.

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ttdb.git
cd ttdb

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app opens at `http://localhost:5173`. All edits are saved automatically to localStorage.

### Other commands

```bash
npm run build          # Production build (full editor) → dist/
npm run build:static   # Read-only player build         → dist-static/
npm run preview        # Preview a production build locally
npm run type-check     # TypeScript checks
```

---

## Configuring AI Image Generation

Go to **Settings → AI Image Generation** in the sidebar.

### Option A — OpenAI DALL-E 3 (recommended)

1. Get an API key at [platform.openai.com](https://platform.openai.com/api-keys)
2. Paste it into the **OpenAI API Key** field in Settings
3. The key is stored only in your browser's localStorage — it is never sent anywhere except directly to OpenAI

DALL-E 3 generates higher quality images and costs roughly $0.04 per image (standard quality).

### Option B — Pollinations.ai (free, no sign-up)

Leave the API key field empty. Images are generated via [Pollinations.ai](https://pollinations.ai) at no cost. Quality is reasonable; generation can be slower or occasionally fail under high load.

---

## Publishing to GitHub Pages

Your **public** content (NPCs, Items, and Locations marked 🌐 Public) can be published as a read-only website for your players.

### Step 1 — Fork or push this repo to GitHub

If you haven't already, push your local clone to a GitHub repository:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ttdb.git
git push -u origin main
```

> The repository **must be named `ttdb`** (or you must update `base` in `vite.config.ts` to match your repo name).

### Step 2 — Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings → Pages** (in the left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Set Branch to **`gh-pages`** and folder to **`/ (root)`**
5. Click **Save**

GitHub will create the `gh-pages` branch automatically on first deploy.

### Step 3 — Deploy

**Method A: Automatic via GitHub Actions**

Every push to `main` triggers a deploy. The workflow at `.github/workflows/deploy-pages.yml` builds the static site and pushes it to `gh-pages`. You can also trigger it manually:

1. Go to your repo on GitHub
2. Click **Actions → Deploy to GitHub Pages**
3. Click **Run workflow**

**Method B: In-app deploy button**

Click **↑ Publish to GitHub Pages** in the app sidebar. This runs `npm run build:static` locally and pushes `dist-static/` to `gh-pages` via the deploy script.

> Requires `git` and a configured GitHub remote (SSH or HTTPS with saved credentials).

### Your published site

Once deployed, your player site is live at:

```
https://YOUR_USERNAME.github.io/ttdb/
```

It's read-only — players can browse public NPCs, Locations, and Items, but cannot edit anything.

---

## Controlling What Gets Published

| Mark | Behaviour |
|------|-----------|
| **🌐 Public** | Appears on the GitHub Pages player site |
| **🔒 Private** | Only visible in your local editor — never published |

Toggle the 🌐/🔒 button on any NPC card, Item row, or Location card, or set it in the edit drawer.

**Entities created before this feature was added default to Public** (backward compatibility). Mark anything sensitive as Private before publishing.

---

## Customising the Base URL

If your GitHub repository is **not** named `ttdb`, update `vite.config.ts`:

```ts
base: isStatic ? '/YOUR_REPO_NAME/' : '/',
```

---

## Data & Privacy

- All campaign data lives in your **browser's localStorage** — no server, no cloud, no accounts
- The only external network calls are:
  - Google Fonts (in-browser, `fonts.googleapis.com`)
  - AI image generation (to OpenAI or Pollinations.ai, only when you click **✦ AI Image**)
- **Export**: Settings → Export JSON saves a full backup
- **Import**: Settings → Import JSON restores from a backup

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Vue 3](https://vuejs.org) + TypeScript |
| Build | [Vite](https://vitejs.dev) 5 |
| Styling | [Tailwind CSS](https://tailwindcss.com) 3 + CSS custom properties |
| State | [Pinia](https://pinia.vuejs.org) (localStorage-backed) |
| Routing | [Vue Router](https://router.vuejs.org) 4 (hash history) |
| Fonts | Cinzel · Playfair Display · Barlow Condensed · Share Tech Mono |

---

## Acknowledgements

- **Blades in the Dark** by John Harper (Evil Hat Productions) — SRD content used under Creative Commons
- **Frieren: Beyond Journey's End** by Kanehito Yamada & Tsukasa Abe — visual aesthetic inspiration
- [Pollinations.ai](https://pollinations.ai) — free image generation fallback

---

*"It is better to contain a problem than fix it." — Aurelion City founding philosophy*

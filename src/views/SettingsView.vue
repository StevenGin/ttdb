<template>
  <div class="p-6 max-w-2xl">
    <div class="mb-6">
      <h1 class="text-3xl text-blades-text glow-gold">Settings</h1>
      <p class="text-blades-muted font-mono text-sm mt-1">Data management &amp; deployment</p>
    </div>

    <!-- AI Image Generation -->
    <div class="blades-card p-4 mb-6 border-blades-occult/20">
      <h2 class="text-lg mb-1">AI Image Generation</h2>
      <p class="text-blades-muted font-mono text-xs mb-4">
        Enter an OpenAI API key to use DALL-E 3 for banner images. Without a key, images
        are generated via Pollinations.ai (free, no sign-up, but may be slower).
      </p>
      <div class="space-y-3">
        <div>
          <label class="blades-label">OpenAI API Key</label>
          <div class="flex gap-2">
            <input
              :value="settingsStore.openaiKey"
              type="password"
              class="blades-input"
              placeholder="sk-..."
              autocomplete="off"
              @change="settingsStore.setOpenaiKey(($event.target as HTMLInputElement).value.trim())"
            />
            <button
              v-if="settingsStore.openaiKey"
              class="blades-btn-danger text-xs flex-shrink-0"
              @click="settingsStore.setOpenaiKey('')"
            >Clear</button>
          </div>
          <div class="mt-1 font-mono text-[10px]" :class="settingsStore.openaiKey ? 'text-emerald-400' : 'text-blades-muted/60'">
            {{ settingsStore.openaiKey ? '✓ DALL-E 3 active — stored locally, never sent to our servers' : 'No key set — using Pollinations.ai (free)' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Data management -->
    <div class="blades-card p-4 mb-6">
      <h2 class="text-lg mb-4">Data Management</h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-sans text-blades-text">Export All Data</div>
            <div class="text-xs font-mono text-blades-muted">Download characters, locations, factions, items, and crew as JSON</div>
          </div>
          <button class="blades-btn-outline text-xs" @click="exportAll">↓ Export</button>
        </div>
        <div class="blades-divider" />
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-sans text-blades-text">Import Data</div>
            <div class="text-xs font-mono text-blades-muted">Restore from a previously exported JSON backup</div>
          </div>
          <label class="blades-btn-outline text-xs cursor-pointer">
            ↑ Import
            <input type="file" accept=".json" class="hidden" @change="importAll" />
          </label>
        </div>
        <div class="blades-divider" />
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-sans text-blades-red-light">Clear All Data</div>
            <div class="text-xs font-mono text-blades-muted">Permanently delete all local data (cannot be undone)</div>
          </div>
          <button class="blades-btn-danger text-xs" @click="clearAll">⚠ Clear All</button>
        </div>
      </div>
    </div>

    <!-- Aurelion seed -->
    <div class="blades-card p-4 mb-6 border-blades-sage/20">
      <h2 class="text-lg mb-4">Aurelion World</h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-sans text-blades-text">Seed Aurelion Locations</div>
            <div class="text-xs font-mono text-blades-muted">Replace locations with the 20 Aurelion districts (world → city → tiers → 14 districts)</div>
          </div>
          <button class="blades-btn-ghost text-xs" @click="seedLocations">Seed Locations</button>
        </div>
        <div class="blades-divider" />
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-sans text-blades-text">Seed Aurelion Factions</div>
            <div class="text-xs font-mono text-blades-muted">Replace factions with the 14 Aurelion institutions and powers</div>
          </div>
          <button class="blades-btn-ghost text-xs" @click="seedFactions">Seed Factions</button>
        </div>
        <div class="blades-divider" />
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-sans text-blades-text">Reset Faction Status</div>
            <div class="text-xs font-mono text-blades-muted">Set all faction relationships back to Neutral (0)</div>
          </div>
          <button class="blades-btn-ghost text-xs" @click="resetFactionStatus">Reset Status</button>
        </div>
      </div>
    </div>

    <!-- Deploy -->
    <div class="blades-card p-4 mb-6 border-blades-gold/20">
      <h2 class="text-lg text-blades-gold mb-3">GitHub Pages Deployment</h2>
      <p class="text-blades-text/80 font-mono text-sm leading-relaxed mb-4">
        Click "Publish to GitHub Pages" in the sidebar to build a read-only static version
        of your campaign database. Anyone with the link can browse — but not edit.
      </p>
      <div class="bg-blades-bg border border-blades-border p-3 font-mono text-xs">
        <div class="text-blades-muted mb-1">Manual deploy commands:</div>
        <div class="text-blades-gold">npm run build:static &amp;&amp; npm run deploy</div>
      </div>
    </div>

    <!-- About -->
    <div class="blades-card p-4">
      <h2 class="text-lg mb-3">About</h2>
      <div class="space-y-1 font-mono text-xs text-blades-muted">
        <div>TTDB — Blades in the Dark Campaign Companion</div>
        <div>Built with Vue 3, TypeScript, Vite, and Tailwind CSS</div>
        <div class="mt-2 text-blades-muted/50">
          Blades in the Dark is designed by John Harper and published by Evil Hat Productions.
          This tool is not affiliated with or endorsed by them.
          SRD content used under Creative Commons Attribution 3.0.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharactersStore } from '@/stores/characters'
import { useLocationsStore } from '@/stores/locations'
import { useFactionsStore } from '@/stores/factions'
import { useItemsStore } from '@/stores/items'
import { useCrewStore } from '@/stores/crew'
import { useSettingsStore } from '@/stores/settings'
import type { FactionStatus } from '@/types/blades'

const settingsStore = useSettingsStore()

const charStore = useCharactersStore()
const locStore = useLocationsStore()
const facStore = useFactionsStore()
const itemStore = useItemsStore()
const crewStore = useCrewStore()

function exportAll() {
  const data = {
    version: 2,
    game: 'blades-in-the-dark',
    exportedAt: new Date().toISOString(),
    characters: charStore.exportSnapshot(),
    locations: locStore.exportSnapshot(),
    factions: facStore.exportSnapshot(),
    items: itemStore.exportSnapshot(),
    crew: crewStore.exportSnapshot(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ttdb-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importAll(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string)
      if (data.characters) { localStorage.setItem('ttdb_characters', JSON.stringify(data.characters)); charStore.load() }
      if (data.locations)  { localStorage.setItem('ttdb_locations',  JSON.stringify(data.locations));  locStore.load() }
      if (data.factions)   { localStorage.setItem('ttdb_factions',   JSON.stringify(data.factions));   facStore.load() }
      if (data.items)      { localStorage.setItem('ttdb_items',      JSON.stringify(data.items));      itemStore.load() }
      if (data.crew)       { localStorage.setItem('ttdb_crew',       JSON.stringify(data.crew));       crewStore.load() }
      alert('Import successful.')
    } catch (err) {
      alert('Failed to parse backup: ' + (err as Error).message)
    }
    ;(e.target as HTMLInputElement).value = ''
  }
  reader.readAsText(file)
}

function clearAll() {
  if (!confirm('Delete ALL data permanently? This cannot be undone.')) return
  ['ttdb_characters', 'ttdb_locations', 'ttdb_factions', 'ttdb_items', 'ttdb_crew'].forEach(k => localStorage.removeItem(k))
  location.reload()
}

function seedLocations() {
  if (!confirm('Replace all locations with the Aurelion world data?')) return
  locStore.resetToAurelion()
}

function seedFactions() {
  if (!confirm('Replace all factions with the Aurelion faction data?')) return
  facStore.resetToAurelion()
}

function resetFactionStatus() {
  if (!confirm('Reset all faction relationships to Neutral?')) return
  for (const f of facStore.factions) {
    facStore.setStatus(f.id, 0 as FactionStatus)
  }
}
</script>

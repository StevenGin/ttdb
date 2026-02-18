<template>
  <div class="p-6 max-w-2xl">
    <div class="mb-6">
      <h1 class="text-3xl text-lancer-text glow-accent">SETTINGS</h1>
      <p class="text-lancer-muted font-mono text-sm mt-1">Application configuration</p>
    </div>

    <!-- Data management -->
    <div class="lancer-card p-4 mb-6">
      <h2 class="text-lg mb-4">Data Management</h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-mono text-lancer-text">Export All Data</div>
            <div class="text-xs font-mono text-lancer-muted">Download all pilots, encounters, missions, and homebrew as JSON</div>
          </div>
          <button class="lancer-btn-outline text-xs" @click="exportAll">↓ Export</button>
        </div>
        <div class="lancer-divider"></div>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-mono text-lancer-text">Import Data</div>
            <div class="text-xs font-mono text-lancer-muted">Restore from a previously exported JSON backup</div>
          </div>
          <label class="lancer-btn-outline text-xs cursor-pointer">
            ↑ Import
            <input type="file" accept=".json" class="hidden" @change="importAll" />
          </label>
        </div>
        <div class="lancer-divider"></div>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-mono text-lancer-red-light">Clear All Data</div>
            <div class="text-xs font-mono text-lancer-muted">Delete all local data permanently (cannot be undone)</div>
          </div>
          <button class="lancer-btn-danger text-xs" @click="clearAll">⚠ Clear All</button>
        </div>
      </div>
    </div>

    <!-- Deploy info -->
    <div class="lancer-card p-4 mb-6 border-lancer-accent/20">
      <h2 class="text-lg text-lancer-accent mb-3">GitHub Pages Deployment</h2>
      <p class="text-lancer-text/80 font-mono text-sm leading-relaxed mb-4">
        Click "Publish to GitHub Pages" in the sidebar to build and deploy a read-only version
        of your database to GitHub Pages. Anyone with the link can browse your compendium,
        pilots, and encounters — but cannot edit anything.
      </p>
      <div class="space-y-2 text-xs font-mono text-lancer-muted">
        <div>Prerequisites:</div>
        <ul class="list-disc list-inside space-y-1 ml-2">
          <li>This repo must be pushed to GitHub</li>
          <li>GitHub Pages must be enabled on the <code class="text-lancer-accent">gh-pages</code> branch</li>
          <li>Git must be configured locally with push access</li>
        </ul>
      </div>
      <button class="lancer-btn-primary mt-4 text-xs" @click="$emit('deploy')">↑ Publish to GitHub Pages</button>
    </div>

    <!-- About -->
    <div class="lancer-card p-4">
      <h2 class="text-lg mb-3">About</h2>
      <div class="space-y-1 font-mono text-xs text-lancer-muted">
        <div>TTDB — Lancer RPG Companion Site</div>
        <div>Built with Vue 3, TypeScript, Vite, and Tailwind CSS</div>
        <div class="mt-2 text-lancer-muted/50">
          LANCER is published by Massif Press. This tool is not affiliated with or endorsed by Massif Press.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePilotsStore } from '@/stores/pilots'
import { useGmStore } from '@/stores/gm'
import { useCompendiumStore } from '@/stores/compendium'

const pilotsStore = usePilotsStore()
const gmStore = useGmStore()
const compendiumStore = useCompendiumStore()

defineEmits(['deploy'])

function exportAll() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    pilots: pilotsStore.exportSnapshot(),
    encounters: gmStore.exportSnapshot().encounters,
    missions: gmStore.exportSnapshot().missions,
    homebrew: compendiumStore.homebrewPackages,
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
      if (data.pilots) {
        localStorage.setItem('ttdb_pilots', JSON.stringify(data.pilots))
        pilotsStore.load()
      }
      if (data.encounters) {
        localStorage.setItem('ttdb_encounters', JSON.stringify(data.encounters))
      }
      if (data.missions) {
        localStorage.setItem('ttdb_missions', JSON.stringify(data.missions))
      }
      if (data.homebrew) {
        localStorage.setItem('ttdb_homebrew', JSON.stringify(data.homebrew))
        compendiumStore.loadFromStorage()
      }
      gmStore.load()
      alert('Data imported successfully. Reload the page to see all changes.')
    } catch (err) {
      alert('Failed to parse backup: ' + (err as Error).message)
    }
    ;(e.target as HTMLInputElement).value = ''
  }
  reader.readAsText(file)
}

function clearAll() {
  if (!confirm('This will delete ALL your local data. This cannot be undone. Are you sure?')) return
  localStorage.removeItem('ttdb_pilots')
  localStorage.removeItem('ttdb_encounters')
  localStorage.removeItem('ttdb_missions')
  localStorage.removeItem('ttdb_homebrew')
  location.reload()
}
</script>

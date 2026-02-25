<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div class="blades-card p-6 w-full max-w-lg">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl text-blades-gold font-serif">Publish to GitHub Pages</h2>
          <p class="text-blades-muted font-mono text-xs mt-1">Deploy a read-only static site</p>
        </div>
        <button class="text-blades-muted hover:text-blades-text text-xl" @click="$emit('close')">✕</button>
      </div>

      <template v-if="status === 'idle'">
        <div class="space-y-4">
          <div class="bg-blades-bg border border-blades-border p-4 text-xs font-mono space-y-1.5">
            <div class="text-blades-muted">This will:</div>
            <div class="text-blades-text">1. <span class="text-blades-gold">Download your campaign data</span> (images &amp; all public content)</div>
            <div class="text-blades-text">2. You place it at <span class="text-blades-gold">public/campaign-data.json</span> in your repo</div>
            <div class="text-blades-text">3. Run the deploy command — your GitHub Pages site shows everything</div>
          </div>

          <!-- Live size preview -->
          <div class="border rounded-sm p-3 text-xs font-mono space-y-2"
               :class="sizeWarning ? 'border-amber-700/50 bg-amber-900/10' : 'border-blades-border bg-blades-bg'">
            <div class="flex items-center justify-between">
              <span class="text-blades-muted">Export size</span>
              <span :class="sizeWarning ? 'text-amber-400' : 'text-blades-gold'" class="font-semibold">
                {{ exportSizeMb }} MB
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-blades-muted">Images included</span>
              <span class="text-blades-text">{{ imageCount }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-blades-muted">Public entities</span>
              <span class="text-blades-text">{{ publicEntityCount }}</span>
            </div>
            <div v-if="sizeWarning" class="text-amber-400/80 leading-relaxed pt-1 border-t border-amber-700/30">
              ⚠ File is large. Players may see a slow first load.
              Consider clearing unused images if this grows beyond 10 MB.
            </div>
          </div>

          <div>
            <label class="blades-label">Your GitHub Pages URL (optional)</label>
            <input v-model="baseUrl" class="blades-input" placeholder="https://yourname.github.io/ttdb/" />
            <div class="text-[10px] text-blades-muted font-mono mt-1">Shown as a share link after deployment.</div>
          </div>

          <div class="text-xs font-mono text-blades-muted border border-blades-border/50 p-3 space-y-1">
            <div class="text-blades-gold-light">Prerequisites:</div>
            <div>· Git configured with push access to origin</div>
            <div>· GitHub Pages enabled on the <span class="text-blades-gold">gh-pages</span> branch</div>
            <div>· Node.js + npm installed locally</div>
          </div>

          <div class="flex gap-2">
            <button class="blades-btn-gold flex-1" @click="startDeploy">↑ Deploy Now</button>
            <button class="blades-btn-ghost" @click="$emit('close')">Cancel</button>
          </div>
        </div>
      </template>

      <template v-else-if="status === 'deploying'">
        <div class="py-2 space-y-4">
          <!-- Step 1: data file downloaded -->
          <div class="border border-blades-gold/30 bg-blades-gold/5 p-4 space-y-2 text-xs font-mono">
            <div class="text-blades-gold font-semibold flex items-center gap-2">
              <span>✓</span> Step 1 — Data exported
            </div>
            <div class="text-blades-muted leading-relaxed">
              <span class="text-blades-text">campaign-data.json</span> was downloaded to your Downloads folder.
              Move it into your project at:
            </div>
            <div class="text-blades-gold bg-blades-bg px-3 py-1.5 rounded-sm">public/campaign-data.json</div>
            <div class="text-blades-muted">
              This file contains all your public content — NPCs, locations, images — everything.
              <span class="text-blades-text">({{ exportSizeMb }} MB, {{ imageCount }} image{{ imageCount !== 1 ? 's' : '' }})</span>
            </div>
          </div>

          <!-- Step 2: commit + deploy -->
          <div class="border border-blades-border p-4 space-y-2 text-xs font-mono">
            <div class="text-blades-text font-semibold">Step 2 — Commit &amp; deploy</div>
            <div class="text-blades-muted">In your terminal, from the project folder:</div>
            <div class="bg-blades-bg px-3 py-2 space-y-1 rounded-sm">
              <div class="text-blades-gold">git add public/campaign-data.json</div>
              <div class="text-blades-gold">git commit -m "Update campaign data"</div>
              <div class="text-blades-gold">npm run build:static &amp;&amp; npm run deploy</div>
            </div>
          </div>

          <div class="flex gap-2">
            <button class="blades-btn-ghost text-xs" @click="redownload">↓ Re-download data</button>
            <button class="blades-btn-gold text-xs flex-1" @click="status = 'done'">Mark as Done</button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="text-center py-8">
          <div class="text-4xl mb-4 text-blades-gold">✓</div>
          <div class="text-blades-gold font-serif text-sm mb-2">Deployment Complete</div>
          <p class="text-blades-muted font-mono text-xs mb-4">Your site should be live on GitHub Pages shortly.</p>
          <div v-if="baseUrl" class="bg-blades-bg border border-blades-gold/30 p-3 mb-4">
            <div class="text-[10px] text-blades-muted font-mono mb-1">Share Link</div>
            <a :href="baseUrl" target="_blank" class="text-blades-gold font-mono text-sm hover:underline">{{ baseUrl }}</a>
          </div>
          <button class="blades-btn-gold text-xs" @click="$emit('close')">Close</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCharactersStore } from '@/stores/characters'
import { useLocationsStore } from '@/stores/locations'
import { useFactionsStore } from '@/stores/factions'
import { useItemsStore } from '@/stores/items'
import { useCrewStore } from '@/stores/crew'
import { useJournalStore } from '@/stores/journal'

defineEmits<{ close: [] }>()

const status = ref<'idle' | 'deploying' | 'done'>('idle')
const baseUrl = ref('')

const charStore = useCharactersStore()
const locStore = useLocationsStore()
const facStore = useFactionsStore()
const itemStore = useItemsStore()
const crewStore = useCrewStore()
const journalStore = useJournalStore()

// ── Pre-export stats ────────────────────────────────────────────────────────

const publicChars  = computed(() => charStore.exportSnapshot().filter(c => c.isPublic !== false))
const publicLocs   = computed(() => locStore.exportSnapshot().filter(l => l.isPublic !== false))
const publicItems  = computed(() => itemStore.exportSnapshot().filter(i => i.isPublic !== false))
const publicJournal = computed(() => journalStore.exportSnapshot().filter(e => e.isPublic !== false))

const publicEntityCount = computed(() =>
  publicChars.value.length + publicLocs.value.length +
  publicItems.value.length + facStore.exportSnapshot().length
)

const imageCount = computed(() => {
  const hasImage = (o: { bannerImage?: string } | null | undefined) => !!(o?.bannerImage)
  const crew = crewStore.exportSnapshot() as { bannerImage?: string } | null
  return (
    publicChars.value.filter(hasImage).length +
    publicLocs.value.filter(hasImage).length +
    facStore.exportSnapshot().filter(hasImage).length +
    (hasImage(crew) ? 1 : 0)
  )
})

const exportSizeBytes = computed(() => {
  const data = {
    characters: publicChars.value,
    locations:  publicLocs.value,
    factions:   facStore.exportSnapshot(),
    items:      publicItems.value,
    crew:       crewStore.exportSnapshot(),
    journal:    publicJournal.value,
  }
  return new TextEncoder().encode(JSON.stringify(data)).length
})

const exportSizeMb = computed(() => (exportSizeBytes.value / 1_048_576).toFixed(2))
const sizeWarning  = computed(() => exportSizeBytes.value > 5 * 1_048_576)

function downloadCampaignData() {
  const data = {
    _readme: 'Generated by TTDB — place this file at public/campaign-data.json in your repo, commit, and push.',
    version: 2,
    game: 'blades-in-the-dark',
    exportedAt: new Date().toISOString(),
    characters: charStore.exportSnapshot().filter(c => c.isPublic !== false),
    locations:  locStore.exportSnapshot().filter(l => l.isPublic !== false),
    factions:   facStore.exportSnapshot(),
    items:      itemStore.exportSnapshot().filter(i => i.isPublic !== false),
    crew:       crewStore.exportSnapshot(),
    journal:    journalStore.exportSnapshot().filter(e => e.isPublic !== false),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'campaign-data.json'
  a.click()
  URL.revokeObjectURL(url)
}

function startDeploy() {
  downloadCampaignData()
  status.value = 'deploying'
}

function redownload() {
  downloadCampaignData()
}
</script>

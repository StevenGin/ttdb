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

          <div v-if="saveError" class="text-red-400 font-mono text-xs px-1">{{ saveError }}</div>

          <div class="flex gap-2">
            <button class="blades-btn-gold flex-1" @click="startDeploy">
              ↑ Save campaign-data.json
            </button>
            <button class="blades-btn-ghost" @click="$emit('close')">Cancel</button>
          </div>
          <div class="text-[10px] text-blades-muted font-mono text-center -mt-2">
            A save dialog will open — navigate to your project's
            <span class="text-blades-gold">public/</span> folder
          </div>
        </div>
      </template>

      <template v-else-if="status === 'saved'">
        <div class="py-2 space-y-4">
          <div class="border border-blades-gold/30 bg-blades-gold/5 p-4 space-y-1 text-xs font-mono">
            <div class="text-blades-gold font-semibold">✓ campaign-data.json saved</div>
            <div class="text-blades-muted">
              {{ exportSizeMb }} MB · {{ imageCount }} image{{ imageCount !== 1 ? 's' : '' }}
              · {{ publicEntityCount }} entities
            </div>
          </div>

          <div class="border border-blades-border p-4 space-y-2 text-xs font-mono">
            <div class="text-blades-text font-semibold">Now run this in your project folder:</div>
            <div class="bg-blades-bg px-3 py-2 rounded-sm flex items-start justify-between gap-2">
              <div class="text-blades-gold leading-relaxed break-all">{{ deployCommand }}</div>
              <button
                class="blades-btn-ghost text-[10px] shrink-0 py-0.5 px-2"
                @click="copyCommand"
              >{{ copied ? '✓' : 'Copy' }}</button>
            </div>
          </div>

          <div class="flex gap-2">
            <button class="blades-btn-ghost text-xs" @click="startDeploy">↓ Re-save data</button>
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

const status = ref<'idle' | 'saved' | 'done'>('idle')
const baseUrl = ref('')
const saveError = ref('')
const copied = ref(false)

const charStore = useCharactersStore()
const locStore = useLocationsStore()
const facStore = useFactionsStore()
const itemStore = useItemsStore()
const crewStore = useCrewStore()
const journalStore = useJournalStore()

// ── Pre-export stats ────────────────────────────────────────────────────────

const publicChars   = computed(() => charStore.exportSnapshot().filter(c => c.isPublic !== false))
const publicLocs    = computed(() => locStore.exportSnapshot().filter(l => l.isPublic !== false))
const publicItems   = computed(() => itemStore.exportSnapshot().filter(i => i.isPublic !== false))
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

const deployCommand = computed(() =>
  'git add public/campaign-data.json && git commit -m "Update campaign data" && npm run build:static && npm run deploy'
)

// ── Data builder ─────────────────────────────────────────────────────────────

function buildExportData() {
  return {
    _readme: 'Generated by TTDB — place this file at public/campaign-data.json in your repo, commit, and push.',
    version: 2,
    game: 'blades-in-the-dark',
    exportedAt: new Date().toISOString(),
    characters: publicChars.value,
    locations:  publicLocs.value,
    factions:   facStore.exportSnapshot(),
    items:      publicItems.value,
    crew:       crewStore.exportSnapshot(),
    journal:    publicJournal.value,
  }
}

// ── Save via File System Access API (with download fallback) ─────────────────

async function startDeploy() {
  saveError.value = ''
  const json = JSON.stringify(buildExportData(), null, 2)

  // Modern browsers: let user pick exactly where to save the file
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: 'campaign-data.json',
        types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
      })
      const writable = await handle.createWritable()
      await writable.write(json)
      await writable.close()
      status.value = 'saved'
    } catch (err: any) {
      // User cancelled — don't show an error
      if (err?.name !== 'AbortError') {
        saveError.value = 'Save failed. Try again or use the download fallback below.'
        console.error(err)
      }
    }
    return
  }

  // Fallback: trigger a browser download
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'campaign-data.json'
  a.click()
  URL.revokeObjectURL(url)
  status.value = 'saved'
}

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(deployCommand.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // clipboard not available — silently ignore
  }
}
</script>

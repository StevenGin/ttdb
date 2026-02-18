<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-lancer-text glow-accent">HOMEBREW</h1>
        <p class="text-lancer-muted font-mono text-sm mt-1">Manage custom content packages</p>
      </div>
      <div class="flex gap-2">
        <label class="lancer-btn-outline text-xs cursor-pointer">
          ↑ Import Package
          <input type="file" accept=".json" class="hidden" @change="importPackage" />
        </label>
        <button class="lancer-btn-ghost text-xs" @click="showCreateForm = true">+ Create Empty</button>
      </div>
    </div>

    <!-- What's supported -->
    <div class="lancer-card p-4 mb-6 border-lancer-accent/20">
      <h2 class="text-sm text-lancer-accent mb-2 uppercase font-mono tracking-widest">Supported Content Types</h2>
      <div class="flex flex-wrap gap-2">
        <span v-for="t in supportedTypes" :key="t" class="lancer-badge-muted text-xs">{{ t }}</span>
      </div>
      <p class="text-lancer-muted font-mono text-xs mt-3">
        Import a JSON file matching the TTDB homebrew schema, or create an empty package and edit it here.
        Active packages are merged into the Compendium.
      </p>
    </div>

    <!-- Packages list -->
    <div v-if="compendiumStore.homebrewPackages.length === 0" class="text-center py-16">
      <div class="text-6xl mb-4 opacity-20">◎</div>
      <div class="text-lancer-muted font-mono text-sm">No homebrew packages loaded.</div>
    </div>

    <div class="space-y-3">
      <div
        v-for="pkg in compendiumStore.homebrewPackages"
        :key="pkg.id"
        class="lancer-card p-4"
        :class="{ 'border-lancer-accent/40': pkg.active }"
      >
        <div class="flex items-start justify-between flex-wrap gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span
                class="w-2 h-2 rounded-full"
                :class="pkg.active ? 'bg-lancer-accent' : 'bg-lancer-muted'"
              ></span>
              <h3 class="font-display font-bold text-lancer-text">{{ pkg.name }}</h3>
              <span v-if="pkg.version" class="lancer-badge-muted text-[10px]">v{{ pkg.version }}</span>
            </div>
            <div v-if="pkg.author" class="text-xs font-mono text-lancer-muted mb-1">by {{ pkg.author }}</div>
            <div v-if="pkg.description" class="text-xs font-mono text-lancer-muted/80">{{ pkg.description }}</div>
            <!-- Content summary -->
            <div class="flex flex-wrap gap-2 mt-2">
              <span v-if="pkg.frames?.length" class="lancer-badge-muted text-[10px]">{{ pkg.frames.length }} Frames</span>
              <span v-if="pkg.weapons?.length" class="lancer-badge-muted text-[10px]">{{ pkg.weapons.length }} Weapons</span>
              <span v-if="pkg.systems?.length" class="lancer-badge-muted text-[10px]">{{ pkg.systems.length }} Systems</span>
              <span v-if="pkg.npcClasses?.length" class="lancer-badge-muted text-[10px]">{{ pkg.npcClasses.length }} NPC Classes</span>
              <span v-if="pkg.talents?.length" class="lancer-badge-muted text-[10px]">{{ pkg.talents.length }} Talents</span>
            </div>
          </div>
          <div class="flex gap-2 items-center">
            <button
              class="text-xs font-mono px-3 py-1 border transition-all"
              :class="pkg.active
                ? 'border-lancer-accent text-lancer-accent hover:bg-lancer-accent hover:text-lancer-bg'
                : 'border-lancer-border text-lancer-muted hover:border-lancer-border-light hover:text-lancer-text'"
              @click="compendiumStore.toggleHomebrewPackage(pkg.id)"
            >
              {{ pkg.active ? 'Active' : 'Inactive' }}
            </button>
            <button class="lancer-btn-ghost text-xs py-1" @click="exportPackage(pkg)">↓ Export</button>
            <button class="lancer-btn-danger text-xs py-1" @click="removePackage(pkg.id)">✕</button>
          </div>
        </div>

        <!-- Edit raw JSON -->
        <div class="mt-3 pt-3 border-t border-lancer-border">
          <button
            class="text-[10px] font-mono text-lancer-muted hover:text-lancer-accent"
            @click="toggleRawEdit(pkg.id)"
          >
            {{ rawEditId === pkg.id ? '▾ Hide' : '▸ Edit Raw JSON' }}
          </button>
          <div v-if="rawEditId === pkg.id" class="mt-2">
            <textarea
              v-model="rawEdits[pkg.id]"
              class="lancer-textarea font-mono text-xs w-full"
              rows="12"
            ></textarea>
            <div class="flex gap-2 mt-2">
              <button class="lancer-btn-primary text-xs" @click="saveRawEdit(pkg.id)">Save JSON</button>
              <button class="lancer-btn-ghost text-xs" @click="rawEditId = null">Cancel</button>
            </div>
            <div v-if="rawEditError" class="text-lancer-red-light font-mono text-xs mt-1">{{ rawEditError }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create empty package form -->
    <div v-if="showCreateForm" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="lancer-card p-6 w-full max-w-md">
        <h2 class="text-lg mb-4">Create Homebrew Package</h2>
        <div class="space-y-3">
          <div>
            <label class="lancer-label">Package Name *</label>
            <input v-model="newPkgName" class="lancer-input" placeholder="My Homebrew" />
          </div>
          <div>
            <label class="lancer-label">Author</label>
            <input v-model="newPkgAuthor" class="lancer-input" placeholder="Your name" />
          </div>
          <div>
            <label class="lancer-label">Version</label>
            <input v-model="newPkgVersion" class="lancer-input" placeholder="1.0.0" />
          </div>
          <div>
            <label class="lancer-label">Description</label>
            <textarea v-model="newPkgDesc" class="lancer-textarea" rows="2"></textarea>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="lancer-btn-primary text-xs" @click="confirmCreate">Create</button>
          <button class="lancer-btn-ghost text-xs" @click="showCreateForm = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCompendiumStore } from '@/stores/compendium'
import type { HomebrewPackage } from '@/types/lancer'

const compendiumStore = useCompendiumStore()

const supportedTypes = [
  'Frames', 'Weapons', 'Systems', 'Core Bonuses',
  'NPC Classes', 'NPC Templates', 'NPC Features',
  'Talents', 'Pilot Gear', 'Manufacturers', 'Tags',
]

// Import
function importPackage(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string) as HomebrewPackage
      if (!data.id) data.id = Math.random().toString(36).slice(2)
      if (data.active === undefined) data.active = true
      compendiumStore.addHomebrewPackage(data)
    } catch (err) {
      alert('Failed to parse JSON: ' + (err as Error).message)
    }
    ;(e.target as HTMLInputElement).value = ''
  }
  reader.readAsText(file)
}

// Export
function exportPackage(pkg: HomebrewPackage) {
  const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${pkg.id}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function removePackage(id: string) {
  if (confirm('Remove this homebrew package?')) compendiumStore.removeHomebrewPackage(id)
}

// Raw edit
const rawEditId = ref<string | null>(null)
const rawEdits = reactive<Record<string, string>>({})
const rawEditError = ref('')

function toggleRawEdit(id: string) {
  if (rawEditId.value === id) {
    rawEditId.value = null
  } else {
    rawEditId.value = id
    rawEditError.value = ''
    const pkg = compendiumStore.homebrewPackages.find(p => p.id === id)
    if (pkg) rawEdits[id] = JSON.stringify(pkg, null, 2)
  }
}

function saveRawEdit(id: string) {
  try {
    const updated = JSON.parse(rawEdits[id]) as HomebrewPackage
    compendiumStore.updateHomebrewPackage(updated)
    rawEditId.value = null
    rawEditError.value = ''
  } catch (err) {
    rawEditError.value = 'Invalid JSON: ' + (err as Error).message
  }
}

// Create
const showCreateForm = ref(false)
const newPkgName = ref('')
const newPkgAuthor = ref('')
const newPkgVersion = ref('1.0.0')
const newPkgDesc = ref('')

function confirmCreate() {
  if (!newPkgName.value.trim()) return
  const pkg: HomebrewPackage = {
    id: newPkgName.value.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now(),
    name: newPkgName.value,
    author: newPkgAuthor.value || undefined,
    version: newPkgVersion.value || '1.0.0',
    description: newPkgDesc.value || undefined,
    active: true,
    frames: [],
    weapons: [],
    systems: [],
    npcClasses: [],
    npcTemplates: [],
    npcFeatures: [],
    talents: [],
  }
  compendiumStore.addHomebrewPackage(pkg)
  showCreateForm.value = false
  newPkgName.value = ''
  newPkgAuthor.value = ''
  newPkgVersion.value = '1.0.0'
  newPkgDesc.value = ''
}
</script>

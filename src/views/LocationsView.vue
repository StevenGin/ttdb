<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-blades-text glow-gold">Locations</h1>
        <p class="text-blades-muted font-mono text-sm mt-1">
          {{ store.locations.length }} location{{ store.locations.length !== 1 ? 's' : '' }}
        </p>
      </div>
      <div v-if="!isStatic" class="flex gap-2">
        <button class="blades-btn-gold" @click="openAdd(null)">+ Add Root Location</button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="store.roots().length === 0" class="text-center py-24">
      <div class="text-5xl mb-4 opacity-10">🗺</div>
      <p class="text-blades-muted font-mono text-sm mb-4">No locations defined.</p>
      <p class="text-blades-muted/60 font-mono text-xs mb-6">
        Build your world from the top down:<br/>
        World → City → District → Area → Site → Room
      </p>
      <button v-if="!isStatic" class="blades-btn-outline" @click="openAdd(null)">Add Your First Location</button>
    </div>

    <!-- Tree -->
    <div class="max-w-3xl">
      <!-- Search -->
      <div v-if="store.locations.length > 0" class="mb-4">
        <input v-model="search" class="blades-input max-w-xs" placeholder="Search locations..." />
      </div>

      <!-- Flat search results -->
      <div v-if="search" class="space-y-1">
        <div
          v-for="loc in searchResults"
          :key="loc.id"
          class="blades-card p-3 flex items-center gap-3"
        >
          <span class="text-xs font-mono w-4" :class="`loc-type-${loc.type}`">
            {{ TYPE_ICONS[loc.type] }}
          </span>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-sans font-semibold text-sm text-blades-text">{{ loc.name }}</span>
              <span class="blades-badge-muted text-[10px]">{{ LOCATION_TYPE_LABELS[loc.type] }}</span>
            </div>
            <div v-if="ancestorPath(loc.id)" class="text-[10px] font-mono text-blades-muted mt-0.5">
              {{ ancestorPath(loc.id) }}
            </div>
          </div>
          <div v-if="!isStatic" class="flex gap-1">
            <button class="blades-btn-ghost text-xs py-0.5 px-2" @click="openEdit(loc.id)">Edit</button>
            <button class="blades-btn-ghost text-xs py-0.5 px-2" @click="openAdd(loc.id)">+ Child</button>
            <button class="blades-btn-danger text-xs py-0.5 px-2" @click="del(loc.id)">✕</button>
          </div>
        </div>
        <div v-if="searchResults.length === 0" class="text-blades-muted font-mono text-sm text-center py-8">
          No locations match "{{ search }}"
        </div>
      </div>

      <!-- Tree view -->
      <div v-else class="blades-card divide-y divide-blades-border/30">
        <div v-if="store.roots().length === 0 && store.locations.length > 0" class="p-4 text-blades-muted font-mono text-sm">
          No root locations. All locations have a parent.
        </div>
        <div class="p-2">
          <LocationNode
            v-for="root in store.roots().sort((a,b) => a.name.localeCompare(b.name))"
            :key="root.id"
            :loc="root"
            :all-locations="store.locations"
            :is-static="isStatic"
            @edit="openEdit"
            @add-child="openAdd"
            @delete="del"
          />
        </div>
      </div>
    </div>

    <!-- Add / Edit modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="blades-card p-6 w-full max-w-lg">
        <h2 class="text-xl mb-4">{{ editId ? 'Edit Location' : 'Add Location' }}</h2>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="blades-label">Name *</label>
              <input v-model="form.name" class="blades-input" placeholder="e.g. The Leaky Bucket" />
            </div>
            <div>
              <label class="blades-label">Type</label>
              <select v-model="form.type" class="blades-select">
                <option v-for="t in LOCATION_TYPES" :key="t" :value="t">{{ LOCATION_TYPE_LABELS[t] }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="blades-label">Parent Location</label>
            <select v-model="form.parentId" class="blades-select">
              <option :value="null">— None (root) —</option>
              <option
                v-for="loc in otherLocations"
                :key="loc.id"
                :value="loc.id"
              >{{ indentedName(loc) }}</option>
            </select>
          </div>
          <div>
            <label class="blades-label">Description</label>
            <textarea v-model="form.description" class="blades-textarea" rows="3" placeholder="What is this place?" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="blades-label">Controlled By (Faction)</label>
              <input v-model="form.controlledBy" class="blades-input" placeholder="Faction name" />
            </div>
            <div>
              <label class="blades-label">Tags (comma-separated)</label>
              <input v-model="tagsInput" class="blades-input" placeholder="e.g. tavern, canal, secret" />
            </div>
          </div>
          <div>
            <label class="blades-label">GM Notes</label>
            <textarea v-model="form.notes" class="blades-textarea" rows="2" placeholder="Private GM notes" />
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="blades-btn-gold text-xs" @click="submit">{{ editId ? 'Save' : 'Create' }}</button>
          <button class="blades-btn-ghost text-xs" @click="showForm = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocationsStore } from '@/stores/locations'
import type { Location, LocationType } from '@/types/blades'
import { LOCATION_TYPES, LOCATION_TYPE_LABELS } from '@/types/blades'
import LocationNode from '@/components/LocationNode.vue'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const store = useLocationsStore()
const search = ref('')

const TYPE_ICONS: Record<string, string> = {
  world: '🌍', city: '🏙', district: '🏘', area: '📍',
  site: '🏛', room: '🚪', other: '◆',
}

// ── Search ────────────────────────────────────────────────────────────────
const searchResults = computed(() => {
  const q = search.value.toLowerCase()
  return store.locations.filter(l =>
    l.name.toLowerCase().includes(q) ||
    l.description?.toLowerCase().includes(q) ||
    l.tags?.some(t => t.toLowerCase().includes(q))
  )
})

function ancestorPath(id: string) {
  return store.ancestors(id).map(a => a.name).join(' › ')
}

// ── Add / Edit form ────────────────────────────────────────────────────────
const showForm = ref(false)
const editId = ref<string | null>(null)
const tagsInput = ref('')
const form = ref<Partial<Location & { parentId: string | null }>>({
  name: '', type: 'site', parentId: null, description: '', notes: '', controlledBy: '',
})

function openAdd(parentId: string | null) {
  editId.value = null
  tagsInput.value = ''
  form.value = { name: '', type: 'site', parentId, description: '', notes: '', controlledBy: '' }
  showForm.value = true
}

function openEdit(id: string) {
  const loc = store.get(id)
  if (!loc) return
  editId.value = id
  tagsInput.value = (loc.tags ?? []).join(', ')
  form.value = { ...loc }
  showForm.value = true
}

function submit() {
  if (!form.value.name?.trim()) return
  const tags = tagsInput.value ? tagsInput.value.split(',').map(t => t.trim()).filter(Boolean) : undefined
  const data = { ...form.value, tags }
  if (editId.value) {
    store.update(editId.value, data)
  } else {
    store.create(data)
  }
  showForm.value = false
}

function del(id: string) {
  const loc = store.get(id)
  const childCount = store.descendants(id).length
  const msg = childCount > 0
    ? `Delete "${loc?.name}" and its ${childCount} sub-location(s)?`
    : `Delete "${loc?.name}"?`
  if (confirm(msg)) store.remove(id)
}

// ── Parent selector helpers ────────────────────────────────────────────────
const otherLocations = computed(() =>
  store.locations
    .filter(l => l.id !== editId.value)
    .sort((a, b) => a.name.localeCompare(b.name))
)

function indentedName(loc: Location) {
  const depth = store.ancestors(loc.id).length
  return '  '.repeat(depth) + loc.name + ` (${LOCATION_TYPE_LABELS[loc.type]})`
}
</script>

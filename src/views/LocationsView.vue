<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-blades-text glow-gold">Locations</h1>
        <p class="text-blades-muted font-mono text-sm mt-1">
          {{ store.locations.length }} location{{ store.locations.length !== 1 ? 's' : '' }}
        </p>
      </div>
      <button v-if="!isStatic" class="blades-btn-gold" @click="openAdd(null)">+ Add Root Location</button>
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
      <div v-if="store.locations.length > 0" class="mb-4">
        <input v-model="search" class="blades-input max-w-xs" placeholder="Search locations..." />
      </div>

      <!-- Flat search results -->
      <div v-if="search" class="space-y-1">
        <div
          v-for="loc in searchResults"
          :key="loc.id"
          class="blades-card p-3 flex items-center gap-3 cursor-pointer hover:border-blades-border-light transition-colors"
          @click="openDrawer(loc.id)"
        >
          <span class="text-xs font-mono w-4">{{ TYPE_ICONS[loc.type] }}</span>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-sans font-semibold text-sm text-blades-text">{{ loc.name }}</span>
              <span class="blades-badge-muted text-[10px]">{{ LOCATION_TYPE_LABELS[loc.type] }}</span>
            </div>
            <div v-if="ancestorPath(loc.id)" class="text-[10px] font-mono text-blades-muted mt-0.5">
              {{ ancestorPath(loc.id) }}
            </div>
          </div>
          <div v-if="!isStatic" class="flex gap-1" @click.stop>
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
          No root locations.
        </div>
        <div class="p-2">
          <LocationNode
            v-for="root in store.roots().sort((a,b) => a.name.localeCompare(b.name))"
            :key="root.id"
            :loc="root"
            :all-locations="store.locations"
            :is-static="isStatic"
            :faction-map="factionMap"
            @view="openDrawer"
            @add-child="openAdd"
            @delete="del"
          />
        </div>
      </div>
    </div>

    <!-- Add child modal (lightweight) -->
    <div v-if="showForm" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="blades-card p-6 w-full max-w-md">
        <h2 class="text-xl mb-4">Add Location</h2>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="blades-label">Name *</label>
              <input v-model="form.name" class="blades-input" placeholder="Location name" autofocus />
            </div>
            <div>
              <label class="blades-label">Type</label>
              <select v-model="form.type" class="blades-select">
                <option v-for="t in LOCATION_TYPES" :key="t" :value="t">{{ LOCATION_TYPE_LABELS[t] }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="blades-label">Parent</label>
            <select v-model="form.parentId" class="blades-select">
              <option :value="null">— None (root) —</option>
              <option v-for="loc in allLocations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
            </select>
          </div>
          <div>
            <label class="blades-label">Description</label>
            <textarea v-model="form.description" class="blades-textarea" rows="2" />
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="blades-btn-gold text-xs" @click="submit">Create</button>
          <button class="blades-btn-ghost text-xs" @click="showForm = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Location detail drawer -->
    <LocationDrawer
      :open="drawerOpen"
      :location-id="selectedId"
      @close="drawerOpen = false"
      @deleted="drawerOpen = false"
      @navigate="openDrawer"
      @add-child="(id) => { drawerOpen = false; openAdd(id) }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocationsStore } from '@/stores/locations'
import { useFactionsStore } from '@/stores/factions'
import type { Location, LocationType } from '@/types/blades'
import { LOCATION_TYPES, LOCATION_TYPE_LABELS } from '@/types/blades'
import LocationNode from '@/components/LocationNode.vue'
import LocationDrawer from '@/components/LocationDrawer.vue'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const store = useLocationsStore()
const facStore = useFactionsStore()
const search = ref('')

const TYPE_ICONS: Record<string, string> = {
  world: '🌍', city: '🏙', district: '🏘', area: '📍',
  site: '🏛', room: '🚪', other: '◆',
}

// Build faction id → name map for LocationNode
const factionMap = computed(() => {
  const map: Record<string, string> = {}
  for (const f of facStore.factions) map[f.id] = f.name
  return map
})

// ── Drawer ────────────────────────────────────────────────────────────────
const drawerOpen = ref(false)
const selectedId = ref<string | null>(null)

function openDrawer(id: string) {
  selectedId.value = id
  drawerOpen.value = true
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

// ── Add form (for creating new locations) ──────────────────────────────────
const showForm = ref(false)
const form = ref<Partial<Location & { parentId: string | null }>>({})

const allLocations = computed(() =>
  store.locations.sort((a, b) => a.name.localeCompare(b.name))
)

function openAdd(parentId: string | null) {
  form.value = { name: '', type: 'site', parentId, description: '' }
  showForm.value = true
}

function submit() {
  if (!form.value.name?.trim()) return
  const created = store.create(form.value)
  showForm.value = false
  // Open the drawer for the new location
  openDrawer(created.id)
}

function del(id: string) {
  const loc = store.get(id)
  const childCount = store.descendants(id).length
  const msg = childCount > 0
    ? `Delete "${loc?.name}" and its ${childCount} sub-location(s)?`
    : `Delete "${loc?.name}"?`
  if (confirm(msg)) store.remove(id)
}
</script>

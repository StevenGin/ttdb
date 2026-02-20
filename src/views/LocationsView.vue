<template>
  <div class="flex flex-col h-screen overflow-hidden">

    <!-- Top bar: breadcrumb + actions -->
    <div class="flex-shrink-0 px-6 pt-5 pb-3 border-b border-blades-border flex items-center gap-4 flex-wrap">
      <div class="flex-1 min-w-0">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-1 flex-wrap font-mono text-sm">
          <button
            class="transition-colors"
            :class="currentId === null ? 'text-blades-gold font-semibold' : 'text-blades-muted hover:text-blades-gold'"
            @click="navigate(null)"
          >World Map</button>
          <template v-for="crumb in breadcrumbs" :key="crumb.id">
            <span class="text-blades-border-light">›</span>
            <button
              class="transition-colors"
              :class="crumb.id === currentId ? 'text-blades-gold font-semibold' : 'text-blades-muted hover:text-blades-gold'"
              @click="navigate(crumb.id)"
            >{{ crumb.name }}</button>
          </template>
          <template v-if="current">
            <span class="text-blades-border-light">›</span>
            <span class="text-blades-gold font-semibold">{{ current.name }}</span>
          </template>
        </div>
        <!-- Title -->
        <h1 class="text-2xl font-serif mt-0.5 leading-tight" :class="current ? 'text-blades-text glow-amber' : 'text-blades-text'">
          {{ current?.name ?? 'All Locations' }}
        </h1>
      </div>

      <button
        v-if="!isStatic && current?.type !== 'site'"
        class="blades-btn-ghost text-xs py-1.5"
        @click="openAdd(currentId)"
      >
        + Add {{ current ? LOCATION_TYPE_LABELS[LOCATION_CHILD_TYPE[current.type]!] : 'Region' }}
      </button>
    </div>

    <!-- Main body: grid (left) + info panel (right) -->
    <div class="flex flex-1 overflow-hidden">

      <!-- Grid -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Empty -->
        <div v-if="gridItems.length === 0" class="flex flex-col items-center justify-center h-full py-12 text-center">
          <div class="text-6xl mb-4 opacity-10 select-none">
            {{ current ? TYPE_ICONS[current.type] : '🌍' }}
          </div>
          <p class="text-blades-muted font-mono text-sm">
            {{ current ? `${current.name} has no sub-locations yet.` : 'No locations defined yet.' }}
          </p>
          <button
            v-if="!isStatic && current?.type !== 'site'"
            class="blades-btn-outline text-xs mt-4"
            @click="openAdd(currentId)"
          >
            + Add {{ current ? LOCATION_TYPE_LABELS[LOCATION_CHILD_TYPE[current.type]!] : 'first Region' }}
          </button>
        </div>

        <!-- Card grid -->
        <div v-else class="grid gap-4" :class="gridCols">
          <button
            v-for="loc in gridItems"
            :key="loc.id"
            class="location-card group text-left"
            @click="navigate(loc.id)"
          >
            <div class="aspect-square w-full overflow-hidden rounded relative bg-blades-card">
              <!-- Banner image -->
              <img
                v-if="loc.bannerImage"
                :src="loc.bannerImage"
                :alt="loc.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <!-- Placeholder -->
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="text-5xl opacity-[0.08] select-none">{{ TYPE_ICONS[loc.type] }}</span>
              </div>

              <!-- Dark gradient overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              <!-- Child count -->
              <div
                v-if="childCount(loc.id) > 0"
                class="absolute top-2 right-2 bg-black/55 backdrop-blur-sm text-[10px] font-mono
                       text-blades-muted/90 px-1.5 py-0.5 rounded"
              >{{ childCount(loc.id) }} ›</div>

              <!-- ✦ AI badge (no image) -->
              <button
                v-if="!isStatic && !loc.bannerImage"
                class="absolute top-2 left-2 bg-black/55 backdrop-blur-sm text-[10px] font-mono
                       text-amber-400 border border-amber-800/60 px-1.5 py-0.5 rounded
                       opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-900/40"
                @click.stop="generateBanner(loc)"
              >✦ AI</button>

              <!-- Name + type -->
              <div class="absolute bottom-0 left-0 right-0 p-3">
                <div class="text-white font-serif font-semibold text-sm leading-tight drop-shadow-lg">
                  {{ loc.name }}
                </div>
                <div class="text-white/55 font-mono text-[10px] mt-0.5 flex items-center gap-2">
                  <span>{{ LOCATION_TYPE_LABELS[loc.type] }}</span>
                  <span v-if="factionMap[loc.controlledBy ?? '']" class="text-amber-400/70">
                    ⚑ {{ factionMap[loc.controlledBy!] }}
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Right info panel (shown when drilled into a location) -->
      <Transition name="slide-info">
        <div
          v-if="current"
          class="w-72 xl:w-80 flex-shrink-0 border-l border-blades-border overflow-y-auto flex flex-col bg-blades-surface"
        >
          <!-- Banner -->
          <BannerImage
            :model-value="current.bannerImage"
            :subject="`${current.name}, ${LOCATION_TYPE_LABELS[current.type]} in Aurelion`"
            :description="current.description"
            :height="160"
            @update:model-value="locStore.update(current!.id, { bannerImage: $event })"
          />

          <div class="p-4 space-y-4 flex-1 overflow-y-auto">
            <!-- Badges -->
            <div class="flex flex-wrap gap-1.5">
              <span class="blades-badge-muted text-xs">{{ LOCATION_TYPE_LABELS[current.type] }}</span>
              <span v-if="controllingFaction" class="blades-badge-muted text-xs">⚑ {{ controllingFaction.name }}</span>
            </div>

            <!-- Tags -->
            <div v-if="current.tags?.length" class="flex flex-wrap gap-1">
              <span
                v-for="tag in current.tags" :key="tag"
                class="blades-badge text-[10px] border-blades-border text-blades-muted/70"
              >{{ tag }}</span>
            </div>

            <!-- Description -->
            <div v-if="current.description">
              <div class="blades-label">Description</div>
              <p class="text-blades-text/90 font-sans text-xs leading-relaxed">{{ current.description }}</p>
            </div>

            <!-- Notes -->
            <div v-if="current.notes">
              <div class="blades-label">Notes</div>
              <p class="text-blades-muted font-mono text-xs leading-relaxed italic">{{ current.notes }}</p>
            </div>

            <div v-if="!current.description && !current.notes && !current.tags?.length && current.type !== 'site'"
                 class="text-blades-muted/50 font-mono text-xs italic text-center py-4">
              No details yet.
            </div>

            <!-- NPC list (sites only) -->
            <div v-if="current.type === 'site'">
              <div class="blades-label mb-2">NPCs Here</div>
              <div v-if="siteNpcs.length === 0" class="text-blades-muted/50 font-mono text-xs italic py-2">
                No NPCs assigned to this location.
              </div>
              <div v-else class="space-y-1">
                <div
                  v-for="npc in siteNpcs"
                  :key="npc.id"
                  class="flex items-center gap-2 px-2 py-1.5 rounded border border-blades-border bg-blades-card/30"
                >
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-sans text-blades-text truncate">{{ npc.name }}</div>
                    <div v-if="npc.alias" class="text-[10px] font-mono text-blades-muted/70 truncate">"{{ npc.alias }}"</div>
                  </div>
                  <span v-if="npc.role" class="blades-badge-muted text-[10px] flex-shrink-0">{{ npc.role }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div v-if="!isStatic" class="flex-shrink-0 p-3 border-t border-blades-border flex gap-2">
            <button class="blades-btn-outline text-xs flex-1 py-1.5" @click="openDrawer(current!.id)">Edit</button>
            <button
              v-if="current!.type !== 'site'"
              class="blades-btn-ghost text-xs py-1.5 px-2"
              @click="openAdd(current!.id)"
              :title="'Add ' + LOCATION_TYPE_LABELS[LOCATION_CHILD_TYPE[current!.type]!]"
            >+</button>
            <button class="blades-btn-danger text-xs py-1.5 px-2" @click="del(current!.id)" title="Delete">✕</button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Create location modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="blades-card p-6 w-full max-w-md">
        <h2 class="text-xl mb-1">{{ addParentId ? 'Add Sub-location' : 'Add Root Location' }}</h2>
        <div v-if="addParentId" class="text-xs font-mono text-blades-muted mb-4">
          inside <span class="text-blades-text">{{ locStore.get(addParentId)?.name }}</span>
        </div>
        <div v-else class="mb-4" />
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="blades-label">Name *</label>
              <input v-model="form.name" class="blades-input" placeholder="Location name" autofocus />
            </div>
            <div>
              <label class="blades-label">Type</label>
              <div class="blades-input flex items-center gap-2 text-blades-muted cursor-default select-none">
                <span>{{ TYPE_ICONS[form.type as string] }}</span>
                <span>{{ LOCATION_TYPE_LABELS[form.type as LocationType] }}</span>
              </div>
            </div>
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

    <!-- Edit drawer (full form) -->
    <LocationDrawer
      :open="drawerOpen"
      :location-id="drawerLocationId"
      @close="drawerOpen = false"
      @deleted="onDrawerDeleted"
      @navigate="navigate"
      @add-child="openAdd"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocationsStore } from '@/stores/locations'
import { useFactionsStore } from '@/stores/factions'
import { useCharactersStore } from '@/stores/characters'
import type { Location, LocationType } from '@/types/blades'
import { LOCATION_TYPE_LABELS, LOCATION_CHILD_TYPE } from '@/types/blades'
import BannerImage from '@/components/BannerImage.vue'
import LocationDrawer from '@/components/LocationDrawer.vue'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const locStore = useLocationsStore()
const facStore = useFactionsStore()
const charStore = useCharactersStore()

// ── Navigation ─────────────────────────────────────────────────────────────
const currentId = ref<string | null>(null)

const current = computed(() => (currentId.value ? locStore.get(currentId.value) ?? null : null))

// Children of current location shown in the grid
const gridItems = computed(() =>
  locStore.children(currentId.value).sort((a, b) => a.name.localeCompare(b.name))
)

// Responsive columns: fewer items = larger cards
const gridCols = computed(() => {
  const n = gridItems.value.length
  if (n <= 2) return 'grid-cols-2'
  if (n <= 4) return 'grid-cols-2 sm:grid-cols-3'
  if (n <= 9) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
  return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
})

// Ancestors of currentId for breadcrumb (excludes currentId itself)
const breadcrumbs = computed(() => (currentId.value ? locStore.ancestors(currentId.value) : []))

function navigate(id: string | null) {
  currentId.value = id
}

function childCount(id: string) {
  return locStore.children(id).length
}

// ── Faction helpers ────────────────────────────────────────────────────────
const factionMap = computed(() => {
  const map: Record<string, string> = {}
  for (const f of facStore.factions) map[f.id] = f.name
  return map
})

const controllingFaction = computed(() =>
  current.value?.controlledBy ? facStore.get(current.value.controlledBy) ?? null : null
)

// ── AI banner ──────────────────────────────────────────────────────────────
function generateBanner(loc: Location) {
  const style = 'studio ghibli anime style, Frieren aesthetic, soft watercolor illustration, fantasy atmosphere'
  const prompt = `${loc.name}, ${LOCATION_TYPE_LABELS[loc.type]} in a dark fantasy city, ${loc.description?.slice(0, 80) ?? ''}, ${style}`
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 9999)}&model=flux`
  const img = new Image()
  img.onload = () => locStore.update(loc.id, { bannerImage: url })
  img.src = url
}

// ── Type icons ─────────────────────────────────────────────────────────────
const TYPE_ICONS: Record<string, string> = {
  region: '🌏', city: '🏙', district: '🏘', site: '🏛',
}

// ── NPC list for sites ─────────────────────────────────────────────────────
const siteNpcs = computed(() =>
  current.value?.type === 'site'
    ? charStore.characters.filter(c => c.isNpc && c.locationId === current.value!.id)
    : []
)

// ── Drawer ──────────────────────────────────────────────────────────────────
const drawerOpen = ref(false)
const drawerLocationId = ref<string | null>(null)

function openDrawer(id: string) {
  drawerLocationId.value = id
  drawerOpen.value = true
}

function onDrawerDeleted() {
  drawerOpen.value = false
  if (drawerLocationId.value === currentId.value) {
    const loc = locStore.get(drawerLocationId.value ?? '')
    currentId.value = loc?.parentId ?? null
  }
}

// ── Add form ────────────────────────────────────────────────────────────────
const showForm = ref(false)
const addParentId = ref<string | null>(null)
const form = ref<Partial<Location>>({})

function openAdd(parentId: string | null) {
  addParentId.value = parentId
  const parentType = parentId ? locStore.get(parentId)?.type ?? null : null
  const childType: LocationType = parentType
    ? (LOCATION_CHILD_TYPE[parentType] ?? 'site')
    : 'region'
  form.value = { name: '', type: childType, description: '' }
  showForm.value = true
}

function submit() {
  if (!form.value.name?.trim()) return
  const created = locStore.create({ ...form.value, parentId: addParentId.value })
  showForm.value = false
  currentId.value = addParentId.value
  openDrawer(created.id)
}

// ── Delete ──────────────────────────────────────────────────────────────────
function del(id: string) {
  const loc = locStore.get(id)
  const n = locStore.descendants(id).length
  const msg = n > 0 ? `Delete "${loc?.name}" and its ${n} sub-location(s)?` : `Delete "${loc?.name}"?`
  if (confirm(msg)) {
    const parentId = loc?.parentId ?? null
    locStore.remove(id)
    currentId.value = parentId
  }
}
</script>

<style scoped>
.location-card {
  @apply rounded overflow-hidden border border-blades-border transition-all duration-200;
}
.location-card:hover {
  @apply border-blades-gold/40;
  box-shadow: 0 0 20px rgba(201, 168, 76, 0.1);
}

.slide-info-enter-active,
.slide-info-leave-active { transition: all 0.22s ease; }
.slide-info-enter-from,
.slide-info-leave-to { opacity: 0; transform: translateX(16px); }
</style>

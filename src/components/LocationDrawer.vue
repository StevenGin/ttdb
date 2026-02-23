<!-- Location detail + edit drawer -->
<template>
  <Drawer :open="open" @close="$emit('close')">
    <template #header>
      <div class="flex-1 min-w-0" v-if="loc">
        <div v-if="!editing" class="flex items-center gap-2 flex-wrap">
          <span class="font-mono text-xs">{{ TYPE_ICONS[loc.type] }}</span>
          <span class="font-serif text-xl text-blades-text">{{ loc.name }}</span>
          <span class="blades-badge-muted text-[10px]">{{ LOCATION_TYPE_LABELS[loc.type] }}</span>
        </div>
        <div v-else class="text-blades-muted font-mono text-xs">Editing Location</div>
      </div>
    </template>

    <template v-if="loc">
      <!-- Banner -->
      <BannerImage
        :model-value="loc.bannerImage"
        :subject="loc.name + ', ' + (LOCATION_TYPE_LABELS[loc.type] ?? loc.type) + ' in Aurelion'"
        :description="loc.description"
        :height="180"
        @update:model-value="locStore.update(loc.id, { bannerImage: $event })"
      />

      <!-- View mode -->
      <div v-if="!editing" class="p-5 space-y-5">
        <!-- Quick toggles (edit mode only) -->
        <div v-if="!isStatic" class="flex items-center gap-3">
          <button
            class="text-base leading-none transition-colors"
            :class="loc.isFavorite ? 'text-blades-gold' : 'text-blades-muted/30 hover:text-blades-muted'"
            :title="loc.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
            @click="locStore.update(loc.id, { isFavorite: !loc.isFavorite })"
          >★</button>
          <button
            class="font-mono text-xs border rounded px-1.5 py-0.5 transition-colors"
            :class="loc.isPublic === false
              ? 'text-blades-muted border-blades-border hover:border-blades-border-light'
              : 'text-blades-sage-light border-blades-sage/40 hover:border-blades-sage'"
            :title="loc.isPublic === false ? 'Private — click to make public' : 'Public — click to make private'"
            @click="locStore.update(loc.id, { isPublic: loc.isPublic === false ? undefined : false })"
          >{{ loc.isPublic === false ? '🔒 Private' : '🌐 Public' }}</button>
        </div>

        <!-- Breadcrumb -->
        <div v-if="ancestors.length" class="flex items-center gap-1 flex-wrap text-[11px] font-mono text-blades-muted">
          <span v-for="(a, i) in ancestors" :key="a.id">
            <span v-if="i > 0" class="mx-1 opacity-40">›</span>
            {{ a.name }}
          </span>
        </div>

        <!-- Controlling faction -->
        <div v-if="controllingFaction" class="flex items-center gap-2">
          <span class="blades-badge-muted text-xs">⚑ {{ controllingFaction.name }}</span>
        </div>

        <!-- Tags -->
        <div v-if="loc.tags?.length" class="flex flex-wrap gap-1">
          <span
            v-for="tag in loc.tags" :key="tag"
            class="blades-badge text-[10px] border-blades-border text-blades-muted/80"
          >{{ tag }}</span>
        </div>

        <!-- Description -->
        <div v-if="loc.description">
          <div class="blades-label">Description</div>
          <p class="text-blades-text font-sans text-sm leading-relaxed whitespace-pre-wrap">{{ loc.description }}</p>
        </div>

        <!-- Notes -->
        <div v-if="loc.notes">
          <div class="blades-label">Notes</div>
          <p class="text-blades-muted font-mono text-sm leading-relaxed whitespace-pre-wrap">{{ loc.notes }}</p>
        </div>

        <!-- Children -->
        <div v-if="children.length">
          <div class="blades-label mb-2">Locations Within</div>
          <div class="space-y-1">
            <button
              v-for="child in children"
              :key="child.id"
              class="w-full flex items-center gap-2 px-3 py-2 text-left border border-blades-border
                     rounded hover:border-blades-border-light hover:bg-blades-card/50 transition-colors"
              @click="$emit('navigate', child.id)"
            >
              <span class="text-xs font-mono text-blades-muted">{{ TYPE_ICONS[child.type] }}</span>
              <span class="text-sm font-sans text-blades-text flex-1">{{ child.name }}</span>
              <span class="blades-badge-muted text-[10px]">{{ LOCATION_TYPE_LABELS[child.type] }}</span>
            </button>
          </div>
        </div>

        <div v-if="!loc.description && !loc.notes && !loc.tags?.length && !children.length"
             class="text-blades-muted font-mono text-xs text-center py-8 opacity-60">
          No details yet. Click Edit to add information.
        </div>
      </div>

      <!-- Edit mode -->
      <div v-else class="p-5 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2">
            <label class="blades-label">Name *</label>
            <input v-model="form.name" class="blades-input" />
          </div>
          <div>
            <label class="blades-label">Type</label>
            <select v-model="form.type" class="blades-select">
              <option v-for="t in LOCATION_TYPES" :key="t" :value="t">
                {{ TYPE_ICONS[t] }} {{ LOCATION_TYPE_LABELS[t] }}
              </option>
            </select>
          </div>
          <div>
            <label class="blades-label">Parent Location</label>
            <select v-model="form.parentId" class="blades-select">
              <option :value="null">— None (root) —</option>
              <option
                v-for="l in otherLocations"
                :key="l.id"
                :value="l.id"
              >{{ l.name }}</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="blades-label">Controlling Faction</label>
            <select v-model="form.controlledBy" class="blades-select">
              <option value="">— None —</option>
              <option v-for="f in factions" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
          </div>
        </div>
        <div>
          <label class="blades-label">Description</label>
          <textarea v-model="form.description" class="blades-textarea" rows="4" />
        </div>
        <div>
          <label class="blades-label">Notes</label>
          <textarea v-model="form.notes" class="blades-textarea" rows="2" />
        </div>
        <div>
          <label class="blades-label">Tags (comma-separated)</label>
          <input v-model="tagsInput" class="blades-input" placeholder="e.g. dangerous, contested, blighted" />
        </div>

        <!-- Public / Favorite toggles -->
        <div class="flex gap-3 pt-1">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" class="accent-blades-gold" v-model="form.isFavorite" />
            <span class="text-xs font-mono text-blades-muted">★ Favorite</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" class="accent-blades-sage" :checked="form.isPublic !== false"
              @change="(e) => form.isPublic = (e.target as HTMLInputElement).checked ? undefined : false" />
            <span class="text-xs font-mono text-blades-muted">🌐 Public</span>
          </label>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between gap-3" v-if="loc">
        <div class="flex gap-2">
          <template v-if="editing">
            <button class="blades-btn-gold text-xs" @click="commitEdit">Save</button>
            <button class="blades-btn-ghost text-xs" @click="editing = false">Cancel</button>
          </template>
          <template v-else-if="!isStatic">
            <button class="blades-btn-outline text-xs" @click="startEdit">Edit</button>
            <button
              v-if="loc.type !== 'site'"
              class="blades-btn-ghost text-xs"
              @click="$emit('add-child', loc.id)"
            >+ Add Child</button>
          </template>
        </div>
        <button v-if="!isStatic" class="blades-btn-danger text-xs" @click="deleteLocation">Delete</button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Drawer from './Drawer.vue'
import BannerImage from './BannerImage.vue'
import { useLocationsStore } from '@/stores/locations'
import { useFactionsStore } from '@/stores/factions'
import { LOCATION_TYPES, LOCATION_TYPE_LABELS } from '@/types/blades'
import type { Location, LocationType } from '@/types/blades'

const TYPE_ICONS: Record<string, string> = {
  region: '🌏', city: '🏙', district: '🏘', site: '🏛',
}

const props = defineProps<{ open: boolean; locationId: string | null }>()
const emit = defineEmits<{
  close: []
  deleted: []
  navigate: [id: string]
  'add-child': [parentId: string]
}>()

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const locStore = useLocationsStore()
const facStore = useFactionsStore()

const loc = computed(() => props.locationId ? locStore.get(props.locationId) ?? null : null)
const ancestors = computed(() => loc.value ? locStore.ancestors(loc.value.id) : [])
const children = computed(() =>
  loc.value
    ? locStore.children(loc.value.id).sort((a, b) => a.name.localeCompare(b.name))
    : []
)
const controllingFaction = computed(() =>
  loc.value?.controlledBy ? facStore.get(loc.value.controlledBy) ?? null : null
)
const factions = computed(() => [...facStore.factions].sort((a, b) => a.name.localeCompare(b.name)))
const otherLocations = computed(() =>
  loc.value
    ? locStore.locations
        .filter(l => l.id !== loc.value!.id)
        .sort((a, b) => a.name.localeCompare(b.name))
    : []
)

const editing = ref(false)
const form = ref<Partial<Location>>({})
const tagsInput = ref('')

function startEdit() {
  if (!loc.value) return
  form.value = { ...loc.value, parentId: loc.value.parentId ?? null }
  tagsInput.value = (loc.value.tags ?? []).join(', ')
  // Normalize: undefined means public, false means private
  if (form.value.isPublic !== false) form.value.isPublic = undefined
  editing.value = true
}

function commitEdit() {
  if (!loc.value || !form.value.name?.trim()) return
  const tags = tagsInput.value
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
  locStore.update(loc.value.id, { ...form.value, tags })
  editing.value = false
}

function deleteLocation() {
  if (!loc.value) return
  const childCount = locStore.descendants(loc.value.id).length
  const msg = childCount
    ? `Delete "${loc.value.name}" and its ${childCount} child location(s)?`
    : `Delete "${loc.value.name}"?`
  if (confirm(msg)) {
    locStore.remove(loc.value.id)
    emit('deleted')
    emit('close')
  }
}
</script>

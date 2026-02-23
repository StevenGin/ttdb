<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-blades-text glow-gold">Items</h1>
        <p class="text-blades-muted font-mono text-sm mt-1">{{ store.items.length }} notable item{{ store.items.length !== 1 ? 's' : '' }}</p>
      </div>
      <button v-if="!isStatic" class="blades-btn-gold" @click="openAdd">+ New Item</button>
    </div>

    <div class="flex flex-wrap gap-3 mb-6">
      <input v-model="search" class="blades-input max-w-xs" placeholder="Search items..." />
      <select v-model="filterLoad" class="blades-select max-w-[140px]">
        <option value="">Any Load</option>
        <option value="0">0 — Trivial</option>
        <option value="1">1 — Light</option>
        <option value="2">2 — Heavy</option>
        <option value="3">3 — Very heavy</option>
      </select>
      <button
        v-if="!isStatic"
        class="blades-btn-ghost text-xs py-1.5 px-3"
        :class="{ 'border-blades-gold text-blades-gold': showFavoritesOnly }"
        @click="showFavoritesOnly = !showFavoritesOnly"
        title="Show favorites only"
      >★ Favorites</button>
      <button
        v-if="search || filterLoad || showFavoritesOnly"
        class="blades-btn-ghost text-xs"
        @click="search = ''; filterLoad = ''; showFavoritesOnly = false"
      >Clear</button>
    </div>

    <div v-if="store.items.length === 0" class="text-center py-24">
      <div class="text-5xl mb-4 opacity-10">◈</div>
      <p class="text-blades-muted font-mono text-sm mb-4">No items catalogued.</p>
      <p class="text-blades-muted/60 font-mono text-xs mb-6">Track notable gear, artifacts, contraband, and loot here.</p>
      <button v-if="!isStatic" class="blades-btn-outline" @click="openAdd">Add First Item</button>
    </div>

    <div class="space-y-2">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="blades-card p-4 flex items-start gap-4 hover:border-blades-border-light transition-colors"
      >
        <!-- Load badge -->
        <div class="flex-shrink-0 text-center">
          <div class="stat-box w-12">
            <span class="stat-val text-base">{{ item.load }}</span>
            <span class="stat-label">load</span>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-3 flex-wrap mb-1">
            <div>
              <h3 class="font-serif font-semibold text-blades-text text-base">{{ item.name }}</h3>
              <div class="flex flex-wrap gap-1 mt-1">
                <span v-for="tag in item.tags" :key="tag" class="blades-badge-muted text-[10px]">{{ tag }}</span>
              </div>
            </div>
            <div class="flex gap-2 flex-shrink-0 text-xs flex-wrap">
              <span v-if="item.heldBy" class="blades-badge-gold">
                Held: {{ charName(item.heldBy) }}
              </span>
              <span v-if="item.locationId" class="blades-badge-spark">
                At: {{ locName(item.locationId) }}
              </span>
            </div>
          </div>
          <p v-if="item.description" class="text-blades-muted font-mono text-xs leading-relaxed">{{ item.description }}</p>
        </div>

        <!-- Actions -->
        <div v-if="!isStatic" class="flex gap-1 flex-shrink-0 items-center">
          <button
            class="text-base leading-none transition-colors py-0.5 px-1"
            :class="item.isFavorite ? 'text-blades-gold' : 'text-blades-muted/30 hover:text-blades-muted'"
            :title="item.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
            @click="store.update(item.id, { isFavorite: !item.isFavorite })"
          >★</button>
          <button
            class="font-mono text-[10px] border rounded px-1 py-0.5 transition-colors leading-none"
            :class="item.isPublic === false
              ? 'text-blades-muted/40 border-blades-border hover:border-blades-border-light'
              : 'text-blades-sage-light/60 border-blades-sage/30 hover:border-blades-sage'"
            :title="item.isPublic === false ? 'Private — click to make public' : 'Public — click to make private'"
            @click="store.update(item.id, { isPublic: item.isPublic === false ? undefined : false })"
          >{{ item.isPublic === false ? '🔒' : '🌐' }}</button>
          <button class="blades-btn-ghost text-xs py-0.5 px-2" @click="openEdit(item.id)">Edit</button>
          <button class="blades-btn-danger text-xs py-0.5 px-2" @click="del(item.id)">✕</button>
        </div>
      </div>
    </div>

    <div v-if="filtered.length === 0 && store.items.length > 0" class="text-center text-blades-muted py-8 font-mono text-sm">
      No items match your search.
    </div>

    <!-- Form modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="blades-card p-6 w-full max-w-lg">
        <h2 class="text-xl mb-4">{{ editId ? 'Edit Item' : 'New Item' }}</h2>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="blades-label">Name *</label>
              <input v-model="form.name" class="blades-input" placeholder="Item name" />
            </div>
            <div>
              <label class="blades-label">Load</label>
              <input v-model.number="form.load" type="number" min="0" max="5" class="blades-input" />
            </div>
            <div>
              <label class="blades-label">Tags (comma-separated)</label>
              <input v-model="tagsInput" class="blades-input" placeholder="e.g. weapon, arcane" />
            </div>
          </div>
          <div>
            <label class="blades-label">Description</label>
            <textarea v-model="form.description" class="blades-textarea" rows="3" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="blades-label">Held By (Character)</label>
              <select v-model="form.heldBy" class="blades-select">
                <option value="">— None —</option>
                <option v-for="ch in characters" :key="ch.id" :value="ch.id">{{ ch.name }}</option>
              </select>
            </div>
            <div>
              <label class="blades-label">Located At</label>
              <select v-model="form.locationId" class="blades-select">
                <option value="">— None —</option>
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex gap-4 mt-1">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" class="accent-blades-gold" v-model="formFavorite" />
            <span class="text-xs font-mono text-blades-muted">★ Favorite</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" class="accent-blades-sage" v-model="formPublic" />
            <span class="text-xs font-mono text-blades-muted">🌐 Public</span>
          </label>
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
import { useItemsStore } from '@/stores/items'
import { useCharactersStore } from '@/stores/characters'
import { useLocationsStore } from '@/stores/locations'
import type { Item } from '@/types/blades'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const store = useItemsStore()
const charStore = useCharactersStore()
const locStore = useLocationsStore()

const search = ref('')
const filterLoad = ref('')
const showFavoritesOnly = ref(false)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  const list = store.items.filter(i => {
    if (isStatic && i.isPublic === false) return false
    if (q && !i.name.toLowerCase().includes(q) && !i.description?.toLowerCase().includes(q)
           && !i.tags?.some(t => t.toLowerCase().includes(q))) return false
    if (filterLoad.value && i.load !== Number(filterLoad.value)) return false
    if (showFavoritesOnly.value && !i.isFavorite) return false
    return true
  })
  return list.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    return a.name.localeCompare(b.name)
  })
})

function charName(id: string) { return charStore.get(id)?.name ?? id }
function locName(id: string) { return locStore.get(id)?.name ?? id }

const characters = computed(() => charStore.characters)
const locations = computed(() => locStore.locations)

function del(id: string) {
  if (confirm('Delete this item?')) store.remove(id)
}

const showForm = ref(false)
const editId = ref<string | null>(null)
const tagsInput = ref('')
const form = ref<Partial<Item>>({})
const formFavorite = ref(false)
const formPublic = ref(true)

function openAdd() {
  editId.value = null
  tagsInput.value = ''
  form.value = { name: '', load: 1, description: '' }
  formFavorite.value = false
  formPublic.value = true
  showForm.value = true
}

function openEdit(id: string) {
  const item = store.get(id)
  if (!item) return
  editId.value = id
  tagsInput.value = (item.tags ?? []).join(', ')
  form.value = { ...item }
  formFavorite.value = !!item.isFavorite
  formPublic.value = item.isPublic !== false
  showForm.value = true
}

function submit() {
  if (!form.value.name?.trim()) return
  const tags = tagsInput.value ? tagsInput.value.split(',').map(t => t.trim()).filter(Boolean) : undefined
  const data = {
    ...form.value,
    tags,
    heldBy: form.value.heldBy || undefined,
    locationId: form.value.locationId || undefined,
    isFavorite: formFavorite.value || undefined,
    isPublic: formPublic.value ? undefined : false,
  }
  if (editId.value) {
    store.update(editId.value, data)
  } else {
    store.create(data)
  }
  showForm.value = false
}
</script>

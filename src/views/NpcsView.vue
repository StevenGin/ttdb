<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-blades-text glow-amber">NPCs</h1>
        <p class="text-blades-muted font-mono text-sm mt-1">
          {{ filteredNpcs.length }}<template v-if="filteredNpcs.length !== allNpcs.length"> of {{ allNpcs.length }}</template>
          character{{ allNpcs.length !== 1 ? 's' : '' }}
        </p>
      </div>
      <button v-if="!isStatic" class="blades-btn-gold" @click="createNpc">+ New NPC</button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <input
        v-model="search"
        class="blades-input max-w-xs"
        placeholder="Search by name, alias, role…"
      />
      <select v-model="factionFilter" class="blades-select max-w-[200px]">
        <option value="">All Factions</option>
        <option
          v-for="f in facStore.factions"
          :key="f.id"
          :value="f.id"
        >{{ f.name }}</option>
      </select>
      <button
        v-if="!isStatic"
        class="blades-btn-ghost text-xs py-1.5 px-3"
        :class="{ 'border-blades-gold text-blades-gold': showFavoritesOnly }"
        @click="showFavoritesOnly = !showFavoritesOnly"
        title="Show favorites only"
      >★ Favorites</button>
      <button
        v-if="search || factionFilter || showFavoritesOnly"
        class="blades-btn-ghost text-xs"
        @click="search = ''; factionFilter = ''; showFavoritesOnly = false"
      >Clear</button>
    </div>

    <div v-if="allNpcs.length === 0" class="text-center py-24">
      <div class="text-6xl mb-4 opacity-10 font-serif">◈</div>
      <p class="text-blades-muted font-mono text-sm mb-4">No NPCs yet.</p>
      <button v-if="!isStatic" class="blades-btn-outline" @click="createNpc">Add a World Character</button>
    </div>

    <div v-else-if="filteredNpcs.length === 0" class="text-center py-24">
      <div class="text-6xl mb-4 opacity-10 font-serif">◈</div>
      <p class="text-blades-muted font-mono text-sm">No NPCs match your search.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="ch in filteredNpcs"
        :key="ch.id"
        class="blades-card hover:border-blades-border-light transition-colors cursor-pointer group overflow-hidden"
        @click="openDrawer(ch.id)"
      >
        <!-- Square portrait thumbnail -->
        <div class="aspect-square overflow-hidden bg-blades-card/40">
          <img
            v-if="ch.bannerImage"
            :src="ch.bannerImage"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            :alt="ch.name"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="text-5xl opacity-[0.06] select-none font-serif">◈</span>
          </div>
        </div>

        <div class="p-4">
          <!-- Role / NPC badge + favorite + public -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1.5 min-w-0">
              <span v-if="ch.role" class="blades-badge-gold text-xs truncate">{{ ch.role }}</span>
              <span v-else class="blades-badge-muted text-xs">NPC</span>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0" @click.stop>
              <!-- Favorite toggle -->
              <button
                v-if="!isStatic"
                class="text-sm leading-none transition-colors"
                :class="ch.isFavorite ? 'text-blades-gold' : 'text-blades-muted/30 hover:text-blades-muted'"
                :title="ch.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
                @click.stop="store.update(ch.id, { isFavorite: !ch.isFavorite })"
              >★</button>
              <!-- Public badge -->
              <span
                v-if="!isStatic"
                class="text-[10px] font-mono leading-none"
                :class="ch.isPublic === false ? 'text-blades-muted/40' : 'text-blades-sage-light/60'"
                :title="ch.isPublic === false ? 'Private — not published' : 'Public — visible on GitHub Pages'"
              >{{ ch.isPublic === false ? '🔒' : '🌐' }}</span>
            </div>
          </div>

          <!-- Faction -->
          <div v-if="factionName(ch)" class="text-[10px] font-mono text-blades-muted mb-1">⚑ {{ factionName(ch) }}</div>

          <!-- Name -->
          <h3 class="text-xl font-serif font-semibold text-blades-text group-hover:text-blades-gold transition-colors mb-0.5">
            {{ ch.name }}
          </h3>
          <div v-if="ch.alias" class="text-blades-muted font-mono text-xs mb-2">"{{ ch.alias }}"</div>

          <!-- Description snippet -->
          <p v-if="ch.description || ch.looks" class="text-blades-muted font-mono text-xs line-clamp-2 mt-1">
            {{ ch.description || ch.looks }}
          </p>
        </div>
      </div>
    </div>

    <!-- NPC Drawer -->
    <NpcDrawer
      :open="drawerOpen"
      :npc-id="selectedId"
      @close="drawerOpen = false"
      @deleted="drawerOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCharactersStore } from '@/stores/characters'
import { useFactionsStore } from '@/stores/factions'
import NpcDrawer from '@/components/NpcDrawer.vue'
import type { Character } from '@/types/blades'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const store = useCharactersStore()
const facStore = useFactionsStore()

const search = ref('')
const factionFilter = ref('')
const showFavoritesOnly = ref(false)

const allNpcs = computed(() => {
  const npcs = store.characters.filter(c => c.isNpc === true)
  // In static mode, hide private NPCs
  if (isStatic) return npcs.filter(c => c.isPublic !== false)
  return npcs
})

const filteredNpcs = computed(() => {
  const q = search.value.toLowerCase().trim()
  const list = allNpcs.value.filter(c => {
    const matchesSearch = !q
      || c.name.toLowerCase().includes(q)
      || c.alias?.toLowerCase().includes(q)
      || c.role?.toLowerCase().includes(q)
      || c.description?.toLowerCase().includes(q)
    const matchesFaction = !factionFilter.value || c.factionId === factionFilter.value
    const matchesFav = !showFavoritesOnly.value || c.isFavorite
    return matchesSearch && matchesFaction && matchesFav
  })
  // Favorites first, then alphabetical
  return list.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    return a.name.localeCompare(b.name)
  })
})

const drawerOpen = ref(false)
const selectedId = ref<string | null>(null)

function openDrawer(id: string) {
  selectedId.value = id
  drawerOpen.value = true
}

function factionName(ch: Character) {
  if (!ch.factionId) return ''
  return facStore.get(ch.factionId)?.name ?? ''
}

function createNpc() {
  const ch = store.create({ isNpc: true })
  openDrawer(ch.id)
}
</script>

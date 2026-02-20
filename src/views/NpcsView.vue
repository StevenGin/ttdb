<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-blades-text glow-amber">NPCs</h1>
        <p class="text-blades-muted font-mono text-sm mt-1">{{ npcs.length }} character{{ npcs.length !== 1 ? 's' : '' }} in the world</p>
      </div>
      <button v-if="!isStatic" class="blades-btn-gold" @click="createNpc">+ New NPC</button>
    </div>

    <div v-if="npcs.length === 0" class="text-center py-24">
      <div class="text-6xl mb-4 opacity-10 font-serif">◈</div>
      <p class="text-blades-muted font-mono text-sm mb-4">No NPCs yet.</p>
      <button v-if="!isStatic" class="blades-btn-outline" @click="createNpc">Add a World Character</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="ch in npcs"
        :key="ch.id"
        class="blades-card hover:border-blades-border-light transition-colors cursor-pointer group overflow-hidden"
        @click="openDrawer(ch.id)"
      >
        <!-- Banner thumbnail -->
        <div v-if="ch.bannerImage" class="h-28 overflow-hidden">
          <img :src="ch.bannerImage" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" :alt="ch.name" />
        </div>

        <div class="p-4">
          <!-- Role / NPC badge -->
          <div class="flex items-center justify-between mb-2">
            <span v-if="ch.role" class="blades-badge-gold text-xs">{{ ch.role }}</span>
            <span v-else class="blades-badge-muted text-xs">NPC</span>
            <span v-if="factionName(ch)" class="text-[10px] font-mono text-blades-muted">⚑ {{ factionName(ch) }}</span>
          </div>

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

const npcs = computed(() => store.characters.filter(c => c.isNpc === true))

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

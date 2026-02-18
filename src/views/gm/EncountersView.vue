<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-lancer-text glow-accent">ENCOUNTERS</h1>
        <p class="text-lancer-muted font-mono text-sm mt-1">{{ gmStore.encounters.length }} encounters</p>
      </div>
      <button v-if="!isStatic" class="lancer-btn-primary" @click="createEncounter">+ New Encounter</button>
    </div>

    <div v-if="gmStore.encounters.length === 0" class="text-center py-24">
      <div class="text-6xl mb-4 opacity-20">◈</div>
      <div class="text-lancer-muted font-mono text-sm mb-4">No encounters created.</div>
      <button v-if="!isStatic" class="lancer-btn-outline" @click="createEncounter">Create First Encounter</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="enc in gmStore.encounters"
        :key="enc.id"
        class="lancer-card p-4 hover:border-lancer-border-light transition-colors"
      >
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-display font-bold text-lancer-text text-lg">{{ enc.name }}</h3>
          <div class="flex gap-1">
            <RouterLink :to="`/gm/encounters/${enc.id}`" class="lancer-btn-ghost text-xs py-0.5 px-2">View</RouterLink>
            <button v-if="!isStatic" class="lancer-btn-danger text-xs py-0.5 px-2" @click="deleteEncounter(enc.id)">✕</button>
          </div>
        </div>
        <div v-if="enc.description" class="text-lancer-muted font-mono text-xs mb-3 line-clamp-2">{{ enc.description }}</div>
        <div class="flex items-center justify-between text-xs font-mono text-lancer-muted">
          <span>{{ enc.npcs.length }} NPC{{ enc.npcs.length !== 1 ? 's' : '' }}</span>
          <span v-if="enc.location">📍 {{ enc.location }}</span>
        </div>
        <div v-if="enc.labels?.length" class="flex flex-wrap gap-1 mt-2">
          <span v-for="l in enc.labels" :key="l" class="lancer-badge-muted text-[10px]">{{ l }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useGmStore } from '@/stores/gm'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const gmStore = useGmStore()
const router = useRouter()

function createEncounter() {
  const enc = gmStore.createEncounter()
  router.push(`/gm/encounters/${enc.id}`)
}

function deleteEncounter(id: string) {
  if (confirm('Delete this encounter?')) gmStore.deleteEncounter(id)
}
</script>

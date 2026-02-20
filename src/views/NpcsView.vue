<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-blades-text glow-amber">NPCs</h1>
        <p class="text-blades-muted font-mono text-sm mt-1">{{ npcs.length }} character{{ npcs.length !== 1 ? 's' : '' }} in the world</p>
      </div>
      <button v-if="!isStatic" class="blades-btn-gold" @click="create">+ New NPC</button>
    </div>

    <div v-if="npcs.length === 0" class="text-center py-24">
      <div class="text-6xl mb-4 opacity-10 font-serif">◈</div>
      <p class="text-blades-muted font-mono text-sm mb-4">No NPCs yet.</p>
      <button v-if="!isStatic" class="blades-btn-outline" @click="create">Add a World Character</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <RouterLink
        v-for="ch in npcs"
        :key="ch.id"
        :to="`/characters/${ch.id}`"
        class="blades-card p-4 hover:border-blades-border-light transition-colors cursor-pointer group"
      >
        <!-- Banner thumbnail -->
        <div v-if="ch.bannerImage" class="h-24 mb-3 overflow-hidden rounded-sm -mx-4 -mt-4">
          <img :src="ch.bannerImage" class="w-full h-full object-cover" :alt="ch.name" />
        </div>

        <!-- Playbook / Role -->
        <div class="flex items-center justify-between mb-2">
          <span class="blades-badge-muted text-xs">
            {{ playbookName(ch.playbookId) }}
          </span>
          <span class="blades-badge text-[10px] border-amber-800 text-amber-400 bg-amber-900/10">NPC</span>
        </div>

        <!-- Name -->
        <h3 class="text-xl font-serif font-semibold text-blades-text group-hover:text-blades-gold transition-colors mb-0.5">
          {{ ch.name }}
        </h3>
        <div v-if="ch.alias" class="text-blades-muted font-mono text-xs mb-2">"{{ ch.alias }}"</div>
        <div v-if="!ch.alias" class="mb-2" />

        <!-- Heritage / Background -->
        <div class="flex flex-wrap gap-1 mb-3 text-xs font-mono text-blades-muted">
          <span v-if="ch.heritage">{{ ch.heritage }}</span>
          <span v-if="ch.heritage && ch.background">·</span>
          <span v-if="ch.background">{{ ch.background }}</span>
        </div>

        <!-- Description snippet -->
        <p v-if="ch.description || ch.notes" class="text-blades-muted font-mono text-xs line-clamp-2 mb-2">
          {{ ch.description || ch.notes }}
        </p>

        <!-- Trauma tags -->
        <div v-if="ch.trauma.length" class="flex flex-wrap gap-1 mt-2">
          <span v-for="t in ch.trauma" :key="t" class="blades-badge-red text-[10px]">{{ t }}</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useCharactersStore } from '@/stores/characters'
import { PLAYBOOKS } from '@/data/playbooks'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const store = useCharactersStore()
const router = useRouter()

const npcs = computed(() => store.characters.filter(c => c.isNpc === true))

function playbookName(id: string) {
  return PLAYBOOKS.find(p => p.id === id)?.name ?? (id || 'No Playbook')
}

function create() {
  const ch = store.create({ isNpc: true })
  router.push(`/characters/${ch.id}`)
}
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-blades-text glow-gold">Characters</h1>
        <p class="text-blades-muted font-mono text-sm mt-1">{{ store.characters.length }} scoundrel{{ store.characters.length !== 1 ? 's' : '' }}</p>
      </div>
      <button v-if="!isStatic" class="blades-btn-gold" @click="create">+ New Character</button>
    </div>

    <div v-if="store.characters.length === 0" class="text-center py-24">
      <div class="text-6xl mb-4 opacity-10 font-serif">†</div>
      <p class="text-blades-muted font-mono text-sm mb-4">No characters yet.</p>
      <button v-if="!isStatic" class="blades-btn-outline" @click="create">Create a Scoundrel</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <RouterLink
        v-for="ch in store.characters"
        :key="ch.id"
        :to="`/characters/${ch.id}`"
        class="blades-card p-4 hover:border-blades-border-light transition-colors cursor-pointer group"
      >
        <!-- Playbook -->
        <div class="flex items-center justify-between mb-2">
          <span class="blades-badge-gold text-xs">{{ playbookName(ch.playbookId) }}</span>
          <div class="flex gap-1 items-center">
            <span class="text-blades-muted font-mono text-xs">Stress</span>
            <div class="flex gap-0.5 ml-1">
              <div
                v-for="i in ch.maxStress"
                :key="i"
                class="w-2.5 h-2.5 rounded-sm border border-blades-border-light"
                :class="i <= ch.stress ? 'bg-blades-red border-blades-red' : ''"
              />
            </div>
          </div>
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

        <!-- Action dots preview — top 4 rated actions -->
        <div class="grid grid-cols-4 gap-1">
          <div v-for="action in topActions(ch)" :key="action.name" class="text-center">
            <div class="flex justify-center gap-0.5 mb-0.5">
              <div
                v-for="dot in 4"
                :key="dot"
                class="w-2 h-2 rounded-full border border-blades-border"
                :class="dot <= action.val ? 'bg-blades-gold border-blades-gold' : ''"
              />
            </div>
            <div class="text-[9px] font-mono text-blades-muted uppercase">{{ action.name }}</div>
          </div>
        </div>

        <!-- Trauma tags -->
        <div v-if="ch.trauma.length" class="flex flex-wrap gap-1 mt-3">
          <span v-for="t in ch.trauma" :key="t" class="blades-badge-red text-[10px]">{{ t }}</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useCharactersStore } from '@/stores/characters'
import { PLAYBOOKS } from '@/data/playbooks'
import type { Character, ActionName } from '@/types/blades'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const store = useCharactersStore()
const router = useRouter()

function playbookName(id: string) {
  return PLAYBOOKS.find(p => p.id === id)?.name ?? (id || 'No Playbook')
}

function create() {
  const ch = store.create()
  router.push(`/characters/${ch.id}`)
}

function topActions(ch: Character) {
  const entries = Object.entries(ch.actions) as [ActionName, number][]
  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, val]) => ({ name, val }))
}
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-lancer-text glow-accent">PILOT ROSTER</h1>
        <p class="text-lancer-muted font-mono text-sm mt-1">{{ pilotsStore.pilots.length }} pilots registered</p>
      </div>
      <button v-if="!isStatic" class="lancer-btn-primary" @click="createPilot">+ New Pilot</button>
    </div>

    <!-- Empty state -->
    <div v-if="pilotsStore.pilots.length === 0" class="text-center py-24">
      <div class="text-6xl mb-4 opacity-20">◉</div>
      <div class="text-lancer-muted font-mono text-sm mb-4">No pilots registered.</div>
      <button v-if="!isStatic" class="lancer-btn-outline" @click="createPilot">Create Your First Pilot</button>
    </div>

    <!-- Pilot cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="pilot in pilotsStore.pilots"
        :key="pilot.id"
        class="lancer-card p-4 hover:border-lancer-border-light transition-colors"
      >
        <div class="flex items-start justify-between mb-2">
          <div>
            <div class="text-xl font-display font-bold text-lancer-accent">{{ pilot.callsign }}</div>
            <div class="text-sm text-lancer-muted font-mono">{{ pilot.name || 'No name set' }}</div>
          </div>
          <div class="lancer-badge-muted">LL{{ pilot.level }}</div>
        </div>

        <div class="flex gap-2 text-xs font-mono text-lancer-muted mb-3">
          <span>{{ pilot.mechs.length }} mech{{ pilot.mechs.length !== 1 ? 's' : '' }}</span>
          <span>·</span>
          <span>{{ pilot.talents.length }} talent{{ pilot.talents.length !== 1 ? 's' : '' }}</span>
        </div>

        <!-- Active mech -->
        <div v-if="activeMech(pilot)" class="border border-lancer-border/50 p-2 mb-3 text-xs">
          <div class="text-[10px] text-lancer-muted font-mono uppercase tracking-widest mb-1">Active Mech</div>
          <div class="text-lancer-text font-mono">{{ activeMech(pilot)?.name }}</div>
          <div class="text-lancer-muted font-mono">{{ getFrameName(activeMech(pilot)?.frameId) }}</div>
        </div>

        <div class="flex gap-2">
          <RouterLink :to="`/pilots/${pilot.id}`" class="lancer-btn-outline flex-1 text-center text-xs py-1">
            View
          </RouterLink>
          <button v-if="!isStatic" class="lancer-btn-danger text-xs py-1 px-3" @click="deletePilot(pilot.id)">
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { usePilotsStore } from '@/stores/pilots'
import { useCompendiumStore } from '@/stores/compendium'
import type { ActivePilot } from '@/types/lancer'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const pilotsStore = usePilotsStore()
const compendiumStore = useCompendiumStore()
const router = useRouter()

function createPilot() {
  const pilot = pilotsStore.createPilot({ callsign: 'UNNAMED', level: 0 })
  router.push(`/pilots/${pilot.id}`)
}

function deletePilot(id: string) {
  if (confirm('Delete this pilot permanently?')) pilotsStore.deletePilot(id)
}

function activeMech(pilot: ActivePilot) {
  return pilot.mechs.find(m => m.id === pilot.activeMechId) ?? pilot.mechs[0]
}

function getFrameName(id?: string) {
  if (!id) return 'No frame selected'
  return compendiumStore.getFrame(id)?.name ?? id
}
</script>

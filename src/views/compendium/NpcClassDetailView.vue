<template>
  <div class="p-6 max-w-4xl">
    <RouterLink to="/compendium/npc-classes" class="text-lancer-muted hover:text-lancer-accent font-mono text-sm mb-6 inline-block">
      ← Back to NPC Classes
    </RouterLink>

    <div v-if="!cls" class="text-lancer-muted font-mono py-16 text-center">NPC class not found.</div>

    <template v-else>
      <div class="lancer-card p-6 mb-6">
        <div class="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <span :class="roleClass(cls.role)" class="text-xs font-mono font-bold uppercase tracking-widest block mb-1">
              {{ cls.role }}
            </span>
            <h1 class="text-4xl text-lancer-text glow-accent">{{ cls.name }}</h1>
          </div>
          <div class="lancer-badge-muted">Power {{ cls.power }}</div>
        </div>
        <p v-if="cls.info.flavor" class="text-lancer-muted font-mono text-sm leading-relaxed mb-3">{{ cls.info.flavor }}</p>
        <div v-if="cls.info.tactics" class="border-l-2 border-lancer-gm-purple pl-3">
          <div class="text-[10px] text-lancer-gm-purple-light font-mono uppercase tracking-widest mb-1">Tactics</div>
          <p class="text-lancer-text/80 font-mono text-sm">{{ cls.info.tactics }}</p>
        </div>
      </div>

      <!-- Stats by tier -->
      <div class="lancer-card p-4 mb-6">
        <h2 class="text-lg mb-4">Statistics by Tier</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm font-mono">
            <thead>
              <tr class="text-lancer-muted text-xs uppercase tracking-widest">
                <th class="text-left py-1 pr-4">Stat</th>
                <th class="text-center py-1 px-3 text-lancer-red-light">Tier 1</th>
                <th class="text-center py-1 px-3 text-lancer-yellow">Tier 2</th>
                <th class="text-center py-1 px-3 text-lancer-accent">Tier 3</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(key, label) in statLabels" :key="key" class="border-t border-lancer-border/50">
                <td class="py-1.5 pr-4 text-lancer-muted">{{ label }}</td>
                <td class="py-1.5 px-3 text-center text-lancer-text">{{ cls.stats[key]?.[0] ?? '—' }}</td>
                <td class="py-1.5 px-3 text-center text-lancer-text">{{ cls.stats[key]?.[1] ?? '—' }}</td>
                <td class="py-1.5 px-3 text-center text-lancer-text">{{ cls.stats[key]?.[2] ?? '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Features -->
      <div class="lancer-card p-4">
        <h2 class="text-lg mb-4">Base Features</h2>
        <div class="flex flex-wrap gap-2">
          <span v-for="f in cls.base_features" :key="f" class="lancer-badge-muted font-mono text-xs">{{ f }}</span>
        </div>
        <div v-if="cls.optional_features.length" class="mt-4">
          <h3 class="text-sm text-lancer-muted uppercase font-mono tracking-widest mb-2">Optional Features</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="f in cls.optional_features" :key="f" class="lancer-badge-purple font-mono text-xs">{{ f }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useCompendiumStore } from '@/stores/compendium'
import type { NpcStatKey } from '@/types/lancer'

const route = useRoute()
const store = useCompendiumStore()

const cls = computed(() => store.getNpcClass(route.params.id as string))

const statLabels: Record<string, NpcStatKey> = {
  'Activations': 'activations',
  'HP': 'hp',
  'Armor': 'armor',
  'Evasion': 'evade',
  'E-Defense': 'edef',
  'Heat Cap': 'heatcap',
  'Speed': 'speed',
  'Sensor Range': 'sensor',
  'Save Target': 'save',
  'Hull': 'hull',
  'Agility': 'agility',
  'Systems': 'systems',
  'Engineering': 'engineering',
  'Size': 'size',
}

function roleClass(role: string) {
  const map: Record<string, string> = {
    striker: 'text-lancer-red-light',
    controller: 'text-lancer-gm-purple-light',
    support: 'text-green-400',
    defender: 'text-blue-400',
    artillery: 'text-lancer-yellow',
    biological: 'text-emerald-400',
  }
  return map[role] ?? 'text-lancer-muted'
}
</script>

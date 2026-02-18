<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-3xl text-lancer-text glow-accent">NPC CLASSES</h1>
      <p class="text-lancer-muted font-mono text-sm mt-1">{{ allClasses.length }} NPC classes in database</p>
    </div>

    <div class="flex gap-3 mb-6">
      <input v-model="search" class="lancer-input max-w-xs" placeholder="Search NPC classes..." />
      <select v-model="filterRole" class="lancer-select max-w-[160px]">
        <option value="">All Roles</option>
        <option value="striker">Striker</option>
        <option value="controller">Controller</option>
        <option value="support">Support</option>
        <option value="defender">Defender</option>
        <option value="artillery">Artillery</option>
        <option value="biological">Biological</option>
      </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <RouterLink
        v-for="cls in filtered"
        :key="cls.id"
        :to="`/compendium/npc-classes/${cls.id}`"
        class="lancer-card p-4 hover:border-lancer-border-light cursor-pointer group transition-colors"
      >
        <div class="flex items-center justify-between mb-2">
          <span :class="roleClass(cls.role)" class="text-xs font-mono font-bold uppercase tracking-widest">
            {{ cls.role }}
          </span>
          <span class="text-xs font-mono text-lancer-muted">Power {{ cls.power }}</span>
        </div>
        <h3 class="text-lg font-display font-bold text-lancer-text group-hover:text-lancer-accent transition-colors mb-2">
          {{ cls.name }}
        </h3>
        <p v-if="cls.info.flavor" class="text-lancer-muted font-mono text-xs line-clamp-3">{{ cls.info.flavor }}</p>

        <!-- Tier stats preview -->
        <div class="grid grid-cols-3 gap-1 mt-3">
          <div v-for="tier in [0,1,2]" :key="tier" class="text-center">
            <div class="text-[10px] text-lancer-muted font-mono mb-1">TIER {{ tier + 1 }}</div>
            <div class="text-xs font-mono">
              <span class="text-lancer-red-light">{{ cls.stats.hp[tier] }}</span>
              <span class="text-lancer-muted"> HP</span>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCompendiumStore } from '@/stores/compendium'

const store = useCompendiumStore()
const search = ref('')
const filterRole = ref('')

const allClasses = computed(() => store.allNpcClasses)
const filtered = computed(() => allClasses.value.filter(c => {
  const matchSearch = !search.value || c.name.toLowerCase().includes(search.value.toLowerCase())
  const matchRole = !filterRole.value || c.role === filterRole.value
  return matchSearch && matchRole
}))

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

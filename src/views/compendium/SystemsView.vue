<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-3xl text-lancer-text glow-accent">SYSTEMS</h1>
      <p class="text-lancer-muted font-mono text-sm mt-1">{{ allSystems.length }} systems in database</p>
    </div>

    <div class="flex flex-wrap gap-3 mb-6">
      <input v-model="search" class="lancer-input max-w-xs" placeholder="Search systems..." />
      <select v-model="filterSource" class="lancer-select max-w-[160px]">
        <option value="">All Manufacturers</option>
        <option v-for="m in store.allManufacturers" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>
      <select v-model="filterType" class="lancer-select max-w-[160px]">
        <option value="">All Types</option>
        <option value="system">System</option>
        <option value="tech">Tech</option>
        <option value="ai">AI</option>
        <option value="shield">Shield</option>
        <option value="deployable">Deployable</option>
        <option value="drone">Drone</option>
      </select>
    </div>

    <div v-if="filtered.length === 0" class="text-center py-24">
      <div class="text-lancer-muted font-mono text-sm mb-2">No systems in database.</div>
      <div class="text-lancer-muted/50 font-mono text-xs">Add system content via Homebrew to populate this section.</div>
    </div>

    <div v-else class="space-y-2">
      <div v-for="s in filtered" :key="s.id" class="lancer-card p-3 flex items-start gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-mono font-bold" :style="{ color: store.getManufacturer(s.source)?.color ?? '#6a6a8a' }">
              {{ s.source }}
            </span>
            <span class="lancer-badge-accent text-[10px]">{{ s.type.toUpperCase() }}</span>
          </div>
          <div class="font-display font-semibold text-lancer-text">{{ s.name }}</div>
          <div class="text-lancer-muted font-mono text-xs mt-1 line-clamp-2">{{ s.description }}</div>
          <div v-if="s.effect" class="text-lancer-text/70 font-mono text-xs mt-1 line-clamp-2 italic">{{ s.effect }}</div>
        </div>
        <div class="text-center flex-shrink-0">
          <div class="text-lancer-accent font-mono font-bold text-lg">{{ s.sp }}</div>
          <div class="text-[10px] text-lancer-muted font-mono">SP</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCompendiumStore } from '@/stores/compendium'

const store = useCompendiumStore()
const search = ref('')
const filterSource = ref('')
const filterType = ref('')

const allSystems = computed(() => store.allMechSystems)

const filtered = computed(() => allSystems.value.filter(s => {
  const matchSearch = !search.value || s.name.toLowerCase().includes(search.value.toLowerCase())
  const matchSource = !filterSource.value || s.source === filterSource.value
  const matchType = !filterType.value || s.type === filterType.value
  return matchSearch && matchSource && matchType
}))
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-3xl text-lancer-text glow-accent">WEAPONS</h1>
      <p class="text-lancer-muted font-mono text-sm mt-1">{{ allWeapons.length }} weapons in database</p>
    </div>

    <div class="flex flex-wrap gap-3 mb-6">
      <input v-model="search" class="lancer-input max-w-xs" placeholder="Search weapons..." />
      <select v-model="filterSource" class="lancer-select max-w-[160px]">
        <option value="">All Manufacturers</option>
        <option v-for="m in store.allManufacturers" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>
      <select v-model="filterMount" class="lancer-select max-w-[160px]">
        <option value="">All Mount Sizes</option>
        <option value="aux">Auxiliary</option>
        <option value="main">Main</option>
        <option value="heavy">Heavy</option>
        <option value="superheavy">Superheavy</option>
      </select>
    </div>

    <div v-if="filtered.length === 0" class="text-center py-24">
      <div class="text-lancer-muted font-mono text-sm mb-2">No weapons in database.</div>
      <div class="text-lancer-muted/50 font-mono text-xs">Add weapon content via Homebrew to populate this section.</div>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="w in filtered"
        :key="w.id"
        class="lancer-card p-3 flex flex-wrap items-start gap-4"
      >
        <div class="flex-1 min-w-[200px]">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-mono font-bold" :style="{ color: store.getManufacturer(w.source)?.color ?? '#6a6a8a' }">
              {{ w.source }}
            </span>
            <span class="lancer-badge-muted text-[10px]">{{ w.mount.toUpperCase() }}</span>
            <span class="lancer-badge-muted text-[10px]">{{ w.type }}</span>
          </div>
          <div class="font-display font-semibold text-lancer-text">{{ w.name }}</div>
          <div class="text-lancer-muted font-mono text-xs mt-1 line-clamp-2">{{ w.description }}</div>
        </div>
        <div class="flex gap-2 flex-wrap">
          <div v-if="w.damage" class="text-center">
            <div class="text-lancer-red-light font-mono font-bold text-sm">
              {{ w.damage.map(d => `${d.val} ${d.type}`).join(' / ') }}
            </div>
            <div class="text-[10px] text-lancer-muted font-mono">DAMAGE</div>
          </div>
          <div v-if="w.range" class="text-center">
            <div class="text-lancer-accent font-mono font-bold text-sm">
              {{ w.range.map(r => `${r.type} ${r.val}`).join(' / ') }}
            </div>
            <div class="text-[10px] text-lancer-muted font-mono">RANGE</div>
          </div>
          <div v-if="w.sp" class="text-center">
            <div class="text-lancer-yellow font-mono font-bold text-sm">{{ w.sp }}</div>
            <div class="text-[10px] text-lancer-muted font-mono">SP</div>
          </div>
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
const filterMount = ref('')

const allWeapons = computed(() => store.allMechWeapons)

const filtered = computed(() => allWeapons.value.filter(w => {
  const matchSearch = !search.value || w.name.toLowerCase().includes(search.value.toLowerCase())
  const matchSource = !filterSource.value || w.source === filterSource.value
  const matchMount = !filterMount.value || w.mount === filterMount.value
  return matchSearch && matchSource && matchMount
}))
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl text-lancer-text glow-accent">FRAMES</h1>
      <p class="text-lancer-muted font-mono text-sm mt-1">{{ allFrames.length }} frames in database</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <input
        v-model="search"
        class="lancer-input max-w-xs"
        placeholder="Search frames..."
      />
      <select v-model="filterSource" class="lancer-select max-w-[160px]">
        <option value="">All Manufacturers</option>
        <option v-for="m in manufacturers" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <RouterLink
        v-for="frame in filtered"
        :key="frame.id"
        :to="`/compendium/frames/${frame.id}`"
        class="lancer-card p-4 hover:border-lancer-border-light transition-colors cursor-pointer group"
      >
        <!-- Source bar -->
        <div class="flex items-center justify-between mb-3">
          <span
            class="text-xs font-mono font-bold uppercase tracking-widest"
            :style="{ color: getManufacturerColor(frame.source) }"
          >{{ frame.source }}</span>
          <span class="lancer-badge-muted">SIZE {{ frame.stats.size }}</span>
        </div>

        <!-- Name -->
        <h3 class="text-lg font-display font-bold text-lancer-text group-hover:text-lancer-accent transition-colors mb-1">
          {{ frame.name }}
        </h3>

        <!-- Mechtype -->
        <div class="flex flex-wrap gap-1 mb-3">
          <span v-for="t in frame.mechtype" :key="t" class="lancer-badge-accent text-[10px]">{{ t }}</span>
        </div>

        <!-- Key stats -->
        <div class="grid grid-cols-4 gap-1">
          <div class="stat-box">
            <span class="stat-val">{{ frame.stats.hp }}</span>
            <span class="stat-label">HP</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">{{ frame.stats.armor }}</span>
            <span class="stat-label">ARM</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">{{ frame.stats.evasion }}</span>
            <span class="stat-label">EVA</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">{{ frame.stats.speed }}</span>
            <span class="stat-label">SPD</span>
          </div>
        </div>

        <!-- Mounts preview -->
        <div class="mt-3 flex flex-wrap gap-1">
          <span
            v-for="(m, i) in frame.mounts"
            :key="i"
            class="text-[10px] font-mono text-lancer-muted border border-lancer-border px-1"
          >{{ m.toUpperCase() }}</span>
        </div>
      </RouterLink>
    </div>

    <div v-if="filtered.length === 0" class="text-center text-lancer-muted py-16 font-mono">
      No frames match your search.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCompendiumStore } from '@/stores/compendium'

const store = useCompendiumStore()
const search = ref('')
const filterSource = ref('')

const allFrames = computed(() => store.allFrames)
const manufacturers = computed(() => store.allManufacturers)

function getManufacturerColor(source: string) {
  return store.getManufacturer(source)?.color ?? '#6a6a8a'
}

const filtered = computed(() => {
  return allFrames.value.filter(f => {
    const matchSearch =
      !search.value ||
      f.name.toLowerCase().includes(search.value.toLowerCase()) ||
      f.source.toLowerCase().includes(search.value.toLowerCase())
    const matchSource = !filterSource.value || f.source === filterSource.value
    return matchSearch && matchSource
  })
})
</script>

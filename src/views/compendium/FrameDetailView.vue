<template>
  <div class="p-6 max-w-4xl">
    <RouterLink to="/compendium/frames" class="text-lancer-muted hover:text-lancer-accent font-mono text-sm mb-6 inline-block">
      ← Back to Frames
    </RouterLink>

    <div v-if="!frame" class="text-lancer-muted font-mono py-16 text-center">Frame not found.</div>

    <template v-else>
      <!-- Header -->
      <div class="lancer-card p-6 mb-6">
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div
              class="text-sm font-mono font-bold uppercase tracking-widest mb-1"
              :style="{ color: manufacturer?.color ?? '#6a6a8a' }"
            >{{ frame.source }}</div>
            <h1 class="text-4xl text-lancer-text glow-accent mb-2">{{ frame.name }}</h1>
            <div class="flex flex-wrap gap-2">
              <span v-for="t in frame.mechtype" :key="t" class="lancer-badge-accent">{{ t }}</span>
              <span class="lancer-badge-muted">SIZE {{ frame.stats.size }}</span>
              <span v-if="frame.license_level === 0" class="lancer-badge-muted">GMS (No License)</span>
              <span v-else class="lancer-badge-muted">License Rank {{ frame.license_level }}</span>
            </div>
          </div>
        </div>

        <p class="text-lancer-text/80 font-mono text-sm mt-4 leading-relaxed">{{ frame.description }}</p>
      </div>

      <!-- Stats -->
      <div class="lancer-card p-4 mb-6">
        <h2 class="text-lg mb-4">Statistics</h2>
        <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
          <StatBox label="HP" :value="frame.stats.hp" />
          <StatBox label="Armor" :value="frame.stats.armor" />
          <StatBox label="Evasion" :value="frame.stats.evasion" />
          <StatBox label="E-Def" :value="frame.stats.edef" />
          <StatBox label="Speed" :value="frame.stats.speed" />
          <StatBox label="Heat Cap" :value="frame.stats.heatcap" />
          <StatBox label="Rep Cap" :value="frame.stats.repcap" />
          <StatBox label="Sensors" :value="frame.stats.sensor_range" />
          <StatBox label="Tech Atk" :value="frame.stats.tech_attack" accent />
          <StatBox label="Save" :value="frame.stats.save" />
          <StatBox label="SP" :value="frame.stats.sp" accent />
          <StatBox label="Structure" :value="frame.stats.structure" />
          <StatBox label="Stress" :value="frame.stats.stress" />
        </div>
      </div>

      <!-- Mounts -->
      <div class="lancer-card p-4 mb-6">
        <h2 class="text-lg mb-3">Mounts</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(m, i) in frame.mounts"
            :key="i"
            class="lancer-badge-accent text-sm"
          >{{ m.toUpperCase() }}</span>
        </div>
      </div>

      <!-- Traits -->
      <div class="lancer-card p-4 mb-6">
        <h2 class="text-lg mb-4">Traits</h2>
        <div class="space-y-4">
          <div v-for="trait in frame.traits" :key="trait.name" class="border-l-2 border-lancer-accent pl-3">
            <h3 class="text-lancer-accent font-display font-semibold text-sm uppercase tracking-wide mb-1">{{ trait.name }}</h3>
            <p class="text-lancer-text/80 font-mono text-sm leading-relaxed">{{ trait.description }}</p>
          </div>
        </div>
      </div>

      <!-- Core System -->
      <div class="lancer-card p-4 border-lancer-accent/30">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-lancer-accent text-lg">◆</span>
          <h2 class="text-lg text-lancer-accent">Core System: {{ frame.core_system.name }}</h2>
        </div>

        <div v-if="frame.core_system.description" class="text-lancer-muted font-mono text-sm mb-4">
          {{ frame.core_system.description }}
        </div>

        <div class="bg-lancer-accent/5 border border-lancer-accent/30 rounded-sm p-3">
          <div class="flex items-center gap-2 mb-2">
            <span class="lancer-badge-accent text-xs">{{ frame.core_system.activation.toUpperCase() }}</span>
            <span class="font-display font-bold text-lancer-accent uppercase tracking-wide text-sm">
              {{ frame.core_system.active_name }}
            </span>
          </div>
          <p class="text-lancer-text/80 font-mono text-sm leading-relaxed">{{ frame.core_system.active_effect }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useCompendiumStore } from '@/stores/compendium'
import StatBox from '@/components/StatBox.vue'

const route = useRoute()
const store = useCompendiumStore()

const frame = computed(() => store.getFrame(route.params.id as string))
const manufacturer = computed(() => frame.value ? store.getManufacturer(frame.value.source) : null)
</script>

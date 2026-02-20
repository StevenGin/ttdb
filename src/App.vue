<template>
  <div class="min-h-screen flex bg-blades-bg bg-fog">
    <!-- Sidebar -->
    <aside class="w-56 flex-shrink-0 flex flex-col blades-panel border-r border-blades-border">
      <!-- Logo -->
      <div class="p-4 border-b border-blades-border">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blades-gold/10 border border-blades-gold-dim flex items-center justify-center rounded-sm">
            <span class="text-blades-gold font-serif text-sm">✦</span>
          </div>
          <div>
            <div class="text-blades-gold font-serif font-bold text-sm uppercase tracking-widest glow-amber">Aurelion</div>
            <div class="text-blades-muted font-mono text-[10px]">Blades in the Dark</div>
          </div>
        </div>
        <div v-if="isStatic" class="mt-2 text-[10px] font-mono text-blades-muted border border-blades-border px-2 py-1 text-center rounded-sm">
          ◆ READ-ONLY
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-2 pt-3 space-y-0.5 overflow-y-auto">
        <!-- The Crew -->
        <NavSection label="The Crew" />
        <RouterLink to="/crew" class="nav-link" :class="{ active: route.path === '/crew' }">
          <span class="nav-icon">⚓</span> The Crew
        </RouterLink>
        <RouterLink to="/characters" class="nav-link" :class="{ active: route.path.startsWith('/characters') }">
          <span class="nav-icon">◉</span> Player Characters
        </RouterLink>

        <!-- The World -->
        <NavSection label="The World" class="mt-3" />
        <RouterLink to="/npcs" class="nav-link" :class="{ active: route.path === '/npcs' }">
          <span class="nav-icon">◈</span> NPCs
        </RouterLink>
        <RouterLink to="/factions" class="nav-link" :class="{ active: route.path === '/factions' }">
          <span class="nav-icon">⚑</span> Factions
        </RouterLink>
        <RouterLink to="/locations" class="nav-link" :class="{ active: route.path === '/locations' }">
          <span class="nav-icon">◬</span> Locations
        </RouterLink>
        <RouterLink to="/items" class="nav-link" :class="{ active: route.path === '/items' }">
          <span class="nav-icon">◇</span> Items
        </RouterLink>

        <!-- System -->
        <template v-if="!isStatic">
          <NavSection label="System" class="mt-3" />
          <RouterLink to="/settings" class="nav-link" :class="{ active: route.path === '/settings' }">
            <span class="nav-icon">⚙</span> Settings
          </RouterLink>
        </template>
      </nav>

      <!-- Deploy -->
      <div v-if="!isStatic" class="p-3 border-t border-blades-border">
        <button class="blades-btn-outline w-full text-xs py-2" @click="showDeploy = true">
          ↑ Publish to GitHub Pages
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>

    <DeployModal v-if="showDeploy && !isStatic" @close="showDeploy = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useCharactersStore } from '@/stores/characters'
import { useLocationsStore } from '@/stores/locations'
import { useFactionsStore } from '@/stores/factions'
import { useItemsStore } from '@/stores/items'
import { useCrewStore } from '@/stores/crew'
import DeployModal from '@/components/DeployModal.vue'
import NavSection from '@/components/NavSection.vue'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const route = useRoute()
const showDeploy = ref(false)

onMounted(() => {
  useCharactersStore().load()
  useLocationsStore().load()
  useFactionsStore().load()
  useItemsStore().load()
  useCrewStore().load()
})
</script>

<template>
  <div class="min-h-screen flex bg-lancer-bg bg-grid scanline">
    <!-- Sidebar -->
    <aside class="w-56 flex-shrink-0 flex flex-col lancer-panel border-r border-lancer-border">
      <!-- Logo -->
      <div class="p-4 border-b border-lancer-border">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-lancer-accent/20 border border-lancer-accent flex items-center justify-center">
            <span class="text-lancer-accent font-mono text-xs font-bold">//</span>
          </div>
          <div>
            <div class="text-lancer-accent font-display font-bold text-sm uppercase tracking-widest">TTDB</div>
            <div class="text-lancer-muted font-mono text-[10px]">LANCER COMPANION</div>
          </div>
        </div>
        <!-- Static mode badge -->
        <div v-if="isStatic" class="mt-2 text-[10px] font-mono text-lancer-muted border border-lancer-border px-2 py-1 text-center">
          ◆ READ-ONLY MODE
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-2 pt-4 space-y-1">
        <div class="text-[10px] font-mono text-lancer-muted uppercase tracking-widest px-3 mb-2">Reference</div>
        <RouterLink to="/compendium" class="nav-link" :class="{ active: route.path.startsWith('/compendium') }">
          <span class="text-base">⬡</span> Compendium
        </RouterLink>

        <div class="text-[10px] font-mono text-lancer-muted uppercase tracking-widest px-3 mb-2 mt-4">Pilots</div>
        <RouterLink to="/pilots" class="nav-link" :class="{ active: route.path.startsWith('/pilots') }">
          <span class="text-base">◉</span> Pilot Roster
        </RouterLink>

        <div class="text-[10px] font-mono text-lancer-muted uppercase tracking-widest px-3 mb-2 mt-4">GM Tools</div>
        <RouterLink to="/gm" class="nav-link" :class="{ active: route.path.startsWith('/gm') }">
          <span class="text-base">◈</span> Encounters
        </RouterLink>

        <template v-if="!isStatic">
          <div class="text-[10px] font-mono text-lancer-muted uppercase tracking-widest px-3 mb-2 mt-4">Content</div>
          <RouterLink to="/homebrew" class="nav-link" :class="{ active: route.path.startsWith('/homebrew') }">
            <span class="text-base">◎</span> Homebrew
          </RouterLink>
          <RouterLink to="/settings" class="nav-link" :class="{ active: route.path.startsWith('/settings') }">
            <span class="text-base">⚙</span> Settings
          </RouterLink>
        </template>
      </nav>

      <!-- Compendium sub-nav (when on compendium) -->
      <div v-if="route.path.startsWith('/compendium')" class="border-t border-lancer-border p-2">
        <div class="text-[10px] font-mono text-lancer-muted uppercase tracking-widest px-3 mb-2">Compendium</div>
        <RouterLink to="/compendium/frames" class="nav-link text-xs" :class="{ active: route.path.includes('/frames') }">
          Frames
        </RouterLink>
        <RouterLink to="/compendium/weapons" class="nav-link text-xs" :class="{ active: route.path.includes('/weapons') }">
          Weapons
        </RouterLink>
        <RouterLink to="/compendium/systems" class="nav-link text-xs" :class="{ active: route.path.includes('/systems') }">
          Systems
        </RouterLink>
        <RouterLink to="/compendium/npc-classes" class="nav-link text-xs" :class="{ active: route.path.includes('/npc-classes') }">
          NPC Classes
        </RouterLink>
      </div>

      <!-- GM sub-nav -->
      <div v-if="route.path.startsWith('/gm')" class="border-t border-lancer-border p-2">
        <div class="text-[10px] font-mono text-lancer-muted uppercase tracking-widest px-3 mb-2">GM Tools</div>
        <RouterLink to="/gm/encounters" class="nav-link text-xs" :class="{ active: route.path.includes('/encounters') }">
          Encounters
        </RouterLink>
        <RouterLink to="/gm/missions" class="nav-link text-xs" :class="{ active: route.path.includes('/missions') }">
          Missions
        </RouterLink>
      </div>

      <!-- Deploy button (local only) -->
      <div v-if="!isStatic" class="p-3 border-t border-lancer-border">
        <button
          class="lancer-btn-primary w-full text-xs py-2"
          @click="showDeployModal = true"
        >
          ↑ Publish to GitHub Pages
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>

    <!-- Deploy Modal -->
    <DeployModal v-if="showDeployModal && !isStatic" @close="showDeployModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useCompendiumStore } from '@/stores/compendium'
import { usePilotsStore } from '@/stores/pilots'
import { useGmStore } from '@/stores/gm'
import DeployModal from '@/components/DeployModal.vue'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const route = useRoute()
const compendiumStore = useCompendiumStore()
const pilotsStore = usePilotsStore()
const gmStore = useGmStore()
const showDeployModal = ref(false)

onMounted(() => {
  if (!isStatic) {
    compendiumStore.loadFromStorage()
    pilotsStore.load()
    gmStore.load()
  }
})
</script>

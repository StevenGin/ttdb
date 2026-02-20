<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-blades-text glow-gold">Factions</h1>
        <p class="text-blades-muted font-mono text-sm mt-1">{{ store.factions.length }} factions tracked</p>
      </div>
      <button v-if="!isStatic" class="blades-btn-ghost text-xs" @click="createNew">+ New Faction</button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <input v-model="search" class="blades-input max-w-xs" placeholder="Search factions..." />
      <select v-model="filterCat" class="blades-select max-w-[180px]">
        <option value="">All Categories</option>
        <option v-for="cat in store.categories" :key="cat" :value="cat">{{ capitalize(cat) }}</option>
      </select>
      <select v-model="filterStatus" class="blades-select max-w-[160px]">
        <option value="">All Relations</option>
        <option value="allies">Allies (+2/+3)</option>
        <option value="friendly">Friendly (+1)</option>
        <option value="neutral">Neutral (0)</option>
        <option value="hostile">Hostile (−1/−2)</option>
        <option value="war">At War (−3)</option>
      </select>
    </div>

    <!-- Category groups -->
    <div class="space-y-8">
      <div v-for="cat in visibleCategories" :key="cat">
        <div class="section-header"><h2>{{ capitalize(cat) }}</h2></div>
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <div
            v-for="faction in byCategory(cat)"
            :key="faction.id"
            class="blades-card p-4 transition-all cursor-pointer hover:border-blades-border-light group"
            :class="statusBorderClass(faction.crewStatus)"
            @click="openDrawer(faction.id)"
          >
            <!-- Banner thumbnail (if set) -->
            <div v-if="faction.bannerImage" class="h-20 -mx-4 -mt-4 mb-3 overflow-hidden rounded-t">
              <img :src="faction.bannerImage" class="w-full h-full object-cover" :alt="faction.name" />
            </div>

            <div class="flex items-start gap-3">
              <!-- Status widget (click stops propagation so it doesn't open drawer) -->
              <div class="flex-shrink-0 pt-0.5" @click.stop>
                <div class="flex flex-col items-center gap-0.5">
                  <button
                    v-if="!isStatic"
                    class="text-blades-muted hover:text-blades-gold text-[10px] leading-none"
                    @click="changeStatus(faction.id, 1)"
                  >▲</button>
                  <div
                    class="w-9 h-9 rounded-full border-2 flex items-center justify-center font-serif font-bold text-sm"
                    :class="statusBorderClass(faction.crewStatus) + ' ' + statusTextClass(faction.crewStatus)"
                  >{{ faction.crewStatus > 0 ? '+' : '' }}{{ faction.crewStatus }}</div>
                  <button
                    v-if="!isStatic"
                    class="text-blades-muted hover:text-blades-gold text-[10px] leading-none"
                    @click="changeStatus(faction.id, -1)"
                  >▼</button>
                </div>
                <div class="text-[9px] font-mono mt-1 text-center" :class="statusTextClass(faction.crewStatus)">
                  {{ STATUS_LABELS[faction.crewStatus] }}
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 flex-wrap mb-1">
                  <span class="font-serif font-semibold text-blades-text text-base group-hover:text-blades-gold transition-colors">
                    {{ faction.name }}
                  </span>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <div class="flex gap-0.5">
                      <div
                        v-for="t in 5" :key="t"
                        class="w-2 h-2 rounded-full border border-blades-border"
                        :class="t <= faction.tier ? 'bg-blades-gold border-blades-gold' : ''"
                      />
                    </div>
                    <span class="text-[10px] font-mono text-blades-muted">T{{ faction.tier }}</span>
                    <span
                      class="text-[10px] font-mono px-1 py-0.5 border rounded"
                      :class="faction.hold === 'strong' ? 'text-blades-gold border-blades-gold-dim' : 'text-blades-muted border-blades-border'"
                    >{{ faction.hold }}</span>
                  </div>
                </div>
                <p class="text-blades-muted font-mono text-xs leading-relaxed line-clamp-2">{{ faction.description }}</p>
                <div v-if="faction.headquarters" class="text-[10px] font-mono text-blades-muted/60 mt-1">◬ {{ faction.headquarters }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Faction drawer -->
    <FactionDrawer
      :open="drawerOpen"
      :faction-id="selectedId"
      @close="closeDrawer"
      @deleted="closeDrawer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFactionsStore } from '@/stores/factions'
import FactionDrawer from '@/components/FactionDrawer.vue'
import type { Faction, FactionStatus, FactionCategory } from '@/types/blades'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const store = useFactionsStore()
const search = ref('')
const filterCat = ref('')
const filterStatus = ref('')

const drawerOpen = ref(false)
const selectedId = ref<string | null>(null)

function openDrawer(id: string) {
  selectedId.value = id
  drawerOpen.value = true
}
function closeDrawer() {
  drawerOpen.value = false
}
function createNew() {
  const f = store.create({ name: 'New Faction', category: 'other', tier: 1, hold: 'weak', crewStatus: 0, description: '' })
  openDrawer(f.id)
}

const STATUS_LABELS: Record<number, string> = {
  '-3': 'War', '-2': 'Hostile', '-1': 'Cold',
  '0': 'Neutral', '1': 'Friendly', '2': 'Helpful', '3': 'Ally',
}

function statusTextClass(s: FactionStatus) {
  if (s <= -3) return 'text-red-400'; if (s === -2) return 'text-orange-400'
  if (s === -1) return 'text-amber-400'; if (s === 0)  return 'text-blades-muted'
  if (s === 1)  return 'text-emerald-400'; if (s === 2)  return 'text-green-400'
  return 'text-green-300'
}
function statusBorderClass(s: FactionStatus) {
  if (s <= -3) return 'border-red-900'; if (s === -2) return 'border-orange-900'
  if (s === -1) return 'border-amber-900'; if (s === 0)  return 'border-blades-border'
  if (s === 1)  return 'border-emerald-900'; if (s === 2)  return 'border-green-800'
  return 'border-green-700'
}
function changeStatus(id: string, delta: number) {
  const f = store.get(id)
  if (!f) return
  store.setStatus(id, Math.max(-3, Math.min(3, f.crewStatus + delta)) as FactionStatus)
}
function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

function matchesFilter(f: Faction) {
  const q = search.value.toLowerCase()
  if (q && !f.name.toLowerCase().includes(q) && !f.description.toLowerCase().includes(q)) return false
  if (filterCat.value && f.category !== filterCat.value) return false
  if (filterStatus.value) {
    if (filterStatus.value === 'allies'   && f.crewStatus < 2)  return false
    if (filterStatus.value === 'friendly' && f.crewStatus !== 1) return false
    if (filterStatus.value === 'neutral'  && f.crewStatus !== 0) return false
    if (filterStatus.value === 'hostile'  && (f.crewStatus > -1 || f.crewStatus < -2)) return false
    if (filterStatus.value === 'war'      && f.crewStatus !== -3) return false
  }
  return true
}

const visibleCategories = computed<FactionCategory[]>(() => {
  const cats = new Set<FactionCategory>()
  for (const f of store.factions) if (matchesFilter(f)) cats.add(f.category)
  const order: FactionCategory[] = ['government', 'institutions', 'labor & trade', 'criminal', 'underworld', 'streets', 'supernatural', 'other']
  return order.filter(c => cats.has(c))
})

function byCategory(cat: FactionCategory) {
  return store.factions
    .filter(f => f.category === cat && matchesFilter(f))
    .sort((a, b) => b.tier - a.tier || a.name.localeCompare(b.name))
}
</script>

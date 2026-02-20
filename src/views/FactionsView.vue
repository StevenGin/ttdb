<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-blades-text glow-gold">Factions</h1>
        <p class="text-blades-muted font-mono text-sm mt-1">{{ store.factions.length }} factions tracked</p>
      </div>
      <div v-if="!isStatic" class="flex gap-2">
        <button class="blades-btn-ghost text-xs" @click="openAdd">+ Custom Faction</button>
      </div>
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
        <div class="section-header">
          <h2>{{ capitalize(cat) }}</h2>
        </div>
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <div
            v-for="faction in byCategory(cat)"
            :key="faction.id"
            class="blades-card p-4 transition-colors"
            :class="statusBorderClass(faction.crewStatus)"
          >
            <div class="flex items-start gap-3">
              <!-- Status badge (clickable in edit mode) -->
              <div class="flex-shrink-0 pt-0.5">
                <div class="text-center">
                  <!-- Status stepper -->
                  <div class="flex flex-col items-center gap-0.5">
                    <button
                      v-if="!isStatic"
                      class="text-blades-muted hover:text-blades-gold text-[10px] leading-none"
                      @click="changeStatus(faction.id, 1)"
                    >▲</button>
                    <div
                      class="w-10 h-10 rounded-full border-2 flex items-center justify-center font-serif font-bold text-sm"
                      :class="statusBorderClass(faction.crewStatus) + ' ' + statusTextClass(faction.crewStatus)"
                    >
                      {{ faction.crewStatus > 0 ? '+' : '' }}{{ faction.crewStatus }}
                    </div>
                    <button
                      v-if="!isStatic"
                      class="text-blades-muted hover:text-blades-gold text-[10px] leading-none"
                      @click="changeStatus(faction.id, -1)"
                    >▼</button>
                  </div>
                  <div class="text-[9px] font-mono mt-1" :class="statusTextClass(faction.crewStatus)">
                    {{ STATUS_LABELS[faction.crewStatus] }}
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 flex-wrap mb-1">
                  <div>
                    <span class="font-serif font-semibold text-blades-text text-base">{{ faction.name }}</span>
                    <div v-if="!isStatic" class="inline-flex gap-1 ml-2">
                      <span v-if="!faction.isCore" class="blades-badge-muted text-[9px]">custom</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <!-- Tier pips -->
                    <div class="flex gap-0.5">
                      <div
                        v-for="t in 5"
                        :key="t"
                        class="w-2.5 h-2.5 rounded-full border border-blades-border"
                        :class="t <= faction.tier ? 'bg-blades-gold border-blades-gold' : ''"
                      />
                    </div>
                    <span class="text-[10px] font-mono text-blades-muted">T{{ faction.tier }}</span>
                    <span
                      class="text-[10px] font-mono px-1 py-0.5 border rounded-sm"
                      :class="faction.hold === 'strong'
                        ? 'text-blades-gold border-blades-gold-dim'
                        : 'text-blades-muted border-blades-border'"
                    >{{ faction.hold }}</span>
                  </div>
                </div>

                <!-- Description -->
                <p
                  class="text-blades-muted font-mono text-xs leading-relaxed mb-2 cursor-pointer"
                  :class="{ 'line-clamp-2': !expanded.has(faction.id) }"
                  @click="toggleExpanded(faction.id)"
                >{{ faction.description }}</p>

                <!-- Expanded details -->
                <div v-if="expanded.has(faction.id)" class="space-y-1.5 mt-2">
                  <div v-if="faction.headquarters" class="text-xs font-mono text-blades-muted">
                    <span class="text-blades-text/60">HQ:</span> {{ faction.headquarters }}
                  </div>
                  <div v-if="faction.goals" class="text-xs font-mono text-blades-muted">
                    <span class="text-blades-text/60">Goals:</span> {{ faction.goals }}
                  </div>
                  <div v-if="faction.threats" class="text-xs font-mono text-blades-muted">
                    <span class="text-blades-text/60">Threats:</span> {{ faction.threats }}
                  </div>
                  <div v-if="faction.notes" class="text-xs font-mono text-blades-muted italic">{{ faction.notes }}</div>
                </div>

                <!-- Edit / Delete -->
                <div v-if="!isStatic" class="flex gap-2 mt-2">
                  <button class="text-[10px] font-mono text-blades-muted hover:text-blades-gold" @click="openEdit(faction.id)">Edit</button>
                  <button v-if="!faction.isCore" class="text-[10px] font-mono text-blades-muted hover:text-blades-red-light" @click="del(faction.id)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="blades-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl mb-4">{{ editId ? 'Edit Faction' : 'New Faction' }}</h2>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="blades-label">Name *</label>
              <input v-model="form.name" class="blades-input" />
            </div>
            <div>
              <label class="blades-label">Category</label>
              <select v-model="form.category" class="blades-select">
                <option value="criminal">Criminal</option>
                <option value="institutions">Institutions</option>
                <option value="labor & trade">Labor & Trade</option>
                <option value="streets">Streets</option>
                <option value="supernatural">Supernatural</option>
                <option value="underworld">Underworld</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="blades-label">Tier (0–5)</label>
              <input v-model.number="form.tier" type="number" min="0" max="5" class="blades-input" />
            </div>
            <div>
              <label class="blades-label">Hold</label>
              <select v-model="form.hold" class="blades-select">
                <option value="strong">Strong</option>
                <option value="weak">Weak</option>
              </select>
            </div>
            <div>
              <label class="blades-label">Crew Status</label>
              <select v-model.number="form.crewStatus" class="blades-select">
                <option :value="-3">−3 At War</option>
                <option :value="-2">−2 Hostile</option>
                <option :value="-1">−1 Cold</option>
                <option :value="0">0 Neutral</option>
                <option :value="1">+1 Friendly</option>
                <option :value="2">+2 Helpful</option>
                <option :value="3">+3 Ally</option>
              </select>
            </div>
          </div>
          <div>
            <label class="blades-label">Description</label>
            <textarea v-model="form.description" class="blades-textarea" rows="3" />
          </div>
          <div>
            <label class="blades-label">Headquarters / Location</label>
            <input v-model="form.headquarters" class="blades-input" placeholder="Where they operate from" />
          </div>
          <div>
            <label class="blades-label">Goals</label>
            <textarea v-model="form.goals" class="blades-textarea" rows="2" />
          </div>
          <div>
            <label class="blades-label">Threats</label>
            <textarea v-model="form.threats" class="blades-textarea" rows="2" />
          </div>
          <div>
            <label class="blades-label">GM Notes</label>
            <textarea v-model="form.notes" class="blades-textarea" rows="2" />
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="blades-btn-gold text-xs" @click="submit">{{ editId ? 'Save' : 'Create' }}</button>
          <button class="blades-btn-ghost text-xs" @click="showForm = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFactionsStore } from '@/stores/factions'
import type { Faction, FactionStatus, FactionCategory } from '@/types/blades'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const store = useFactionsStore()
const search = ref('')
const filterCat = ref('')
const filterStatus = ref('')
const expanded = ref(new Set<string>())

const STATUS_LABELS: Record<number, string> = {
  '-3': 'War', '-2': 'Hostile', '-1': 'Cold',
  '0': 'Neutral', '1': 'Friendly', '2': 'Helpful', '3': 'Ally',
}

function statusTextClass(s: FactionStatus) {
  if (s <= -3) return 'text-red-400'
  if (s === -2) return 'text-orange-400'
  if (s === -1) return 'text-amber-400'
  if (s === 0)  return 'text-blades-muted'
  if (s === 1)  return 'text-emerald-400'
  if (s === 2)  return 'text-green-400'
  return 'text-green-300'
}

function statusBorderClass(s: FactionStatus) {
  if (s <= -3) return 'border-red-900'
  if (s === -2) return 'border-orange-900'
  if (s === -1) return 'border-amber-900'
  if (s === 0)  return 'border-blades-border'
  if (s === 1)  return 'border-emerald-900'
  if (s === 2)  return 'border-green-800'
  return 'border-green-700'
}

function changeStatus(id: string, delta: number) {
  const f = store.get(id)
  if (!f) return
  const next = Math.max(-3, Math.min(3, f.crewStatus + delta)) as FactionStatus
  store.setStatus(id, next)
}

function toggleExpanded(id: string) {
  expanded.value.has(id) ? expanded.value.delete(id) : expanded.value.add(id)
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

function matchesFilter(f: Faction) {
  const q = search.value.toLowerCase()
  if (q && !f.name.toLowerCase().includes(q) && !f.description.toLowerCase().includes(q)) return false
  if (filterCat.value && f.category !== filterCat.value) return false
  if (filterStatus.value) {
    if (filterStatus.value === 'allies' && f.crewStatus < 2) return false
    if (filterStatus.value === 'friendly' && f.crewStatus !== 1) return false
    if (filterStatus.value === 'neutral' && f.crewStatus !== 0) return false
    if (filterStatus.value === 'hostile' && (f.crewStatus > -1 || f.crewStatus < -2)) return false
    if (filterStatus.value === 'war' && f.crewStatus !== -3) return false
  }
  return true
}

const visibleCategories = computed<FactionCategory[]>(() => {
  const cats = new Set<FactionCategory>()
  for (const f of store.factions) {
    if (matchesFilter(f)) cats.add(f.category)
  }
  const order: FactionCategory[] = ['criminal', 'underworld', 'institutions', 'labor & trade', 'streets', 'supernatural', 'other']
  return order.filter(c => cats.has(c))
})

function byCategory(cat: FactionCategory) {
  return store.factions
    .filter(f => f.category === cat && matchesFilter(f))
    .sort((a, b) => b.tier - a.tier || a.name.localeCompare(b.name))
}

function del(id: string) {
  if (confirm('Delete this faction?')) store.remove(id)
}

// ── Form ──────────────────────────────────────────────────────────────────
const showForm = ref(false)
const editId = ref<string | null>(null)
const form = ref<Partial<Faction>>({})

function openAdd() {
  editId.value = null
  form.value = { name: '', category: 'other', tier: 1, hold: 'weak', crewStatus: 0, description: '' }
  showForm.value = true
}

function openEdit(id: string) {
  const f = store.get(id)
  if (!f) return
  editId.value = id
  form.value = { ...f }
  showForm.value = true
}

function submit() {
  if (!form.value.name?.trim()) return
  if (editId.value) {
    store.update(editId.value, form.value)
  } else {
    store.create(form.value)
  }
  showForm.value = false
}
</script>

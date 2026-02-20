<!-- Faction detail + edit drawer -->
<template>
  <Drawer :open="open" @close="$emit('close')">
    <template #header>
      <div class="flex-1 min-w-0" v-if="faction">
        <div v-if="!editing" class="flex items-center gap-2 flex-wrap">
          <span class="font-serif text-xl text-blades-text">{{ faction.name }}</span>
          <span class="blades-badge-muted text-[10px]">T{{ faction.tier }}</span>
          <span
            class="text-[10px] font-mono px-1.5 py-0.5 border rounded"
            :class="faction.hold === 'strong' ? 'text-blades-gold border-blades-gold-dim' : 'text-blades-muted border-blades-border'"
          >{{ faction.hold }}</span>
        </div>
        <div v-else class="text-blades-muted font-mono text-xs">Editing Faction</div>
      </div>
    </template>

    <template v-if="faction">
      <!-- Banner -->
      <div class="flex-shrink-0">
        <BannerImage
          :model-value="faction.bannerImage"
          :subject="faction.name + ' faction in Aurelion'"
          :description="faction.description"
          :height="180"
          @update:model-value="store.update(faction.id, { bannerImage: $event })"
        />
      </div>

      <!-- View mode -->
      <div v-if="!editing" class="p-5 space-y-5">
        <!-- Category + Status -->
        <div class="flex flex-wrap gap-2 items-center">
          <span class="blades-badge-muted text-xs capitalize">{{ faction.category }}</span>
          <div
            class="inline-flex items-center gap-1 px-2 py-0.5 border rounded text-xs font-mono"
            :class="statusBorderClass(faction.crewStatus) + ' ' + statusTextClass(faction.crewStatus)"
          >
            {{ faction.crewStatus > 0 ? '+' : '' }}{{ faction.crewStatus }}
            {{ STATUS_LABELS[faction.crewStatus] }}
          </div>
          <!-- Status stepper -->
          <div v-if="!isStatic" class="flex items-center gap-1">
            <button class="blades-btn-ghost text-xs px-2 py-0.5" @click="changeStatus(-1)">▼</button>
            <button class="blades-btn-ghost text-xs px-2 py-0.5" @click="changeStatus(1)">▲</button>
          </div>
        </div>

        <!-- Tier dots -->
        <div class="flex items-center gap-2">
          <span class="text-blades-muted font-mono text-xs">Tier</span>
          <div class="flex gap-1">
            <div
              v-for="t in 5" :key="t"
              class="w-3 h-3 rounded-full border border-blades-border"
              :class="t <= faction.tier ? 'bg-blades-gold border-blades-gold' : ''"
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <div class="blades-label">Description</div>
          <p class="text-blades-text font-sans text-sm leading-relaxed">{{ faction.description }}</p>
        </div>

        <!-- HQ -->
        <div v-if="faction.headquarters">
          <div class="blades-label">Headquarters</div>
          <p class="text-blades-muted font-mono text-sm">{{ faction.headquarters }}</p>
        </div>

        <!-- Goals -->
        <div v-if="faction.goals">
          <div class="blades-label">Goals</div>
          <p class="text-blades-muted font-mono text-sm leading-relaxed">{{ faction.goals }}</p>
        </div>

        <!-- Threats -->
        <div v-if="faction.threats">
          <div class="blades-label">Threats</div>
          <p class="text-blades-muted font-mono text-sm leading-relaxed">{{ faction.threats }}</p>
        </div>

        <!-- Notes -->
        <div v-if="faction.notes">
          <div class="blades-label">Notes</div>
          <p class="text-blades-muted font-mono text-sm italic leading-relaxed">{{ faction.notes }}</p>
        </div>
      </div>

      <!-- Edit mode -->
      <div v-else class="p-5 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2">
            <label class="blades-label">Name *</label>
            <input v-model="form.name" class="blades-input" />
          </div>
          <div>
            <label class="blades-label">Category</label>
            <select v-model="form.category" class="blades-select">
              <option value="government">Government</option>
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
            <label class="blades-label">Hold</label>
            <select v-model="form.hold" class="blades-select">
              <option value="strong">Strong</option>
              <option value="weak">Weak</option>
            </select>
          </div>
          <div>
            <label class="blades-label">Tier (0–5)</label>
            <input v-model.number="form.tier" type="number" min="0" max="5" class="blades-input" />
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
          <input v-model="form.headquarters" class="blades-input" placeholder="Where they operate" />
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
    </template>

    <template #footer>
      <div class="flex items-center justify-between gap-3" v-if="faction">
        <div class="flex gap-2">
          <template v-if="editing">
            <button class="blades-btn-gold text-xs" @click="commitEdit">Save</button>
            <button class="blades-btn-ghost text-xs" @click="editing = false">Cancel</button>
          </template>
          <button v-else-if="!isStatic" class="blades-btn-outline text-xs" @click="startEdit">Edit</button>
        </div>
        <button v-if="!isStatic" class="blades-btn-danger text-xs" @click="deleteFaction">Delete</button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Drawer from './Drawer.vue'
import BannerImage from './BannerImage.vue'
import { useFactionsStore } from '@/stores/factions'
import type { Faction, FactionStatus } from '@/types/blades'

const props = defineProps<{ open: boolean; factionId: string | null }>()
const emit = defineEmits<{ close: []; deleted: [] }>()

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const store = useFactionsStore()
const faction = computed(() => props.factionId ? store.get(props.factionId) ?? null : null)

const STATUS_LABELS: Record<number, string> = {
  '-3': 'At War', '-2': 'Hostile', '-1': 'Cold',
  '0': 'Neutral', '1': 'Friendly', '2': 'Helpful', '3': 'Ally',
}

function statusTextClass(s: FactionStatus) {
  if (s <= -3) return 'text-red-400'; if (s === -2) return 'text-orange-400'
  if (s === -1) return 'text-amber-400'; if (s === 0) return 'text-blades-muted'
  if (s === 1) return 'text-emerald-400'; if (s === 2) return 'text-green-400'
  return 'text-green-300'
}
function statusBorderClass(s: FactionStatus) {
  if (s <= -3) return 'border-red-800'; if (s === -2) return 'border-orange-800'
  if (s === -1) return 'border-amber-800'; if (s === 0) return 'border-blades-border'
  if (s === 1) return 'border-emerald-800'; if (s === 2) return 'border-green-700'
  return 'border-green-600'
}

function changeStatus(delta: number) {
  if (!faction.value) return
  const next = Math.max(-3, Math.min(3, faction.value.crewStatus + delta)) as FactionStatus
  store.setStatus(faction.value.id, next)
}

const editing = ref(false)
const form = ref<Partial<Faction>>({})

function startEdit() {
  if (!faction.value) return
  form.value = { ...faction.value }
  editing.value = true
}

function commitEdit() {
  if (!faction.value || !form.value.name?.trim()) return
  store.update(faction.value.id, form.value)
  editing.value = false
}

function deleteFaction() {
  if (!faction.value) return
  if (confirm(`Delete "${faction.value.name}"?`)) {
    store.remove(faction.value.id)
    emit('deleted')
    emit('close')
  }
}
</script>

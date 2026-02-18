<template>
  <div class="p-6 max-w-5xl" v-if="pilot">
    <RouterLink to="/pilots" class="text-lancer-muted hover:text-lancer-accent font-mono text-sm mb-6 inline-block">← Back to Roster</RouterLink>

    <!-- Pilot header -->
    <div class="lancer-card p-6 mb-6">
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <template v-if="!isStatic && editing">
            <input v-model="draftCallsign" class="lancer-input text-2xl font-display mb-2" placeholder="CALLSIGN" />
            <input v-model="draftName" class="lancer-input" placeholder="Full name" />
          </template>
          <template v-else>
            <h1 class="text-4xl text-lancer-accent glow-accent font-display font-bold">{{ pilot.callsign }}</h1>
            <div class="text-lancer-muted font-mono">{{ pilot.name || 'No name set' }}</div>
          </template>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <div class="stat-box">
            <span class="stat-val">{{ pilot.level }}</span>
            <span class="stat-label">License Level</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">{{ pilot.mechs.length }}</span>
            <span class="stat-label">Mechs</span>
          </div>
          <template v-if="!isStatic">
            <button v-if="!editing" class="lancer-btn-outline text-xs" @click="startEdit">Edit</button>
            <template v-else>
              <button class="lancer-btn-primary text-xs" @click="saveEdit">Save</button>
              <button class="lancer-btn-ghost text-xs" @click="cancelEdit">Cancel</button>
            </template>
          </template>
        </div>
      </div>

      <div v-if="editing" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label class="lancer-label">License Level</label>
          <input v-model.number="draftLevel" type="number" min="0" max="12" class="lancer-input" />
        </div>
        <div>
          <label class="lancer-label">Background</label>
          <input v-model="draftBackground" class="lancer-input" placeholder="e.g. Colonist, Soldier..." />
        </div>
        <div class="sm:col-span-2">
          <label class="lancer-label">History / Notes</label>
          <textarea v-model="draftHistory" class="lancer-textarea" rows="3"></textarea>
        </div>
      </div>
      <template v-else>
        <div v-if="pilot.background || pilot.history" class="mt-4 border-t border-lancer-border pt-4">
          <div v-if="pilot.background" class="text-xs font-mono text-lancer-muted mb-1">Background: {{ pilot.background }}</div>
          <p v-if="pilot.history" class="text-lancer-text/70 font-mono text-sm">{{ pilot.history }}</p>
        </div>
      </template>
    </div>

    <!-- Mechs -->
    <div class="lancer-card p-4 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg">Mechs</h2>
        <button v-if="!isStatic" class="lancer-btn-outline text-xs" @click="addMech">+ Add Mech</button>
      </div>
      <div v-if="pilot.mechs.length === 0" class="text-lancer-muted font-mono text-sm text-center py-8">
        No mechs built yet.
      </div>
      <div class="space-y-3">
        <div
          v-for="mech in pilot.mechs"
          :key="mech.id"
          class="border border-lancer-border p-3 flex items-center justify-between gap-3 flex-wrap"
          :class="{ 'border-lancer-accent/40': mech.id === pilot.activeMechId }"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span v-if="mech.id === pilot.activeMechId" class="lancer-badge-accent text-[10px]">ACTIVE</span>
              <span class="font-display font-semibold text-lancer-text">{{ mech.name }}</span>
            </div>
            <div class="text-lancer-muted font-mono text-xs">
              {{ mech.frameId ? compendiumStore.getFrame(mech.frameId)?.name ?? mech.frameId : 'No frame selected' }}
            </div>
          </div>
          <div v-if="!isStatic" class="flex gap-2">
            <button class="lancer-btn-ghost text-xs py-1" @click="setActiveMech(mech.id)">Set Active</button>
            <button class="lancer-btn-danger text-xs py-1" @click="removeMech(mech.id)">✕</button>
          </div>
        </div>
      </div>

      <!-- Add mech form -->
      <div v-if="showAddMech && !isStatic" class="mt-4 border-t border-lancer-border pt-4 space-y-3">
        <h3 class="text-sm font-mono text-lancer-muted uppercase tracking-widest">New Mech</h3>
        <div>
          <label class="lancer-label">Mech Name</label>
          <input v-model="newMechName" class="lancer-input" placeholder="e.g. IRON MAIDEN" />
        </div>
        <div>
          <label class="lancer-label">Frame</label>
          <select v-model="newMechFrameId" class="lancer-select">
            <option value="">Select a frame...</option>
            <option v-for="f in compendiumStore.allFrames" :key="f.id" :value="f.id">{{ f.source }} — {{ f.name }}</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button class="lancer-btn-primary text-xs" @click="confirmAddMech">Add Mech</button>
          <button class="lancer-btn-ghost text-xs" @click="showAddMech = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Talents -->
    <div class="lancer-card p-4 mb-6">
      <h2 class="text-lg mb-3">Talents</h2>
      <div v-if="pilot.talents.length === 0" class="text-lancer-muted font-mono text-sm text-center py-8">No talents assigned.</div>
      <div v-else class="flex flex-wrap gap-2">
        <span v-for="t in pilot.talents" :key="t.id" class="lancer-badge-accent">
          {{ t.id }} {{ '★'.repeat(t.rank) }}
        </span>
      </div>
    </div>

    <!-- Notes -->
    <div class="lancer-card p-4">
      <h2 class="text-lg mb-3">Notes</h2>
      <template v-if="!isStatic && editingNotes">
        <textarea v-model="draftNotes" class="lancer-textarea w-full mb-2" rows="6"></textarea>
        <div class="flex gap-2">
          <button class="lancer-btn-primary text-xs" @click="saveNotes">Save Notes</button>
          <button class="lancer-btn-ghost text-xs" @click="editingNotes = false">Cancel</button>
        </div>
      </template>
      <template v-else>
        <p class="text-lancer-text/70 font-mono text-sm whitespace-pre-wrap">{{ pilot.notes || 'No notes.' }}</p>
        <button v-if="!isStatic" class="lancer-btn-ghost text-xs mt-2" @click="startEditNotes">Edit Notes</button>
      </template>
    </div>
  </div>
  <div v-else class="p-6 text-lancer-muted font-mono">Pilot not found.</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { usePilotsStore } from '@/stores/pilots'
import { useCompendiumStore } from '@/stores/compendium'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const route = useRoute()
const pilotsStore = usePilotsStore()
const compendiumStore = useCompendiumStore()

const pilot = computed(() => pilotsStore.pilots.find(p => p.id === route.params.id))

// Edit pilot
const editing = ref(false)
const draftCallsign = ref('')
const draftName = ref('')
const draftLevel = ref(0)
const draftBackground = ref('')
const draftHistory = ref('')

function startEdit() {
  if (!pilot.value) return
  draftCallsign.value = pilot.value.callsign
  draftName.value = pilot.value.name
  draftLevel.value = pilot.value.level
  draftBackground.value = pilot.value.background ?? ''
  draftHistory.value = pilot.value.history ?? ''
  editing.value = true
}
function saveEdit() {
  pilotsStore.updatePilot(pilot.value!.id, {
    callsign: draftCallsign.value,
    name: draftName.value,
    level: draftLevel.value,
    background: draftBackground.value,
    history: draftHistory.value,
  })
  editing.value = false
}
function cancelEdit() { editing.value = false }

// Notes
const editingNotes = ref(false)
const draftNotes = ref('')
function startEditNotes() { draftNotes.value = pilot.value?.notes ?? ''; editingNotes.value = true }
function saveNotes() { pilotsStore.updatePilot(pilot.value!.id, { notes: draftNotes.value }); editingNotes.value = false }

// Mechs
const showAddMech = ref(false)
const newMechName = ref('')
const newMechFrameId = ref('')
function addMech() { showAddMech.value = true; newMechName.value = ''; newMechFrameId.value = '' }
function confirmAddMech() {
  pilotsStore.addMech(pilot.value!.id, { name: newMechName.value || 'UNNAMED', frameId: newMechFrameId.value })
  showAddMech.value = false
}
function removeMech(mechId: string) {
  if (confirm('Remove this mech?')) pilotsStore.deleteMech(pilot.value!.id, mechId)
}
function setActiveMech(mechId: string) {
  pilotsStore.updatePilot(pilot.value!.id, { activeMechId: mechId })
}
</script>

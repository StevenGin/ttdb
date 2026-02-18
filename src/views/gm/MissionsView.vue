<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-lancer-text glow-accent">MISSIONS</h1>
        <p class="text-lancer-muted font-mono text-sm mt-1">{{ gmStore.missions.length }} missions</p>
      </div>
      <button v-if="!isStatic" class="lancer-btn-primary" @click="createMission">+ New Mission</button>
    </div>

    <div v-if="gmStore.missions.length === 0" class="text-center py-24">
      <div class="text-6xl mb-4 opacity-20">◎</div>
      <div class="text-lancer-muted font-mono text-sm mb-4">No missions created.</div>
      <button v-if="!isStatic" class="lancer-btn-outline" @click="createMission">Create First Mission</button>
    </div>

    <div class="space-y-4">
      <div
        v-for="mission in gmStore.missions"
        :key="mission.id"
        class="lancer-card p-4"
      >
        <div class="flex items-start justify-between flex-wrap gap-4 mb-3">
          <div>
            <h3 class="font-display font-bold text-lancer-text text-xl">{{ mission.name }}</h3>
            <p v-if="mission.description" class="text-lancer-muted font-mono text-sm mt-1">{{ mission.description }}</p>
          </div>
          <div class="flex gap-2">
            <button v-if="!isStatic" class="lancer-btn-danger text-xs" @click="deleteMission(mission.id)">Delete</button>
          </div>
        </div>

        <!-- Steps -->
        <div class="space-y-2">
          <div
            v-for="step in mission.steps"
            :key="step.id"
            class="border-l-2 pl-3 flex items-center gap-3"
            :class="step.kind === 'encounter' ? 'border-lancer-red' : step.kind === 'rest' ? 'border-lancer-accent' : 'border-lancer-muted'"
          >
            <span class="text-[10px] font-mono text-lancer-muted uppercase">{{ step.kind }}</span>
            <span class="text-lancer-text font-mono text-sm">{{ step.name }}</span>
          </div>
        </div>

        <!-- Add step form -->
        <div v-if="!isStatic" class="mt-3 pt-3 border-t border-lancer-border">
          <div v-if="addingStepFor === mission.id" class="flex gap-2 flex-wrap items-end">
            <div>
              <label class="lancer-label">Type</label>
              <select v-model="newStepKind" class="lancer-select">
                <option value="encounter">Encounter</option>
                <option value="rest">Rest</option>
                <option value="freeplay">Freeplay</option>
              </select>
            </div>
            <div>
              <label class="lancer-label">Name</label>
              <input v-model="newStepName" class="lancer-input" placeholder="Step name..." />
            </div>
            <div v-if="newStepKind === 'encounter'">
              <label class="lancer-label">Link Encounter</label>
              <select v-model="newStepEncounterId" class="lancer-select">
                <option value="">None</option>
                <option v-for="e in gmStore.encounters" :key="e.id" :value="e.id">{{ e.name }}</option>
              </select>
            </div>
            <button class="lancer-btn-primary text-xs py-1.5" @click="confirmAddStep(mission.id)">Add</button>
            <button class="lancer-btn-ghost text-xs py-1.5" @click="addingStepFor = null">Cancel</button>
          </div>
          <button v-else class="text-lancer-muted hover:text-lancer-accent font-mono text-xs" @click="startAddStep(mission.id)">
            + Add Step
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGmStore } from '@/stores/gm'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const gmStore = useGmStore()

function createMission() { gmStore.createMission() }
function deleteMission(id: string) { if (confirm('Delete mission?')) gmStore.deleteMission(id) }

const addingStepFor = ref<string | null>(null)
const newStepKind = ref<'encounter' | 'rest' | 'freeplay'>('encounter')
const newStepName = ref('')
const newStepEncounterId = ref('')

function startAddStep(missionId: string) {
  addingStepFor.value = missionId
  newStepName.value = ''
  newStepKind.value = 'encounter'
  newStepEncounterId.value = ''
}

function confirmAddStep(missionId: string) {
  gmStore.addStepToMission(missionId, {
    kind: newStepKind.value,
    name: newStepName.value || newStepKind.value,
    encounterId: newStepEncounterId.value || undefined,
    description: undefined,
  })
  addingStepFor.value = null
}
</script>

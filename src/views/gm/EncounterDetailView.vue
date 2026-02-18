<template>
  <div class="p-6 max-w-4xl" v-if="encounter">
    <RouterLink to="/gm/encounters" class="text-lancer-muted hover:text-lancer-accent font-mono text-sm mb-6 inline-block">
      ← Back to Encounters
    </RouterLink>

    <!-- Header -->
    <div class="lancer-card p-6 mb-6">
      <template v-if="editing">
        <div class="space-y-3">
          <div>
            <label class="lancer-label">Name</label>
            <input v-model="draft.name" class="lancer-input text-xl" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="lancer-label">Location</label>
              <input v-model="draft.location" class="lancer-input" placeholder="e.g. Industrial Zone, Sector 7" />
            </div>
            <div>
              <label class="lancer-label">Environment</label>
              <input v-model="draft.environment" class="lancer-input" placeholder="e.g. Urban, Desert..." />
            </div>
          </div>
          <div>
            <label class="lancer-label">Sitrep</label>
            <input v-model="draft.sitrep" class="lancer-input" placeholder="e.g. Extraction, Escort..." />
          </div>
          <div>
            <label class="lancer-label">Description / Briefing</label>
            <textarea v-model="draft.description" class="lancer-textarea" rows="4"></textarea>
          </div>
          <div>
            <label class="lancer-label">Notes (GM only)</label>
            <textarea v-model="draft.notes" class="lancer-textarea" rows="3"></textarea>
          </div>
          <div class="flex gap-2">
            <button class="lancer-btn-primary text-xs" @click="saveEdit">Save</button>
            <button class="lancer-btn-ghost text-xs" @click="editing = false">Cancel</button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 class="text-3xl text-lancer-text glow-accent font-display font-bold">{{ encounter.name }}</h1>
            <div class="flex flex-wrap gap-2 mt-2">
              <span v-if="encounter.location" class="lancer-badge-muted text-xs">📍 {{ encounter.location }}</span>
              <span v-if="encounter.environment" class="lancer-badge-muted text-xs">🌍 {{ encounter.environment }}</span>
              <span v-if="encounter.sitrep" class="lancer-badge-accent text-xs">⚑ {{ encounter.sitrep }}</span>
            </div>
          </div>
          <button v-if="!isStatic" class="lancer-btn-outline text-xs" @click="startEdit">Edit</button>
        </div>
        <p v-if="encounter.description" class="text-lancer-text/80 font-mono text-sm mt-4 leading-relaxed">{{ encounter.description }}</p>
        <p v-if="encounter.notes && !isStatic" class="text-lancer-muted font-mono text-xs mt-3 italic border-t border-lancer-border pt-3">GM: {{ encounter.notes }}</p>
      </template>
    </div>

    <!-- NPC Roster -->
    <div class="lancer-card p-4 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg">NPC Roster</h2>
        <button v-if="!isStatic" class="lancer-btn-outline text-xs" @click="showAddNpc = true">+ Add NPC</button>
      </div>

      <div v-if="encounter.npcs.length === 0" class="text-lancer-muted font-mono text-sm text-center py-8">No NPCs in this encounter.</div>

      <div class="space-y-2">
        <div
          v-for="(npc, i) in encounter.npcs"
          :key="i"
          class="border border-lancer-border p-3 flex items-center justify-between gap-3 flex-wrap"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="lancer-badge-muted text-[10px]">TIER {{ npc.tier }}</span>
              <span v-if="npc.name" class="font-display font-semibold text-lancer-text">{{ npc.name }}</span>
            </div>
            <div class="text-lancer-muted font-mono text-xs">
              {{ getNpcClassName(npc.npcId) }}
              <span v-if="npc.templateIds.length"> + {{ npc.templateIds.join(', ') }}</span>
            </div>
            <div v-if="npcStats(npc)" class="flex gap-3 mt-1 text-xs font-mono">
              <span class="text-lancer-red-light">HP {{ npcStats(npc)?.hp }}</span>
              <span class="text-lancer-muted">ARM {{ npcStats(npc)?.armor }}</span>
              <span class="text-lancer-muted">EVA {{ npcStats(npc)?.evade }}</span>
              <span class="text-lancer-muted">SPD {{ npcStats(npc)?.speed }}</span>
            </div>
          </div>
          <button v-if="!isStatic" class="lancer-btn-danger text-xs py-0.5 px-2" @click="removeNpc(i)">✕</button>
        </div>
      </div>

      <!-- Add NPC form -->
      <div v-if="showAddNpc && !isStatic" class="mt-4 border-t border-lancer-border pt-4 space-y-3">
        <h3 class="text-sm font-mono text-lancer-muted uppercase tracking-widest">Add NPC</h3>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="lancer-label">NPC Class</label>
            <select v-model="newNpcClassId" class="lancer-select">
              <option value="">Select class...</option>
              <option v-for="c in compendiumStore.allNpcClasses" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="lancer-label">Tier</label>
            <select v-model.number="newNpcTier" class="lancer-select">
              <option :value="1">Tier 1</option>
              <option :value="2">Tier 2</option>
              <option :value="3">Tier 3</option>
            </select>
          </div>
        </div>
        <div>
          <label class="lancer-label">Custom Name (optional)</label>
          <input v-model="newNpcName" class="lancer-input" placeholder="e.g. Commander Vasquez" />
        </div>
        <div class="flex gap-2">
          <button class="lancer-btn-primary text-xs" @click="confirmAddNpc">Add to Roster</button>
          <button class="lancer-btn-ghost text-xs" @click="showAddNpc = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="p-6 text-lancer-muted font-mono">Encounter not found.</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useGmStore } from '@/stores/gm'
import { useCompendiumStore } from '@/stores/compendium'
import type { Encounter, EncounterNpc } from '@/types/lancer'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const route = useRoute()
const gmStore = useGmStore()
const compendiumStore = useCompendiumStore()

const encounter = computed(() => gmStore.encounters.find(e => e.id === route.params.id))

// Edit
const editing = ref(false)
const draft = ref<Partial<Encounter>>({})
function startEdit() { draft.value = { ...encounter.value }; editing.value = true }
function saveEdit() { gmStore.updateEncounter(encounter.value!.id, draft.value); editing.value = false }

// NPC helpers
function getNpcClassName(id: string) {
  return compendiumStore.getNpcClass(id)?.name ?? id
}
function npcStats(npc: EncounterNpc) {
  const cls = compendiumStore.getNpcClass(npc.npcId)
  if (!cls) return null
  const t = npc.tier - 1
  return {
    hp: cls.stats.hp?.[t],
    armor: cls.stats.armor?.[t],
    evade: cls.stats.evade?.[t],
    speed: cls.stats.speed?.[t],
  }
}

// Add NPC
const showAddNpc = ref(false)
const newNpcClassId = ref('')
const newNpcTier = ref<1|2|3>(1)
const newNpcName = ref('')

function confirmAddNpc() {
  if (!newNpcClassId.value) return
  gmStore.addNpcToEncounter(encounter.value!.id, {
    npcId: newNpcClassId.value,
    templateIds: [],
    tier: newNpcTier.value,
    name: newNpcName.value || undefined,
  })
  showAddNpc.value = false
  newNpcClassId.value = ''
  newNpcName.value = ''
}

function removeNpc(index: number) {
  gmStore.removeNpcFromEncounter(encounter.value!.id, index)
}
</script>

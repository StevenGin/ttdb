<template>
  <div class="min-h-full p-6 flex flex-col gap-5">

    <!-- Header -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-serif text-blades-gold glow-amber tracking-wide">Potential Scores</h1>
        <p class="text-blades-muted font-mono text-xs mt-1 tracking-wider uppercase">
          {{ store.jobs.length }} score{{ store.jobs.length !== 1 ? 's' : '' }} on the board
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div v-if="store.jobs.length > 1" class="flex items-center gap-1">
          <button class="flip-arrow" :disabled="idx === 0" @click="prev">◂</button>
          <span class="font-mono text-xs text-blades-muted px-2 tabular-nums select-none">
            {{ idx + 1 }} / {{ store.jobs.length }}
          </span>
          <button class="flip-arrow" :disabled="idx === store.jobs.length - 1" @click="next">▸</button>
        </div>
        <button v-if="!isStatic" class="blades-btn-gold text-xs py-1.5 px-4" @click="createJob">
          + New Score
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="store.jobs.length === 0"
         class="flex-1 flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div class="text-7xl text-blades-border/40 font-serif select-none">◆</div>
      <div class="space-y-1">
        <div class="text-blades-text font-mono text-sm">No scores identified</div>
        <div class="text-blades-muted font-mono text-xs">Plan your next job to see it here</div>
      </div>
      <button v-if="!isStatic" class="blades-btn-gold text-xs mt-2" @click="createJob">
        Plan a Score
      </button>
    </div>

    <!-- Dossier card -->
    <template v-else>
      <Transition name="flip" mode="out-in">
        <div :key="current!.id" class="blades-card overflow-hidden max-w-2xl mx-auto w-full">

          <!-- Classified strip -->
          <div class="bg-red-950/50 border-b border-red-900/30 py-1.5 text-center
                      font-mono text-[10px] tracking-[0.3em] text-red-400/70 select-none">
            ▓&nbsp;&nbsp;OPERATIONAL DOSSIER&nbsp;&nbsp;—&nbsp;&nbsp;CLASSIFIED&nbsp;&nbsp;▓
          </div>

          <!-- ── Edit form ──────────────────────────────────────────────── -->
          <div v-if="editing" class="p-5 space-y-4">

            <div>
              <label class="blades-label">Operation Name</label>
              <input v-model="draft.name" class="blades-input" placeholder="The Silkshore Vault..." />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="blades-label">Score Type</label>
                <select v-model="draft.type" class="blades-select">
                  <option v-for="t in SCORE_TYPES" :key="t" :value="t">
                    {{ SCORE_TYPE_ICONS[t] }} {{ t }}
                  </option>
                </select>
              </div>
              <div>
                <label class="blades-label">Status</label>
                <select v-model="draft.status" class="blades-select">
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="complete">Complete</option>
                  <option value="abandoned">Abandoned</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="blades-label">Target Faction</label>
                <select v-model="draft.targetFactionId" class="blades-select">
                  <option value="">— None —</option>
                  <option v-for="f in factionStore.factions" :key="f.id" :value="f.id">
                    {{ f.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="blades-label">Location</label>
                <select v-model="draft.locationId" class="blades-select">
                  <option value="">— None —</option>
                  <option v-for="l in locationStore.locations" :key="l.id" :value="l.id">
                    {{ l.name }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="blades-label">NPC Contacts</label>
              <div class="grid grid-cols-2 gap-0.5 max-h-40 overflow-y-auto border border-blades-border
                          bg-blades-bg rounded-sm p-1.5">
                <label
                  v-for="npc in allNpcs" :key="npc.id"
                  class="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-sm
                         hover:bg-blades-border/20 font-mono text-xs"
                >
                  <input type="checkbox" :value="npc.id" v-model="draft.contactIds" class="accent-amber-600" />
                  <span class="text-blades-text">{{ npc.name }}</span>
                  <span v-if="npc.role" class="text-blades-muted text-[10px] truncate">{{ npc.role }}</span>
                </label>
                <div v-if="allNpcs.length === 0"
                     class="col-span-2 text-blades-muted text-[10px] px-2 py-2">
                  No NPCs yet — add some in the NPCs section
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="blades-label">Coin</label>
                <input type="number" v-model.number="draft.coin" min="0" max="9" class="blades-input" />
              </div>
              <div>
                <label class="blades-label">Rep</label>
                <input type="number" v-model.number="draft.rep" min="0" max="9" class="blades-input" />
              </div>
              <div>
                <label class="blades-label">Heat</label>
                <input type="number" v-model.number="draft.heat" min="0" max="9" class="blades-input" />
              </div>
            </div>

            <div>
              <label class="blades-label">Briefing</label>
              <textarea v-model="draft.description" class="blades-textarea" rows="3"
                        placeholder="What is this job? What's at stake?" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="blades-label">Plan Type</label>
                <select v-model="draft.plan" class="blades-select">
                  <option value="">— None —</option>
                  <option v-for="p in PLAN_TYPES" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>
              <div>
                <label class="blades-label">Plan Detail</label>
                <input v-model="draft.detail" class="blades-input"
                       placeholder="via the servants' entrance..." />
              </div>
            </div>

            <div>
              <label class="blades-label">Notes</label>
              <textarea v-model="draft.notes" class="blades-textarea" rows="2"
                        placeholder="Complications, unknowns..." />
            </div>

            <div class="flex justify-between pt-2 border-t border-blades-border/50">
              <button class="blades-btn-ghost text-xs" @click="cancelEdit">Cancel</button>
              <button class="blades-btn-gold text-xs" @click="saveEdit">Save Changes</button>
            </div>
          </div>

          <!-- ── Briefing view ──────────────────────────────────────────── -->
          <div v-else class="p-5 space-y-4">

            <!-- Type + status -->
            <div class="flex items-center justify-between">
              <span class="font-mono text-[10px] tracking-widest uppercase border px-2 py-0.5 rounded-sm
                           text-blades-gold border-blades-gold-dim bg-blades-gold/5">
                {{ SCORE_TYPE_ICONS[current!.type] }} {{ current!.type }}
              </span>
              <span :class="statusClass(current!.status)"
                    class="font-mono text-[10px] tracking-widest uppercase border px-2 py-0.5 rounded-sm">
                ● {{ current!.status }}
              </span>
            </div>

            <!-- Operation name -->
            <div class="text-center py-1">
              <div class="text-xl font-serif text-blades-gold glow-amber tracking-widest uppercase leading-snug">
                "{{ current!.name }}"
              </div>
              <div class="border-b border-blades-gold/20 mt-3" />
            </div>

            <!-- Target -->
            <div v-if="currentFaction || currentLocation" class="space-y-2">
              <div class="brief-label">Target</div>
              <div v-if="currentFaction" class="brief-row">
                <span class="brief-key">Faction</span>
                <span class="brief-val">
                  {{ currentFaction.name }}
                  <span class="text-blades-muted ml-1">— Tier {{ currentFaction.tier }}</span>
                </span>
              </div>
              <div v-if="currentLocation" class="brief-row">
                <span class="brief-key">Location</span>
                <span class="brief-val">◬ {{ currentLocation.name }}</span>
              </div>
            </div>

            <!-- Contacts -->
            <div v-if="currentContacts.length" class="space-y-2">
              <div class="brief-label">Contacts</div>
              <div v-for="c in currentContacts" :key="c.id"
                   class="flex items-baseline gap-2 font-mono text-xs">
                <span class="text-blades-muted flex-shrink-0">◉</span>
                <span class="text-blades-text">{{ c.name }}</span>
                <span v-if="c.role" class="text-blades-muted text-[10px]">{{ c.role }}</span>
              </div>
            </div>

            <!-- Expected take -->
            <div class="space-y-2">
              <div class="brief-label">Expected Take</div>
              <div class="flex gap-6 flex-wrap">
                <!-- Coin -->
                <div class="space-y-0.5">
                  <div class="font-mono text-[9px] tracking-[0.15em] uppercase text-blades-muted">Coin</div>
                  <div class="flex items-center gap-1">
                    <div class="flex gap-0.5">
                      <div v-for="i in 9" :key="i" class="w-3 h-2.5 rounded-sm"
                           :class="i <= (current!.coin ?? 0) ? 'bg-blades-gold' : 'bg-blades-border/40'" />
                    </div>
                    <span class="font-mono text-xs text-blades-muted ml-1 tabular-nums">{{ current!.coin ?? 0 }}</span>
                  </div>
                </div>
                <!-- Rep -->
                <div class="space-y-0.5">
                  <div class="font-mono text-[9px] tracking-[0.15em] uppercase text-blades-muted">Rep</div>
                  <div class="flex items-center gap-1">
                    <div class="flex gap-0.5">
                      <div v-for="i in 9" :key="i" class="w-3 h-2.5 rounded-sm"
                           :class="i <= (current!.rep ?? 0) ? 'bg-blades-silver-dim' : 'bg-blades-border/40'" />
                    </div>
                    <span class="font-mono text-xs text-blades-muted ml-1 tabular-nums">{{ current!.rep ?? 0 }}</span>
                  </div>
                </div>
                <!-- Heat -->
                <div class="space-y-0.5">
                  <div class="font-mono text-[9px] tracking-[0.15em] uppercase text-blades-muted">Heat</div>
                  <div class="flex items-center gap-1">
                    <div class="flex gap-0.5">
                      <div v-for="i in 9" :key="i" class="w-3 h-2.5 rounded-sm"
                           :class="i <= (current!.heat ?? 0) ? 'bg-blades-red-light' : 'bg-blades-border/40'" />
                    </div>
                    <span class="font-mono text-xs text-blades-muted ml-1 tabular-nums">{{ current!.heat ?? 0 }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Briefing -->
            <div v-if="current!.description" class="space-y-2">
              <div class="brief-label">Briefing</div>
              <p class="font-mono text-xs text-blades-text leading-relaxed whitespace-pre-wrap">
                {{ current!.description }}
              </p>
            </div>

            <!-- Approach -->
            <div v-if="current!.plan || current!.detail" class="space-y-2">
              <div class="brief-label">Approach</div>
              <div class="flex gap-4 flex-wrap font-mono text-xs">
                <span v-if="current!.plan">
                  <span class="text-blades-muted">Plan:</span>
                  <span class="text-blades-gold ml-1">{{ current!.plan }}</span>
                </span>
                <span v-if="current!.detail">
                  <span class="text-blades-muted">Detail:</span>
                  <span class="text-blades-text ml-1">{{ current!.detail }}</span>
                </span>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="current!.notes" class="space-y-2">
              <div class="brief-label">Notes</div>
              <p class="font-mono text-xs text-blades-muted leading-relaxed whitespace-pre-wrap">
                {{ current!.notes }}
              </p>
            </div>

            <!-- Actions -->
            <div v-if="!isStatic"
                 class="flex items-center justify-between pt-3 border-t border-blades-border/40">
              <button class="blades-btn-danger text-[10px] py-1 px-3" @click="confirmDelete">
                ✕ Discard
              </button>
              <button class="blades-btn-ghost text-xs" @click="startEdit">Edit Dossier</button>
            </div>
          </div>

        </div>
      </Transition>

      <!-- Page dots -->
      <div v-if="store.jobs.length > 1" class="flex justify-center gap-2 pb-2">
        <button
          v-for="(_, i) in store.jobs" :key="i"
          class="w-2 h-2 rounded-full transition-colors duration-200"
          :class="i === idx ? 'bg-blades-gold' : 'bg-blades-border hover:bg-blades-border-light'"
          @click="idx = i; editing = false"
        />
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useJobsStore }       from '@/stores/jobs'
import { useCharactersStore } from '@/stores/characters'
import { useLocationsStore }  from '@/stores/locations'
import { useFactionsStore }   from '@/stores/factions'
import { SCORE_TYPES, SCORE_TYPE_ICONS, PLAN_TYPES } from '@/types/blades'
import type { Score } from '@/types/blades'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const store         = useJobsStore()
const charStore     = useCharactersStore()
const locationStore = useLocationsStore()
const factionStore  = useFactionsStore()

// ── Navigation ───────────────────────────────────────────────────────────────

const idx     = ref(0)
const editing = ref(false)
const current = computed(() => store.jobs[idx.value] ?? null)

function prev() { if (idx.value > 0)                      { idx.value--; editing.value = false } }
function next() { if (idx.value < store.jobs.length - 1)  { idx.value++; editing.value = false } }

function onKey(e: KeyboardEvent) {
  if (editing.value) return
  if (e.key === 'ArrowLeft')  prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => { store.load(); window.addEventListener('keydown', onKey) })
onUnmounted(() => { window.removeEventListener('keydown', onKey) })

// ── Lookups ──────────────────────────────────────────────────────────────────

const allNpcs = computed(() =>
  charStore.characters.filter(c => c.isNpc).sort((a, b) => a.name.localeCompare(b.name))
)

const currentFaction = computed(() =>
  current.value?.targetFactionId
    ? factionStore.factions.find(f => f.id === current.value!.targetFactionId)
    : null
)

const currentLocation = computed(() =>
  current.value?.locationId
    ? locationStore.locations.find(l => l.id === current.value!.locationId)
    : null
)

const currentContacts = computed(() => {
  if (!current.value?.contactIds?.length) return []
  return current.value.contactIds
    .map(id => charStore.characters.find(c => c.id === id))
    .filter((c): c is NonNullable<typeof c> => c != null)
})

// ── Status styling ───────────────────────────────────────────────────────────

function statusClass(status: Score['status']) {
  const map: Record<Score['status'], string> = {
    planning:  'text-blades-muted  border-blades-border    bg-blades-surface',
    active:    'text-blades-gold   border-blades-gold-dim  bg-blades-gold/5',
    complete:  'text-green-400     border-green-800        bg-green-950/30',
    abandoned: 'text-red-400       border-red-900          bg-red-950/20',
  }
  return map[status]
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

const draft = ref<Score>({
  id: '', name: '', type: 'heist', status: 'planning',
  contactIds: [], clocks: [], createdAt: '', updatedAt: '',
})

function createJob() {
  const job = store.create()
  idx.value = 0   // store.create() unshifts
  draft.value = { ...job, contactIds: [] }
  editing.value = true
}

function startEdit() {
  draft.value = { ...current.value!, contactIds: [...(current.value!.contactIds ?? [])] }
  editing.value = true
}

function cancelEdit() {
  // If this was a fresh untouched job, clean it up
  if (current.value?.name === 'Unnamed Score' && !current.value.description) {
    store.remove(current.value.id)
    idx.value = Math.min(idx.value, store.jobs.length - 1)
  }
  editing.value = false
}

function saveEdit() {
  store.update(draft.value.id, draft.value)
  editing.value = false
}

function confirmDelete() {
  if (!current.value) return
  if (confirm(`Discard "${current.value.name}"?`)) {
    store.remove(current.value.id)
    idx.value = Math.min(idx.value, store.jobs.length - 1)
    editing.value = false
  }
}
</script>

<style scoped>
.brief-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgb(var(--c-blades-muted));
  border-top: 1px solid rgba(var(--c-blades-border), 0.5);
  padding-top: 0.5rem;
}

.brief-row {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
}
.brief-key {
  color: rgb(var(--c-blades-muted));
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  width: 4.5rem;
  flex-shrink: 0;
}
.brief-val { color: rgb(var(--c-blades-text)); }

.flip-arrow {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.875rem;
  color: rgb(var(--c-blades-muted));
  border: 1px solid rgb(var(--c-blades-border));
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  line-height: 1;
}
.flip-arrow:hover:not(:disabled) {
  color: rgb(var(--c-blades-gold));
  border-color: rgb(var(--c-blades-gold-dim));
}
.flip-arrow:disabled { opacity: 0.3; cursor: not-allowed; }

.flip-enter-active,
.flip-leave-active { transition: opacity 0.18s ease; }
.flip-enter-from,
.flip-leave-to     { opacity: 0; }
</style>

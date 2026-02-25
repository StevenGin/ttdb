<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl text-blades-text glow-amber">Journal</h1>
        <p class="text-blades-muted font-mono text-sm mt-1">
          {{ filteredEntries.length }}<template v-if="filteredEntries.length !== allEntries.length"> of {{ allEntries.length }}</template>
          entr{{ allEntries.length !== 1 ? 'ies' : 'y' }}
        </p>
      </div>
      <button v-if="!isStatic" class="blades-btn-gold" @click="createEntry">+ New Entry</button>
    </div>

    <!-- Search -->
    <div class="flex flex-wrap gap-3 mb-6">
      <input
        v-model="search"
        class="blades-input max-w-xs"
        placeholder="Search entries…"
      />
      <button
        v-if="search"
        class="blades-btn-ghost text-xs"
        @click="search = ''"
      >Clear</button>
    </div>

    <!-- Empty states -->
    <div v-if="allEntries.length === 0" class="text-center py-24">
      <div class="text-6xl mb-4 opacity-10 font-serif">✦</div>
      <p class="text-blades-muted font-mono text-sm mb-4">No journal entries yet.</p>
      <button v-if="!isStatic" class="blades-btn-outline" @click="createEntry">Record the first session</button>
    </div>

    <div v-else-if="filteredEntries.length === 0" class="text-center py-24">
      <div class="text-6xl mb-4 opacity-10 font-serif">✦</div>
      <p class="text-blades-muted font-mono text-sm">No entries match your search.</p>
    </div>

    <!-- Entry list -->
    <div v-else class="space-y-4">
      <div
        v-for="entry in filteredEntries"
        :key="entry.id"
        class="blades-card overflow-hidden"
      >
        <!-- Entry header (always visible) -->
        <div
          class="p-4 flex items-start gap-3 cursor-pointer hover:bg-blades-border/10 transition-colors"
          @click="toggle(entry.id)"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span v-if="entry.sessionNumber" class="blades-badge-gold text-xs">Session {{ entry.sessionNumber }}</span>
              <span v-if="!isStatic && entry.isPublic === false" class="text-[10px] font-mono text-blades-muted/60">🔒</span>
              <span v-else-if="!isStatic" class="text-[10px] font-mono text-blades-sage-light/60">🌐</span>
            </div>
            <h3 class="text-lg font-serif text-blades-text">{{ entry.title }}</h3>
            <div class="text-[10px] font-mono text-blades-muted mt-0.5">
              {{ formatDate(entry.createdAt) }}
            </div>
            <!-- Tags -->
            <div v-if="entry.tags?.length" class="flex flex-wrap gap-1 mt-2">
              <span
                v-for="tag in entry.tags"
                :key="tag"
                class="blades-badge-muted text-[10px]"
              >{{ tag }}</span>
            </div>
            <!-- Content preview (collapsed) -->
            <p v-if="!expanded.has(entry.id) && entry.content" class="text-blades-muted font-mono text-xs mt-2 line-clamp-2">
              {{ entry.content }}
            </p>
          </div>
          <div class="text-blades-muted text-xs flex-shrink-0 mt-1">{{ expanded.has(entry.id) ? '▲' : '▼' }}</div>
        </div>

        <!-- Expanded content -->
        <div v-if="expanded.has(entry.id)" class="border-t border-blades-border">
          <!-- View mode -->
          <template v-if="editingId !== entry.id">
            <div class="p-5 space-y-4">
              <div v-if="entry.content" class="text-blades-text font-sans text-sm leading-relaxed whitespace-pre-wrap">{{ entry.content }}</div>
              <div v-else class="text-blades-muted font-mono text-xs opacity-60">No content yet.</div>

              <!-- Linked entities -->
              <div v-if="linkedNpcs(entry).length || linkedLocations(entry).length || linkedFactions(entry).length" class="space-y-2">
                <div class="blades-label">Links</div>
                <div class="flex flex-wrap gap-2">
                  <RouterLink
                    v-for="npc in linkedNpcs(entry)"
                    :key="npc.id"
                    to="/npcs"
                    class="blades-badge-gold text-xs hover:opacity-80 transition-opacity"
                  >◈ {{ npc.name }}</RouterLink>
                  <RouterLink
                    v-for="loc in linkedLocations(entry)"
                    :key="loc.id"
                    to="/locations"
                    class="blades-badge-muted text-xs hover:opacity-80 transition-opacity"
                  >◬ {{ loc.name }}</RouterLink>
                  <RouterLink
                    v-for="fac in linkedFactions(entry)"
                    :key="fac.id"
                    to="/factions"
                    class="blades-badge-muted text-xs hover:opacity-80 transition-opacity"
                  >⚑ {{ fac.name }}</RouterLink>
                </div>
              </div>
            </div>

            <div v-if="!isStatic" class="px-5 pb-4 flex items-center gap-2">
              <button class="blades-btn-outline text-xs" @click="startEdit(entry)">Edit</button>
              <button class="blades-btn-danger text-xs" @click="deleteEntry(entry.id)">Delete</button>
            </div>
          </template>

          <!-- Edit mode -->
          <template v-else>
            <div class="p-5 space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div class="col-span-2">
                  <label class="blades-label">Title</label>
                  <input v-model="draft.title" class="blades-input" placeholder="Session title…" />
                </div>
                <div>
                  <label class="blades-label">Session #</label>
                  <input v-model.number="draft.sessionNumber" type="number" min="1" class="blades-input" placeholder="1" />
                </div>
                <div>
                  <label class="blades-label">Tags (comma-separated)</label>
                  <input :value="(draft.tags ?? []).join(', ')" class="blades-input"
                    placeholder="heist, downtime…"
                    @input="(e) => draft.tags = (e.target as HTMLInputElement).value.split(',').map(t => t.trim()).filter(Boolean)" />
                </div>
              </div>

              <div>
                <label class="blades-label">Content</label>
                <textarea
                  v-model="draft.content"
                  class="blades-textarea"
                  rows="10"
                  placeholder="What happened this session? Key decisions, consequences, revelations…"
                />
              </div>

              <!-- Link NPCs -->
              <div>
                <label class="blades-label">Linked NPCs</label>
                <select
                  class="blades-select"
                  @change="addNpcLink($event)"
                >
                  <option value="">— Add NPC —</option>
                  <option v-for="npc in availableNpcs" :key="npc.id" :value="npc.id">{{ npc.name }}</option>
                </select>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span
                    v-for="id in (draft.linkedNpcIds ?? [])"
                    :key="id"
                    class="blades-badge-gold text-xs flex items-center gap-1 cursor-pointer hover:opacity-70"
                    @click="removeNpcLink(id)"
                  >{{ npcName(id) }} ✕</span>
                </div>
              </div>

              <!-- Link Locations -->
              <div>
                <label class="blades-label">Linked Locations</label>
                <select
                  class="blades-select"
                  @change="addLocLink($event)"
                >
                  <option value="">— Add Location —</option>
                  <option v-for="loc in availableLocs" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
                </select>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span
                    v-for="id in (draft.linkedLocationIds ?? [])"
                    :key="id"
                    class="blades-badge-muted text-xs flex items-center gap-1 cursor-pointer hover:opacity-70"
                    @click="removeLocLink(id)"
                  >{{ locName(id) }} ✕</span>
                </div>
              </div>

              <!-- Link Factions -->
              <div>
                <label class="blades-label">Linked Factions</label>
                <select
                  class="blades-select"
                  @change="addFacLink($event)"
                >
                  <option value="">— Add Faction —</option>
                  <option v-for="fac in availableFacs" :key="fac.id" :value="fac.id">{{ fac.name }}</option>
                </select>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span
                    v-for="id in (draft.linkedFactionIds ?? [])"
                    :key="id"
                    class="blades-badge-muted text-xs flex items-center gap-1 cursor-pointer hover:opacity-70"
                    @click="removeFacLink(id)"
                  >{{ facName(id) }} ✕</span>
                </div>
              </div>

              <!-- Public toggle -->
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" class="accent-blades-sage" :checked="draft.isPublic !== false"
                  @change="(e) => draft.isPublic = (e.target as HTMLInputElement).checked ? undefined : false" />
                <span class="text-xs font-mono text-blades-muted">🌐 Public</span>
              </label>
            </div>

            <div class="px-5 pb-4 flex gap-2">
              <button class="blades-btn-gold text-xs" @click="commitEdit">Save</button>
              <button class="blades-btn-ghost text-xs" @click="editingId = null">Cancel</button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useJournalStore } from '@/stores/journal'
import { useCharactersStore } from '@/stores/characters'
import { useLocationsStore } from '@/stores/locations'
import { useFactionsStore } from '@/stores/factions'
import type { JournalEntry } from '@/types/blades'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const journalStore = useJournalStore()
const charStore = useCharactersStore()
const locStore = useLocationsStore()
const facStore = useFactionsStore()

const search = ref('')
const expanded = ref(new Set<string>())
const editingId = ref<string | null>(null)
const draft = ref<Partial<JournalEntry>>({})

const allEntries = computed(() => {
  if (isStatic) return journalStore.entries.filter(e => e.isPublic !== false)
  return journalStore.entries
})

const filteredEntries = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return allEntries.value
  return allEntries.value.filter(e =>
    e.title.toLowerCase().includes(q) ||
    e.content.toLowerCase().includes(q) ||
    e.tags?.some(t => t.toLowerCase().includes(q))
  )
})

const availableNpcs = computed(() => [...charStore.characters.filter(c => c.isNpc)].sort((a, b) => a.name.localeCompare(b.name)))
const availableLocs = computed(() => [...locStore.locations].sort((a, b) => a.name.localeCompare(b.name)))
const availableFacs = computed(() => [...facStore.factions].sort((a, b) => a.name.localeCompare(b.name)))

function toggle(id: string) {
  if (expanded.value.has(id)) {
    expanded.value.delete(id)
    if (editingId.value === id) editingId.value = null
  } else {
    expanded.value.add(id)
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

function linkedNpcs(e: JournalEntry) {
  return (e.linkedNpcIds ?? []).map(id => charStore.get(id)).filter((x): x is NonNullable<typeof x> => !!x)
}
function linkedLocations(e: JournalEntry) {
  return (e.linkedLocationIds ?? []).map(id => locStore.get(id)).filter((x): x is NonNullable<typeof x> => !!x)
}
function linkedFactions(e: JournalEntry) {
  return (e.linkedFactionIds ?? []).map(id => facStore.get(id)).filter((x): x is NonNullable<typeof x> => !!x)
}

function npcName(id: string) { return charStore.get(id)?.name ?? id }
function locName(id: string) { return locStore.get(id)?.name ?? id }
function facName(id: string) { return facStore.get(id)?.name ?? id }

function createEntry() {
  const entry = journalStore.create({ sessionNumber: journalStore.entries.length + 1 })
  expanded.value.add(entry.id)
  startEdit(entry)
}

function startEdit(entry: JournalEntry) {
  draft.value = { ...entry, tags: [...(entry.tags ?? [])], linkedNpcIds: [...(entry.linkedNpcIds ?? [])], linkedLocationIds: [...(entry.linkedLocationIds ?? [])], linkedFactionIds: [...(entry.linkedFactionIds ?? [])] }
  editingId.value = entry.id
}

function commitEdit() {
  if (!editingId.value) return
  journalStore.update(editingId.value, draft.value)
  editingId.value = null
}

function deleteEntry(id: string) {
  if (!confirm('Delete this journal entry?')) return
  journalStore.remove(id)
  expanded.value.delete(id)
}

function addNpcLink(e: Event) {
  const id = (e.target as HTMLSelectElement).value
  if (!id) return
  if (!draft.value.linkedNpcIds) draft.value.linkedNpcIds = []
  if (!draft.value.linkedNpcIds.includes(id)) draft.value.linkedNpcIds.push(id)
  ;(e.target as HTMLSelectElement).value = ''
}
function removeNpcLink(id: string) {
  draft.value.linkedNpcIds = (draft.value.linkedNpcIds ?? []).filter(x => x !== id)
}

function addLocLink(e: Event) {
  const id = (e.target as HTMLSelectElement).value
  if (!id) return
  if (!draft.value.linkedLocationIds) draft.value.linkedLocationIds = []
  if (!draft.value.linkedLocationIds.includes(id)) draft.value.linkedLocationIds.push(id)
  ;(e.target as HTMLSelectElement).value = ''
}
function removeLocLink(id: string) {
  draft.value.linkedLocationIds = (draft.value.linkedLocationIds ?? []).filter(x => x !== id)
}

function addFacLink(e: Event) {
  const id = (e.target as HTMLSelectElement).value
  if (!id) return
  if (!draft.value.linkedFactionIds) draft.value.linkedFactionIds = []
  if (!draft.value.linkedFactionIds.includes(id)) draft.value.linkedFactionIds.push(id)
  ;(e.target as HTMLSelectElement).value = ''
}
function removeFacLink(id: string) {
  draft.value.linkedFactionIds = (draft.value.linkedFactionIds ?? []).filter(x => x !== id)
}
</script>

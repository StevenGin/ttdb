<!-- NPC detail drawer — information only, no stats -->
<template>
  <Drawer :open="open" @close="$emit('close')">
    <template #header>
      <div class="flex-1 min-w-0">
        <template v-if="npc">
          <div v-if="!editing" class="flex items-center gap-2 flex-wrap">
            <span class="font-serif text-xl text-blades-text glow-amber">{{ npc.name }}</span>
            <span v-if="npc.alias" class="text-blades-muted font-mono text-sm">"{{ npc.alias }}"</span>
          </div>
          <div v-else class="text-blades-muted font-mono text-xs">Editing NPC</div>
        </template>
      </div>
    </template>

    <template v-if="npc">
      <!-- Banner -->
      <BannerImage
        :model-value="npc.bannerImage"
        :subject="npc.name + (npc.role ? ', ' + npc.role : '') + ' in Aurelion'"
        :description="npc.description || npc.notes"
        :square="true"
        @update:model-value="save({ bannerImage: $event })"
      />

      <div class="p-5 space-y-5">
        <!-- View mode -->
        <template v-if="!editing">
          <!-- Role badge + faction -->
          <div class="flex flex-wrap gap-2 items-center">
            <span v-if="npc.role" class="blades-badge-gold text-xs">{{ npc.role }}</span>
            <span v-if="factionName" class="blades-badge-muted text-xs">⚑ {{ factionName }}</span>
            <span v-if="locationName" class="blades-badge-muted text-xs">◬ {{ locationName }}</span>
          </div>

          <!-- Description -->
          <div v-if="npc.description || npc.looks">
            <div class="blades-label">Description</div>
            <p class="text-blades-text font-sans text-sm leading-relaxed whitespace-pre-wrap">
              {{ npc.description || npc.looks }}
            </p>
          </div>

          <!-- Notes -->
          <div v-if="npc.notes">
            <div class="blades-label">Notes</div>
            <p class="text-blades-muted font-mono text-xs leading-relaxed whitespace-pre-wrap">{{ npc.notes }}</p>
          </div>

          <div v-if="!npc.description && !npc.looks && !npc.notes && !npc.role"
               class="text-blades-muted font-mono text-xs text-center py-8 opacity-60">
            No details yet. Click Edit to add information.
          </div>
        </template>

        <!-- Edit mode -->
        <template v-else>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div class="col-span-2">
                <label class="blades-label">Name</label>
                <input v-model="draft.name" class="blades-input" placeholder="Character name" />
              </div>
              <div>
                <label class="blades-label">Alias / Handle</label>
                <input v-model="draft.alias" class="blades-input" placeholder='"Street name"' />
              </div>
              <div>
                <label class="blades-label">Role / Title</label>
                <input v-model="draft.role" class="blades-input" placeholder="e.g. Faction Head" />
              </div>
            </div>

            <div>
              <label class="blades-label">Faction</label>
              <select v-model="draft.factionId" class="blades-select">
                <option value="">— None —</option>
                <option v-for="f in factions" :key="f.id" :value="f.id">{{ f.name }}</option>
              </select>
            </div>

            <div>
              <label class="blades-label">Location</label>
              <select v-model="draft.locationId" class="blades-select">
                <option value="">— None —</option>
                <option v-for="l in locations" :key="l.id" :value="l.id">{{ locationLabel(l) }}</option>
              </select>
            </div>

            <div>
              <label class="blades-label">Description</label>
              <textarea v-model="draft.description" class="blades-textarea" rows="4"
                placeholder="Who is this person? What do they look like? What's their deal?" />
            </div>

            <div>
              <label class="blades-label">GM Notes</label>
              <textarea v-model="draft.notes" class="blades-textarea" rows="3"
                placeholder="Secrets, hooks, relationships..." />
            </div>
          </div>
        </template>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between gap-3" v-if="npc">
        <div class="flex gap-2">
          <template v-if="editing">
            <button class="blades-btn-gold text-xs" @click="commitEdit">Save</button>
            <button class="blades-btn-ghost text-xs" @click="editing = false">Cancel</button>
          </template>
          <button v-else class="blades-btn-outline text-xs" @click="startEdit">Edit</button>
        </div>
        <button class="blades-btn-danger text-xs" @click="deleteNpc">Delete NPC</button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Drawer from './Drawer.vue'
import BannerImage from './BannerImage.vue'
import { useCharactersStore } from '@/stores/characters'
import { useFactionsStore } from '@/stores/factions'
import { useLocationsStore } from '@/stores/locations'
import type { Character, Location } from '@/types/blades'

const props = defineProps<{
  open: boolean
  npcId: string | null
}>()

const emit = defineEmits<{
  close: []
  deleted: []
}>()

const charStore = useCharactersStore()
const facStore = useFactionsStore()
const locStore = useLocationsStore()

const npc = computed(() => (props.npcId ? charStore.get(props.npcId) ?? null : null))
const factions = computed(() => [...facStore.factions].sort((a, b) => a.name.localeCompare(b.name)))
const locations = computed(() => [...locStore.locations].sort((a, b) => a.name.localeCompare(b.name)))

const factionName = computed(() => {
  const id = npc.value?.factionId
  return id ? (facStore.get(id)?.name ?? '') : ''
})
const locationName = computed(() => {
  const id = npc.value?.locationId
  return id ? (locStore.get(id)?.name ?? '') : ''
})

function locationLabel(l: Location) {
  const parent = l.parentId ? locStore.get(l.parentId) : null
  return parent ? `${parent.name} › ${l.name}` : l.name
}

function save(changes: Partial<Character>) {
  if (!npc.value) return
  charStore.update(npc.value.id, changes)
}

const editing = ref(false)
const draft = ref<Partial<Character>>({})

function startEdit() {
  if (!npc.value) return
  draft.value = { ...npc.value }
  editing.value = true
}

function commitEdit() {
  if (!npc.value) return
  charStore.update(npc.value.id, draft.value)
  editing.value = false
}

function deleteNpc() {
  if (!npc.value) return
  if (confirm(`Delete "${npc.value.name}"?`)) {
    charStore.remove(npc.value.id)
    emit('deleted')
    emit('close')
  }
}
</script>

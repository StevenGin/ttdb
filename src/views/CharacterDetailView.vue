<template>
  <div class="max-w-5xl" v-if="ch">
    <!-- Banner -->
    <BannerImage
      :model-value="ch.bannerImage"
      :subject="ch.name"
      :description="ch.looks || ch.notes"
      :height="200"
      @update:model-value="store.update(ch.id, { bannerImage: $event })"
    />

    <div class="p-6">
    <RouterLink
      :to="ch.isNpc ? '/npcs' : '/characters'"
      class="text-blades-muted hover:text-blades-gold font-mono text-sm mb-6 inline-block"
    >← Back to {{ ch.isNpc ? 'NPCs' : 'Characters' }}</RouterLink>

    <!-- Header -->
    <div class="blades-card p-5 mb-5">
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div class="flex-1">
          <template v-if="editing">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label class="blades-label">Name</label>
                <input v-model="d.name" class="blades-input text-lg" placeholder="Full name" />
              </div>
              <div>
                <label class="blades-label">Alias / Handle</label>
                <input v-model="d.alias" class="blades-input" placeholder="Street name" />
              </div>
              <div>
                <label class="blades-label">Playbook</label>
                <select v-model="d.playbookId" class="blades-select">
                  <option value="">— Select —</option>
                  <option v-for="pb in PLAYBOOKS" :key="pb.id" :value="pb.id">{{ pb.name }}</option>
                </select>
              </div>
              <div>
                <label class="blades-label">Heritage</label>
                <input v-model="d.heritage" class="blades-input" placeholder="e.g. Akoros, Severos, Iruvia..." />
              </div>
              <div>
                <label class="blades-label">Background</label>
                <input v-model="d.background" class="blades-input" placeholder="e.g. Academic, Criminal, Laborer..." />
              </div>
              <div>
                <label class="blades-label">Vice</label>
                <input v-model="d.vice" class="blades-input" placeholder="e.g. Gambling, Pleasure, Stupor..." />
              </div>
              <div class="sm:col-span-2">
                <label class="blades-label">Vice Purveyor / Source</label>
                <input v-model="d.viceSource" class="blades-input" placeholder="Where / who you get it from" />
              </div>
              <div class="sm:col-span-2">
                <label class="blades-label">Looks / Description</label>
                <input v-model="d.looks" class="blades-input" placeholder="Appearance notes" />
              </div>
            </div>
            <div class="flex gap-2">
              <button class="blades-btn-gold text-xs" @click="save">Save</button>
              <button class="blades-btn-ghost text-xs" @click="editing = false">Cancel</button>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center gap-3 flex-wrap mb-1">
              <h1 class="text-3xl font-serif text-blades-text glow-gold">{{ ch.name }}</h1>
              <span v-if="ch.alias" class="text-blades-muted font-mono text-sm">"{{ ch.alias }}"</span>
            </div>
            <div class="flex flex-wrap gap-2 mb-2">
              <span class="blades-badge-gold">{{ playbookName }}</span>
              <span v-if="ch.heritage" class="blades-badge-muted">{{ ch.heritage }}</span>
              <span v-if="ch.background" class="blades-badge-muted">{{ ch.background }}</span>
            </div>
            <div v-if="ch.looks" class="text-blades-muted font-mono text-sm italic">{{ ch.looks }}</div>
            <div v-if="ch.vice" class="text-blades-muted font-mono text-xs mt-1">
              Vice: <span class="text-blades-text">{{ ch.vice }}</span>
              <span v-if="ch.viceSource"> — {{ ch.viceSource }}</span>
            </div>
          </template>
        </div>
        <div class="flex items-start gap-2">
          <button v-if="!isStatic && !editing" class="blades-btn-outline text-xs" @click="startEdit">Edit</button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Left column: stress, harm, coin -->
      <div class="space-y-5">
        <!-- Stress -->
        <div class="blades-card p-4">
          <h2 class="text-base mb-3">Stress</h2>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="i in ch.maxStress"
              :key="i"
              class="stress-box"
              :class="{ filled: i <= ch.stress }"
              :disabled="isStatic"
              @click="!isStatic && setStress(i)"
            />
          </div>
          <div class="text-xs font-mono text-blades-muted mt-2">{{ ch.stress }} / {{ ch.maxStress }}</div>
        </div>

        <!-- Harm -->
        <div class="blades-card p-4">
          <h2 class="text-base mb-3">Harm</h2>
          <div class="space-y-2">
            <div>
              <div class="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-1">Level 3 — Fatal</div>
              <div class="flex gap-2">
                <div v-for="slot in level3Harms" :key="slot.idx" class="flex-1">
                  <input
                    v-if="!isStatic"
                    :value="slot.desc"
                    @blur="setHarm(3, slot.idx, ($event.target as HTMLInputElement).value)"
                    class="blades-input text-xs py-1 border-red-900 focus:border-red-500"
                    placeholder="—"
                  />
                  <div v-else class="blades-input text-xs py-1 text-blades-muted">{{ slot.desc || '—' }}</div>
                </div>
              </div>
            </div>
            <div>
              <div class="text-[10px] font-mono text-orange-400 uppercase tracking-widest mb-1">Level 2 — Serious</div>
              <div class="flex gap-2">
                <div v-for="slot in level2Harms" :key="slot.idx" class="flex-1">
                  <input
                    v-if="!isStatic"
                    :value="slot.desc"
                    @blur="setHarm(2, slot.idx, ($event.target as HTMLInputElement).value)"
                    class="blades-input text-xs py-1 border-orange-900 focus:border-orange-500"
                    placeholder="—"
                  />
                  <div v-else class="blades-input text-xs py-1 text-blades-muted">{{ slot.desc || '—' }}</div>
                </div>
              </div>
            </div>
            <div>
              <div class="text-[10px] font-mono text-yellow-400 uppercase tracking-widest mb-1">Level 1 — Lesser</div>
              <div class="flex gap-2">
                <div v-for="slot in level1Harms" :key="slot.idx" class="flex-1">
                  <input
                    v-if="!isStatic"
                    :value="slot.desc"
                    @blur="setHarm(1, slot.idx, ($event.target as HTMLInputElement).value)"
                    class="blades-input text-xs py-1 border-yellow-900 focus:border-yellow-600"
                    placeholder="—"
                  />
                  <div v-else class="blades-input text-xs py-1 text-blades-muted">{{ slot.desc || '—' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Coin & Stash -->
        <div class="blades-card p-4">
          <h2 class="text-base mb-3">Coin & Stash</h2>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="blades-label">Coin</label>
              <div class="flex items-center gap-1">
                <button v-if="!isStatic" class="blades-btn-ghost text-xs px-2 py-0.5" @click="adj('coin', -1)">−</button>
                <span class="text-blades-gold font-serif font-bold text-lg mx-2">{{ ch.coin }}</span>
                <button v-if="!isStatic" class="blades-btn-ghost text-xs px-2 py-0.5" @click="adj('coin', 1)">+</button>
              </div>
            </div>
            <div>
              <label class="blades-label">Stash</label>
              <div class="flex items-center gap-1">
                <button v-if="!isStatic" class="blades-btn-ghost text-xs px-2 py-0.5" @click="adj('stash', -1)">−</button>
                <span class="text-blades-gold font-serif font-bold text-lg mx-2">{{ ch.stash }}</span>
                <button v-if="!isStatic" class="blades-btn-ghost text-xs px-2 py-0.5" @click="adj('stash', 1)">+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Trauma -->
        <div class="blades-card p-4">
          <h2 class="text-base mb-3">Trauma</h2>
          <div class="flex flex-wrap gap-1.5 mb-2">
            <button
              v-for="t in TRAUMA_LIST"
              :key="t"
              class="blades-badge text-xs cursor-pointer transition-all"
              :class="ch.trauma.includes(t)
                ? 'text-blades-red-light border-blades-red bg-blades-red/20'
                : 'text-blades-muted border-blades-border hover:border-blades-border-light'"
              :disabled="isStatic"
              @click="!isStatic && toggleTrauma(t)"
            >{{ t }}</button>
          </div>
          <div class="text-[10px] font-mono text-blades-muted">{{ ch.trauma.length }} / 4 trauma</div>
        </div>
      </div>

      <!-- Middle column: actions -->
      <div class="space-y-5">
        <div class="blades-card p-4" v-for="attr in ATTRIBUTES" :key="attr.name">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base text-blades-gold">{{ attr.label }}</h2>
            <div class="flex gap-0.5">
              <div
                v-for="dot in 3"
                :key="dot"
                class="w-3 h-3 rounded-full border border-blades-border"
                :class="dot <= attrRating(attr.actions) ? 'bg-blades-gold border-blades-gold' : ''"
              />
            </div>
          </div>
          <div class="space-y-2.5">
            <div v-for="action in attr.actions" :key="action" class="flex items-center gap-2">
              <div class="flex gap-0.5">
                <button
                  v-for="dot in 4"
                  :key="dot"
                  class="w-4 h-4 rounded-full border transition-colors"
                  :class="dot <= (ch.actions[action] ?? 0)
                    ? 'bg-blades-gold border-blades-gold'
                    : 'border-blades-border hover:border-blades-border-light'"
                  :disabled="isStatic"
                  @click="!isStatic && setAction(action, dot)"
                />
              </div>
              <span class="text-sm font-sans text-blades-text capitalize w-16">{{ action }}</span>
            </div>
          </div>
          <!-- XP -->
          <div class="mt-3 pt-3 border-t border-blades-border/50">
            <div class="flex items-center gap-2">
              <div class="text-[10px] font-mono text-blades-muted uppercase tracking-widest">XP</div>
              <div class="flex gap-0.5">
                <button
                  v-for="i in 6"
                  :key="i"
                  class="xp-dot"
                  :class="{ filled: i <= (ch as any)[attr.xpKey] }"
                  :disabled="isStatic"
                  @click="!isStatic && toggleXp(attr.xpKey, i)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Playbook XP -->
        <div class="blades-card p-4">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-base">Playbook XP</h2>
          </div>
          <div class="flex gap-0.5 flex-wrap">
            <button
              v-for="i in 8"
              :key="i"
              class="xp-dot"
              :class="{ filled: i <= ch.playbookXp }"
              :disabled="isStatic"
              @click="!isStatic && toggleXp('playbookXp', i)"
            />
          </div>
          <div v-if="playbook?.xp_trigger" class="text-blades-muted font-mono text-xs mt-2 italic">{{ playbook.xp_trigger }}</div>
        </div>
      </div>

      <!-- Right column: abilities, items, notes -->
      <div class="space-y-5">
        <!-- Special Abilities -->
        <div class="blades-card p-4">
          <h2 class="text-base mb-3">Special Abilities</h2>
          <div v-if="!playbook" class="text-blades-muted font-mono text-xs">Select a playbook first.</div>
          <div v-else class="space-y-1.5">
            <div
              v-for="ability in playbook.special_abilities"
              :key="ability.name"
              class="flex items-start gap-2 cursor-pointer group"
              :class="isStatic ? '' : 'cursor-pointer'"
              @click="!isStatic && toggleAbility(ability.name)"
            >
              <div
                class="w-4 h-4 mt-0.5 flex-shrink-0 rounded-full border transition-colors"
                :class="ch.specialAbilities.includes(ability.name)
                  ? 'bg-blades-gold border-blades-gold'
                  : 'border-blades-border group-hover:border-blades-border-light'"
              />
              <div>
                <div class="text-sm font-serif" :class="ch.specialAbilities.includes(ability.name) ? 'text-blades-gold' : 'text-blades-text'">
                  {{ ability.name }}
                </div>
                <div class="text-[11px] font-mono text-blades-muted leading-snug">{{ ability.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load & Items -->
        <div class="blades-card p-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base">Items & Load</h2>
            <span class="text-xs font-mono text-blades-muted">{{ totalLoad }} load</span>
          </div>

          <!-- Playbook starting items -->
          <div v-if="playbook" class="space-y-1.5 mb-3">
            <div
              v-for="item in playbook.items"
              :key="item.name"
              class="flex items-center gap-2 cursor-pointer group"
              @click="!isStatic && togglePlaybookItem(item.name)"
            >
              <div
                class="w-4 h-4 flex-shrink-0 rounded-sm border transition-colors"
                :class="equippedPlaybookItems.includes(item.name)
                  ? 'bg-blades-gold border-blades-gold'
                  : 'border-blades-border group-hover:border-blades-border-light'"
              />
              <span class="text-sm font-sans flex-1" :class="equippedPlaybookItems.includes(item.name) ? 'text-blades-text' : 'text-blades-muted'">
                {{ item.name }}
              </span>
              <span class="text-xs font-mono text-blades-muted">{{ item.load }}L</span>
            </div>
          </div>

          <!-- Custom items -->
          <div class="space-y-1.5">
            <div
              v-for="item in ch.items.filter(i => !i.itemId)"
              :key="item.id"
              class="flex items-center gap-2"
            >
              <div
                class="w-4 h-4 flex-shrink-0 rounded-sm border cursor-pointer transition-colors"
                :class="item.equipped ? 'bg-blades-gold border-blades-gold' : 'border-blades-border'"
                @click="!isStatic && toggleCustomItem(item.id)"
              />
              <span class="text-sm font-sans flex-1 text-blades-text">{{ item.name }}</span>
              <span class="text-xs font-mono text-blades-muted">{{ item.load }}L</span>
              <button v-if="!isStatic" class="text-blades-muted hover:text-blades-red-light text-xs" @click="removeCustomItem(item.id)">✕</button>
            </div>
          </div>

          <!-- Add custom item -->
          <div v-if="!isStatic" class="mt-3 pt-3 border-t border-blades-border/50">
            <div v-if="addingItem" class="space-y-2">
              <!-- Pick from items store -->
              <div v-if="availableItems.length > 0">
                <label class="blades-label">From Item Database</label>
                <div class="space-y-1 max-h-40 overflow-y-auto pr-1">
                  <button
                    v-for="item in availableItems"
                    :key="item.id"
                    class="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-sans text-left
                           border border-blades-border rounded-sm hover:border-blades-gold/50
                           hover:bg-blades-gold/5 transition-colors"
                    @click="addFromDatabase(item.id)"
                  >
                    <span class="flex-1 text-blades-text">{{ item.name }}</span>
                    <span class="text-blades-muted font-mono">{{ item.load }}L</span>
                    <span v-if="item.tags?.length" class="text-blades-muted/60 font-mono text-[10px]">
                      {{ item.tags.slice(0,2).join(', ') }}
                    </span>
                  </button>
                </div>
                <div class="text-blades-muted font-mono text-[10px] my-2 text-center">— or add custom —</div>
              </div>
              <!-- Custom item form -->
              <div class="flex gap-2 items-end flex-wrap">
                <div class="flex-1 min-w-[120px]">
                  <label class="blades-label">Custom Item</label>
                  <input v-model="newItemName" class="blades-input text-xs" placeholder="Item name" />
                </div>
                <div class="w-14">
                  <label class="blades-label">Load</label>
                  <input v-model.number="newItemLoad" type="number" min="0" max="3" class="blades-input text-xs" />
                </div>
                <button class="blades-btn-gold text-xs py-1" @click="addItem">Add</button>
                <button class="blades-btn-ghost text-xs py-1" @click="addingItem = false">✕</button>
              </div>
            </div>
            <button v-else class="text-blades-muted hover:text-blades-gold font-mono text-xs" @click="addingItem = true">+ Add item</button>
          </div>
        </div>

        <!-- Notes -->
        <div class="blades-card p-4">
          <h2 class="text-base mb-3">Notes</h2>
          <template v-if="!isStatic">
            <textarea
              :value="ch.notes"
              @input="store.update(ch.id, { notes: ($event.target as HTMLTextAreaElement).value })"
              class="blades-textarea w-full text-sm"
              rows="5"
              placeholder="Notes, contacts, ongoing jobs..."
            />
          </template>
          <p v-else class="text-blades-text/70 font-mono text-sm whitespace-pre-wrap">{{ ch.notes || 'No notes.' }}</p>
        </div>

        <!-- Delete -->
        <div v-if="!isStatic" class="flex justify-end">
          <button class="blades-btn-danger text-xs" @click="deleteChar">Delete Character</button>
        </div>
      </div>
    </div>
    </div><!-- /p-6 -->
  </div>
  <div v-else class="p-6 text-blades-muted font-mono">Character not found.</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useCharactersStore } from '@/stores/characters'
import { useItemsStore } from '@/stores/items'
import { PLAYBOOKS } from '@/data/playbooks'
import type { Character, ActionName, HarmLevel } from '@/types/blades'
import { ACTION_GROUPS } from '@/types/blades'
import BannerImage from '@/components/BannerImage.vue'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const route = useRoute()
const router = useRouter()
const store = useCharactersStore()
const itemsStore = useItemsStore()

const ch = computed(() => store.get(route.params.id as string))
const playbook = computed(() => PLAYBOOKS.find(p => p.id === ch.value?.playbookId))
const playbookName = computed(() => playbook.value?.name ?? 'No Playbook')

// ── Editing ────────────────────────────────────────────────────────────────
const editing = ref(false)
const d = ref<Partial<Character>>({})

function startEdit() {
  d.value = { ...ch.value }
  editing.value = true
}
function save() {
  store.update(ch.value!.id, d.value)
  editing.value = false
}

// ── Stress ────────────────────────────────────────────────────────────────
function setStress(i: number) {
  const current = ch.value!.stress
  store.update(ch.value!.id, { stress: current === i ? i - 1 : i })
}

// ── Harm ─────────────────────────────────────────────────────────────────
function harmSlots(level: HarmLevel, count: number) {
  const harms = ch.value!.harms.filter(h => h.level === level)
  return Array.from({ length: count }, (_, i) => ({ idx: i, desc: harms[i]?.description ?? '' }))
}
const level3Harms = computed(() => harmSlots(3, 1))
const level2Harms = computed(() => harmSlots(2, 2))
const level1Harms = computed(() => harmSlots(1, 2))

function setHarm(level: HarmLevel, slotIdx: number, desc: string) {
  const harms = ch.value!.harms.filter(h => h.level !== level)
  const existing = ch.value!.harms.filter(h => h.level === level)
  existing[slotIdx] = { level, description: desc }
  store.update(ch.value!.id, { harms: [...harms, ...existing.filter(h => h.description)] })
}

// ── Coin / Stash ──────────────────────────────────────────────────────────
function adj(field: 'coin' | 'stash', delta: number) {
  const v = Math.max(0, (ch.value![field] ?? 0) + delta)
  store.update(ch.value!.id, { [field]: v })
}

// ── Trauma ────────────────────────────────────────────────────────────────
const TRAUMA_LIST = ['Cold', 'Haunted', 'Obsessed', 'Paranoid', 'Reckless', 'Soft', 'Unstable', 'Vicious']

function toggleTrauma(t: string) {
  const trauma = ch.value!.trauma.includes(t)
    ? ch.value!.trauma.filter(x => x !== t)
    : [...ch.value!.trauma, t]
  store.update(ch.value!.id, { trauma })
}

// ── Actions ───────────────────────────────────────────────────────────────
const ATTRIBUTES = [
  { name: 'insight',  label: 'Insight',  actions: ACTION_GROUPS.insight,  xpKey: 'insightXp' },
  { name: 'prowess',  label: 'Prowess',  actions: ACTION_GROUPS.prowess,  xpKey: 'prowessXp' },
  { name: 'resolve',  label: 'Resolve',  actions: ACTION_GROUPS.resolve,  xpKey: 'resolveXp' },
] as const

function attrRating(actions: readonly ActionName[]) {
  return Math.max(...actions.map(a => ch.value!.actions[a] ?? 0))
}

function setAction(action: ActionName, dot: number) {
  const current = ch.value!.actions[action] ?? 0
  store.update(ch.value!.id, {
    actions: { ...ch.value!.actions, [action]: current === dot ? dot - 1 : dot }
  })
}

// ── XP ────────────────────────────────────────────────────────────────────
function toggleXp(key: string, i: number) {
  const current = (ch.value as any)[key] ?? 0
  store.update(ch.value!.id, { [key]: current === i ? i - 1 : i })
}

// ── Abilities ─────────────────────────────────────────────────────────────
function toggleAbility(name: string) {
  const abilities = ch.value!.specialAbilities.includes(name)
    ? ch.value!.specialAbilities.filter(a => a !== name)
    : [...ch.value!.specialAbilities, name]
  store.update(ch.value!.id, { specialAbilities: abilities })
}

// ── Items ─────────────────────────────────────────────────────────────────
// Items from the global catalog not already held by this character
const availableItems = computed(() => {
  const heldIds = new Set(ch.value!.items.map(i => i.itemId).filter(Boolean))
  return itemsStore.items.filter(i => !heldIds.has(i.id))
})

function addFromDatabase(itemId: string) {
  const item = itemsStore.get(itemId)
  if (!item) return
  store.update(ch.value!.id, {
    items: [...ch.value!.items, {
      id: Math.random().toString(36).slice(2, 8),
      name: item.name,
      load: item.load,
      equipped: true,
      itemId: item.id,
    }]
  })
  addingItem.value = false
}

const equippedPlaybookItems = computed(() =>
  ch.value!.items.filter(i => i.equipped && i.itemId === 'playbook').map(i => i.name)
)

const totalLoad = computed(() => {
  const playbookLoad = (playbook.value?.items ?? [])
    .filter(item => equippedPlaybookItems.value.includes(item.name))
    .reduce((s, i) => s + i.load, 0)
  const customLoad = ch.value!.items
    .filter(i => i.equipped && i.itemId !== 'playbook')
    .reduce((s, i) => s + i.load, 0)
  return playbookLoad + customLoad
})

function togglePlaybookItem(name: string) {
  const existing = ch.value!.items.find(i => i.itemId === 'playbook' && i.name === name)
  if (existing) {
    store.update(ch.value!.id, {
      items: ch.value!.items.map(i =>
        i.id === existing.id ? { ...i, equipped: !i.equipped } : i
      )
    })
  } else {
    const playbookItem = playbook.value?.items.find(i => i.name === name)
    store.update(ch.value!.id, {
      items: [...ch.value!.items, {
        id: Math.random().toString(36).slice(2, 8),
        name,
        load: playbookItem?.load ?? 1,
        equipped: true,
        itemId: 'playbook',
      }]
    })
  }
}

const addingItem = ref(false)
const newItemName = ref('')
const newItemLoad = ref(1)

function addItem() {
  if (!newItemName.value.trim()) return
  store.update(ch.value!.id, {
    items: [...ch.value!.items, {
      id: Math.random().toString(36).slice(2, 8),
      name: newItemName.value,
      load: newItemLoad.value,
      equipped: true,
    }]
  })
  addingItem.value = false
  newItemName.value = ''
  newItemLoad.value = 1
}

function toggleCustomItem(id: string) {
  store.update(ch.value!.id, {
    items: ch.value!.items.map(i => i.id === id ? { ...i, equipped: !i.equipped } : i)
  })
}

function removeCustomItem(id: string) {
  store.update(ch.value!.id, {
    items: ch.value!.items.filter(i => i.id !== id)
  })
}

// ── Delete ────────────────────────────────────────────────────────────────
function deleteChar() {
  if (confirm('Delete this character permanently?')) {
    store.remove(ch.value!.id)
    router.push('/characters')
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl">
    <!-- No crew yet -->
    <div v-if="!crew" class="text-center py-24">
      <div class="text-5xl mb-4 opacity-10 font-serif">⚓</div>
      <h1 class="text-2xl text-blades-text mb-3">No Crew Yet</h1>
      <p class="text-blades-muted font-mono text-sm mb-6">Set up your crew to track tier, rep, heat, upgrades, and clocks.</p>
      <button v-if="!isStatic" class="blades-btn-gold" @click="createCrew">Found a Crew</button>
    </div>

    <template v-else>
      <!-- Banner -->
      <BannerImage
        :model-value="crew.bannerImage"
        :subject="crew.name + ' crew in Aurelion'"
        :description="crew.notes"
        :height="180"
        @update:model-value="crewStore.update({ bannerImage: $event })"
      />

      <!-- Header -->
      <div class="blades-card p-5 mb-5">
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div class="flex-1">
            <template v-if="editing">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label class="blades-label">Crew Name</label>
                  <input v-model="d.name" class="blades-input text-lg" />
                </div>
                <div>
                  <label class="blades-label">Crew Type</label>
                  <select v-model="d.crewTypeId" class="blades-select">
                    <option value="">— Select type —</option>
                    <option v-for="ct in CREW_TYPES" :key="ct.id" :value="ct.id">{{ ct.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="blades-label">Reputation</label>
                  <input v-model="d.reputation" class="blades-input" placeholder="e.g. Audacious, Honorable..." />
                </div>
                <div>
                  <label class="blades-label">Lair Location</label>
                  <select v-model="d.lair" class="blades-select">
                    <option value="">— None —</option>
                    <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="blades-label">Description / Notes</label>
                  <textarea v-model="d.notes" class="blades-textarea" rows="2" />
                </div>
              </div>
              <div class="flex gap-2">
                <button class="blades-btn-gold text-xs" @click="save">Save</button>
                <button class="blades-btn-ghost text-xs" @click="editing = false">Cancel</button>
              </div>
            </template>
            <template v-else>
              <h1 class="text-3xl font-serif text-blades-text glow-gold mb-1">{{ crew.name }}</h1>
              <div class="flex flex-wrap gap-2 mb-2">
                <span v-if="crewType" class="blades-badge-gold">{{ crewType.name }}</span>
                <span v-if="crew.reputation" class="blades-badge-muted">{{ crew.reputation }}</span>
                <span v-if="lairName" class="blades-badge-spark text-xs">Lair: {{ lairName }}</span>
              </div>
              <p v-if="crew.notes" class="text-blades-muted font-mono text-sm">{{ crew.notes }}</p>
            </template>
          </div>
          <button v-if="!isStatic && !editing" class="blades-btn-outline text-xs" @click="startEdit">Edit</button>
        </div>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <!-- Tier -->
        <div class="blades-card p-3 text-center">
          <div class="text-blades-muted font-mono text-[10px] uppercase tracking-widest mb-1">Tier</div>
          <div class="flex justify-center gap-0.5 mb-1">
            <button
              v-for="t in 5"
              :key="t"
              class="w-4 h-4 rounded-full border border-blades-border transition-colors"
              :class="t <= crew.tier ? 'bg-blades-gold border-blades-gold' : 'hover:border-blades-border-light'"
              :disabled="isStatic"
              @click="!isStatic && setTier(t)"
            />
          </div>
          <div class="text-blades-gold font-serif font-bold text-xl">{{ crew.tier }}</div>
          <button
            v-if="!isStatic"
            class="text-[10px] font-mono mt-1 px-2 py-0.5 border rounded-sm transition-colors"
            :class="crew.hold === 'strong'
              ? 'text-blades-gold border-blades-gold-dim hover:bg-blades-gold/10'
              : 'text-blades-muted border-blades-border hover:border-blades-border-light'"
            @click="toggleHold"
          >{{ crew.hold }}</button>
          <div v-else class="text-blades-muted font-mono text-xs mt-1">{{ crew.hold }}</div>
        </div>

        <!-- Rep -->
        <div class="blades-card p-3 text-center">
          <div class="text-blades-muted font-mono text-[10px] uppercase tracking-widest mb-1">Rep</div>
          <div class="flex flex-wrap justify-center gap-0.5 mb-1">
            <button
              v-for="i in 12"
              :key="i"
              class="w-3 h-3 rounded-full border border-blades-border transition-colors"
              :class="i <= crew.rep ? 'bg-blades-gold border-blades-gold' : 'hover:border-blades-border-light'"
              :disabled="isStatic"
              @click="!isStatic && crewStore.update({ rep: crew.rep === i ? i - 1 : i })"
            />
          </div>
          <div class="text-blades-gold font-serif font-bold text-xl">{{ crew.rep }}</div>
          <div class="text-blades-muted font-mono text-[10px]">/ 12</div>
        </div>

        <!-- Heat -->
        <div class="blades-card p-3 text-center">
          <div class="text-blades-muted font-mono text-[10px] uppercase tracking-widest mb-1">Heat</div>
          <div class="flex flex-wrap justify-center gap-0.5 mb-1">
            <button
              v-for="i in 9"
              :key="i"
              class="w-3 h-3 rounded-sm border border-blades-border transition-colors"
              :class="i <= crew.heat ? 'bg-blades-red border-blades-red' : 'hover:border-blades-border-light'"
              :disabled="isStatic"
              @click="!isStatic && crewStore.update({ heat: crew.heat === i ? i - 1 : i })"
            />
          </div>
          <div class="text-blades-red-light font-serif font-bold text-xl">{{ crew.heat }}</div>
        </div>

        <!-- Wanted & Coin -->
        <div class="blades-card p-3 text-center space-y-3">
          <div>
            <div class="text-blades-muted font-mono text-[10px] uppercase tracking-widest mb-1">Wanted</div>
            <div class="flex justify-center gap-0.5">
              <button
                v-for="i in 4"
                :key="i"
                class="w-4 h-4 rounded-full border border-blades-border transition-colors"
                :class="i <= crew.wantedLevel ? 'bg-blades-red-light border-blades-red' : 'hover:border-blades-border-light'"
                :disabled="isStatic"
                @click="!isStatic && crewStore.update({ wantedLevel: crew.wantedLevel === i ? i - 1 : i })"
              />
            </div>
            <div class="text-blades-red-light font-serif font-bold text-lg mt-1">{{ crew.wantedLevel }}</div>
          </div>
          <div class="border-t border-blades-border/50 pt-2">
            <div class="text-blades-muted font-mono text-[10px] uppercase tracking-widest mb-1">Coin</div>
            <div class="flex items-center justify-center gap-1">
              <button v-if="!isStatic" class="blades-btn-ghost text-xs px-1.5 py-0" @click="crewStore.update({ coin: Math.max(0, crew.coin - 1) })">−</button>
              <span class="text-blades-gold font-serif font-bold text-lg">{{ crew.coin }}</span>
              <button v-if="!isStatic" class="blades-btn-ghost text-xs px-1.5 py-0" @click="crewStore.update({ coin: crew.coin + 1 })">+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Crew type info + Upgrades / Clocks -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Upgrades -->
        <div class="blades-card p-4">
          <h2 class="text-base mb-3">Upgrades</h2>
          <div v-if="!crewType" class="text-blades-muted font-mono text-xs">Select a crew type to see upgrades.</div>
          <div v-else class="space-y-1.5">
            <div
              v-for="upgrade in crewType.upgrades"
              :key="upgrade.name"
              class="flex items-start gap-2 cursor-pointer group"
              @click="!isStatic && toggleUpgrade(upgrade.name)"
            >
              <div
                class="w-4 h-4 mt-0.5 flex-shrink-0 rounded-sm border transition-colors"
                :class="hasUpgrade(upgrade.name)
                  ? 'bg-blades-gold border-blades-gold'
                  : 'border-blades-border group-hover:border-blades-border-light'"
              />
              <div>
                <div class="text-sm font-sans" :class="hasUpgrade(upgrade.name) ? 'text-blades-gold' : 'text-blades-text'">
                  {{ upgrade.name }}
                  <span class="text-[10px] font-mono text-blades-muted ml-1">({{ upgrade.cost }} coin)</span>
                </div>
                <div class="text-[11px] font-mono text-blades-muted">{{ upgrade.description }}</div>
              </div>
            </div>
          </div>

          <!-- Contacts -->
          <div v-if="crewType" class="mt-4 pt-4 border-t border-blades-border/50">
            <h3 class="text-xs font-mono text-blades-muted uppercase tracking-widest mb-2">Contacts</h3>
            <div class="space-y-1">
              <div v-for="contact in crewType.contacts" :key="contact.name" class="flex gap-2 text-xs font-mono">
                <span class="text-blades-gold">{{ contact.name }}</span>
                <span class="text-blades-muted">— {{ contact.description }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Clocks -->
        <div class="blades-card p-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base">Clocks</h2>
            <button v-if="!isStatic" class="blades-btn-ghost text-xs py-0.5" @click="showAddClock = true">+ Add</button>
          </div>

          <div v-if="crew.clocks.length === 0" class="text-blades-muted font-mono text-xs text-center py-6">
            No active clocks.
          </div>

          <div class="space-y-4">
            <div v-for="clock in crew.clocks" :key="clock.id" class="flex items-center gap-4">
              <!-- SVG clock -->
              <ClockWidget
                :segments="clock.segments"
                :filled="clock.filled"
                :editable="!isStatic"
                @update="f => crewStore.updateClock(clock.id, { filled: f })"
              />
              <div class="flex-1">
                <div class="font-sans text-sm text-blades-text">{{ clock.name }}</div>
                <div class="text-[10px] font-mono text-blades-muted">{{ clock.filled }} / {{ clock.segments }}</div>
              </div>
              <button v-if="!isStatic" class="text-blades-muted hover:text-blades-red-light text-xs" @click="crewStore.removeClock(clock.id)">✕</button>
            </div>
          </div>

          <!-- Add clock form -->
          <div v-if="showAddClock && !isStatic" class="mt-4 pt-4 border-t border-blades-border/50 space-y-2">
            <div>
              <label class="blades-label">Clock Name</label>
              <input v-model="newClock.name" class="blades-input text-xs" placeholder="e.g. Heat from the Bluecoats" />
            </div>
            <div>
              <label class="blades-label">Segments</label>
              <select v-model.number="newClock.segments" class="blades-select text-xs">
                <option :value="4">4 segments</option>
                <option :value="6">6 segments</option>
                <option :value="8">8 segments</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button class="blades-btn-gold text-xs py-1" @click="addClock">Add Clock</button>
              <button class="blades-btn-ghost text-xs py-1" @click="showAddClock = false">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Crew special abilities -->
      <div v-if="crewType" class="blades-card p-4 mt-5">
        <h2 class="text-base mb-3">Crew Special Abilities</h2>
        <div class="space-y-2">
          <div
            v-for="ability in crewType.special_abilities"
            :key="ability.name"
            class="flex items-start gap-2 cursor-pointer group"
            @click="!isStatic && toggleCrewAbility(ability.name)"
          >
            <div
              class="w-4 h-4 mt-0.5 flex-shrink-0 rounded-full border transition-colors"
              :class="hasCrewAbility(ability.name)
                ? 'bg-blades-gold border-blades-gold'
                : 'border-blades-border group-hover:border-blades-border-light'"
            />
            <div>
              <span class="text-sm font-serif" :class="hasCrewAbility(ability.name) ? 'text-blades-gold' : 'text-blades-text'">
                {{ ability.name }}
              </span>
              <p class="text-[11px] font-mono text-blades-muted leading-snug">{{ ability.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger zone -->
      <div v-if="!isStatic" class="mt-6 flex justify-end">
        <button class="blades-btn-danger text-xs" @click="disbandCrew">Disband Crew</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCrewStore } from '@/stores/crew'
import { useLocationsStore } from '@/stores/locations'
import { CREW_TYPES } from '@/data/crew_types'
import ClockWidget from '@/components/ClockWidget.vue'
import BannerImage from '@/components/BannerImage.vue'
import type { ClockSegments } from '@/types/blades'

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const crewStore = useCrewStore()
const locStore = useLocationsStore()

const crew = computed(() => crewStore.crew)
const crewType = computed(() => CREW_TYPES.find(t => t.id === crew.value?.crewTypeId))
const lairName = computed(() => crew.value?.lair ? locStore.get(crew.value.lair)?.name : null)
const locations = computed(() => locStore.locations)

function createCrew() { crewStore.create() }
function disbandCrew() {
  if (confirm('Disband the crew? All crew data will be deleted.')) {
    localStorage.removeItem('ttdb_crew')
    crewStore.crew = null
  }
}

// Edit
const editing = ref(false)
const d = ref<any>({})
function startEdit() { d.value = { ...crew.value }; editing.value = true }
function save() { crewStore.update(d.value); editing.value = false }

// Tier / hold
function setTier(t: number) {
  crewStore.update({ tier: (crew.value!.tier === t ? t - 1 : t) as any })
}
function toggleHold() {
  crewStore.update({ hold: crew.value!.hold === 'strong' ? 'weak' : 'strong' })
}

// Upgrades
function hasUpgrade(name: string) {
  return crew.value!.upgrades.some(u => u.name === name && u.acquired)
}
function toggleUpgrade(name: string) {
  const upgs = crew.value!.upgrades
  const existing = upgs.find(u => u.name === name)
  if (existing) {
    crewStore.update({ upgrades: upgs.map(u => u.name === name ? { ...u, acquired: !u.acquired } : u) })
  } else {
    crewStore.update({ upgrades: [...upgs, { name, acquired: true }] })
  }
}

// Crew abilities
function hasCrewAbility(name: string) {
  return (crew.value as any).specialAbilities?.includes(name) ?? false
}
function toggleCrewAbility(name: string) {
  const abilities: string[] = (crew.value as any).specialAbilities ?? []
  const next = abilities.includes(name) ? abilities.filter(a => a !== name) : [...abilities, name]
  crewStore.update({ specialAbilities: next } as any)
}

// Clocks
const showAddClock = ref(false)
const newClock = ref({ name: '', segments: 4 as ClockSegments })

function addClock() {
  if (!newClock.value.name.trim()) return
  crewStore.addClock({ ...newClock.value, filled: 0 })
  showAddClock.value = false
  newClock.value = { name: '', segments: 4 }
}
</script>

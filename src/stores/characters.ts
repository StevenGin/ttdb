import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Character, ActionRatings } from '@/types/blades'
import { buildAurelionNpcs } from '@/data/aurelion'

const KEY = 'ttdb_characters'

function makeId() { return Math.random().toString(36).slice(2, 10) }

const BLANK_ACTIONS: ActionRatings = {
  hunt: 0, study: 0, survey: 0, tinker: 0,
  finesse: 0, prowl: 0, skirmish: 0, wreck: 0,
  attune: 0, command: 0, consort: 0, sway: 0,
}

export const useCharactersStore = defineStore('characters', () => {
  const characters = ref<Character[]>([])

  function load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        characters.value = JSON.parse(raw)
        return
      }
    } catch { console.warn('Failed to load characters') }
    // First run: seed with Aurelion world NPCs
    characters.value = buildAurelionNpcs()
    save()
  }

  function seedAurelionNpcs() {
    const seedIds = new Set(buildAurelionNpcs().map(n => n.id))
    const filtered = characters.value.filter(c => !seedIds.has(c.id))
    characters.value = [...filtered, ...buildAurelionNpcs()]
    save()
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(characters.value))
  }

  function create(partial: Partial<Character> = {}): Character {
    const now = new Date().toISOString()
    const ch: Character = {
      id: makeId(),
      name: 'Unnamed',
      playbookId: '',
      heritage: '',
      background: '',
      vice: '',
      actions: { ...BLANK_ACTIONS },
      coin: 0, stash: 0,
      stress: 0, maxStress: 9,
      trauma: [], harms: [],
      playbookXp: 0, insightXp: 0, prowessXp: 0, resolveXp: 0,
      specialAbilities: [],
      items: [],
      createdAt: now, updatedAt: now,
      ...partial,
    }
    characters.value.push(ch)
    save()
    return ch
  }

  function update(id: string, changes: Partial<Character>) {
    const idx = characters.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      characters.value[idx] = { ...characters.value[idx], ...changes, updatedAt: new Date().toISOString() }
      save()
    }
  }

  function remove(id: string) {
    characters.value = characters.value.filter(c => c.id !== id)
    save()
  }

  function get(id: string) { return characters.value.find(c => c.id === id) }

  function exportSnapshot() { return characters.value }

  return { characters, load, create, update, remove, get, exportSnapshot, seedAurelionNpcs }
})

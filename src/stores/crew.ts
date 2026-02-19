import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Crew, CrewClock } from '@/types/blades'

const KEY = 'ttdb_crew'
function makeId() { return Math.random().toString(36).slice(2, 10) }

export const useCrewStore = defineStore('crew', () => {
  const crew = ref<Crew | null>(null)

  function load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) crew.value = JSON.parse(raw)
    } catch { console.warn('Failed to load crew') }
  }

  function save() {
    if (crew.value) localStorage.setItem(KEY, JSON.stringify(crew.value))
  }

  function create(partial: Partial<Crew> = {}): Crew {
    const now = new Date().toISOString()
    crew.value = {
      id: makeId(),
      name: 'Unnamed Crew',
      crewTypeId: '',
      reputation: '',
      tier: 0,
      hold: 'weak',
      rep: 0,
      heat: 0,
      wantedLevel: 0,
      coin: 0,
      vault: 0,
      upgrades: [],
      clocks: [],
      contacts: [],
      createdAt: now,
      updatedAt: now,
      ...partial,
    }
    save()
    return crew.value
  }

  function update(changes: Partial<Crew>) {
    if (!crew.value) return
    crew.value = { ...crew.value, ...changes, updatedAt: new Date().toISOString() }
    save()
  }

  function addClock(clock: Omit<CrewClock, 'id'>): CrewClock {
    if (!crew.value) throw new Error('No crew')
    const c: CrewClock = { ...clock, id: makeId() }
    crew.value.clocks.push(c)
    save()
    return c
  }

  function updateClock(id: string, changes: Partial<CrewClock>) {
    if (!crew.value) return
    const idx = crew.value.clocks.findIndex(c => c.id === id)
    if (idx !== -1) { crew.value.clocks[idx] = { ...crew.value.clocks[idx], ...changes }; save() }
  }

  function removeClock(id: string) {
    if (!crew.value) return
    crew.value.clocks = crew.value.clocks.filter(c => c.id !== id)
    save()
  }

  function exportSnapshot() { return crew.value }

  return { crew, load, create, update, addClock, updateClock, removeClock, exportSnapshot }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ActivePilot, ActiveMech } from '@/types/lancer'

const STORAGE_KEY = 'ttdb_pilots'

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

export const usePilotsStore = defineStore('pilots', () => {
  const pilots = ref<ActivePilot[]>([])

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) pilots.value = JSON.parse(raw)
    } catch {
      console.warn('Failed to load pilots from localStorage')
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pilots.value))
  }

  function createPilot(partial: Partial<ActivePilot> = {}): ActivePilot {
    const now = new Date().toISOString()
    const pilot: ActivePilot = {
      id: makeId(),
      callsign: 'UNNAMED',
      name: '',
      level: 0,
      skills: [],
      talents: [],
      gear: [],
      weapons: [],
      mechs: [],
      createdAt: now,
      updatedAt: now,
      ...partial,
    }
    pilots.value.push(pilot)
    save()
    return pilot
  }

  function updatePilot(id: string, changes: Partial<ActivePilot>) {
    const idx = pilots.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      pilots.value[idx] = { ...pilots.value[idx], ...changes, updatedAt: new Date().toISOString() }
      save()
    }
  }

  function deletePilot(id: string) {
    pilots.value = pilots.value.filter(p => p.id !== id)
    save()
  }

  function addMech(pilotId: string, partial: Partial<ActiveMech> = {}): ActiveMech | null {
    const pilot = pilots.value.find(p => p.id === pilotId)
    if (!pilot) return null
    const mech: ActiveMech = {
      id: makeId(),
      name: 'UNNAMED MECH',
      frameId: '',
      mounts: [],
      systems: [],
      coreBonuses: [],
      ...partial,
    }
    pilot.mechs.push(mech)
    save()
    return mech
  }

  function updateMech(pilotId: string, mechId: string, changes: Partial<ActiveMech>) {
    const pilot = pilots.value.find(p => p.id === pilotId)
    if (!pilot) return
    const idx = pilot.mechs.findIndex(m => m.id === mechId)
    if (idx !== -1) {
      pilot.mechs[idx] = { ...pilot.mechs[idx], ...changes }
      pilot.updatedAt = new Date().toISOString()
      save()
    }
  }

  function deleteMech(pilotId: string, mechId: string) {
    const pilot = pilots.value.find(p => p.id === pilotId)
    if (!pilot) return
    pilot.mechs = pilot.mechs.filter(m => m.id !== mechId)
    save()
  }

  function exportSnapshot() {
    return pilots.value
  }

  return {
    pilots,
    load,
    createPilot,
    updatePilot,
    deletePilot,
    addMech,
    updateMech,
    deleteMech,
    exportSnapshot,
  }
})

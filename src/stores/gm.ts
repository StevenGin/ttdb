import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Encounter, Mission, EncounterNpc, MissionStep } from '@/types/lancer'

const ENC_KEY = 'ttdb_encounters'
const MISS_KEY = 'ttdb_missions'

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

export const useGmStore = defineStore('gm', () => {
  const encounters = ref<Encounter[]>([])
  const missions = ref<Mission[]>([])

  function load() {
    try {
      const rawEnc = localStorage.getItem(ENC_KEY)
      if (rawEnc) encounters.value = JSON.parse(rawEnc)
      const rawMiss = localStorage.getItem(MISS_KEY)
      if (rawMiss) missions.value = JSON.parse(rawMiss)
    } catch {
      console.warn('Failed to load GM data from localStorage')
    }
  }

  function saveEncounters() {
    localStorage.setItem(ENC_KEY, JSON.stringify(encounters.value))
  }

  function saveMissions() {
    localStorage.setItem(MISS_KEY, JSON.stringify(missions.value))
  }

  // ── Encounters ─────────────────────────────────────────────────────────────

  function createEncounter(partial: Partial<Encounter> = {}): Encounter {
    const now = new Date().toISOString()
    const enc: Encounter = {
      id: makeId(),
      name: 'New Encounter',
      npcs: [],
      createdAt: now,
      updatedAt: now,
      ...partial,
    }
    encounters.value.push(enc)
    saveEncounters()
    return enc
  }

  function updateEncounter(id: string, changes: Partial<Encounter>) {
    const idx = encounters.value.findIndex(e => e.id === id)
    if (idx !== -1) {
      encounters.value[idx] = { ...encounters.value[idx], ...changes, updatedAt: new Date().toISOString() }
      saveEncounters()
    }
  }

  function deleteEncounter(id: string) {
    encounters.value = encounters.value.filter(e => e.id !== id)
    saveEncounters()
  }

  function addNpcToEncounter(encId: string, npc: EncounterNpc) {
    const enc = encounters.value.find(e => e.id === encId)
    if (enc) {
      enc.npcs.push(npc)
      saveEncounters()
    }
  }

  function removeNpcFromEncounter(encId: string, npcIndex: number) {
    const enc = encounters.value.find(e => e.id === encId)
    if (enc) {
      enc.npcs.splice(npcIndex, 1)
      saveEncounters()
    }
  }

  // ── Missions ───────────────────────────────────────────────────────────────

  function createMission(partial: Partial<Mission> = {}): Mission {
    const now = new Date().toISOString()
    const mission: Mission = {
      id: makeId(),
      name: 'New Mission',
      steps: [],
      createdAt: now,
      updatedAt: now,
      ...partial,
    }
    missions.value.push(mission)
    saveMissions()
    return mission
  }

  function updateMission(id: string, changes: Partial<Mission>) {
    const idx = missions.value.findIndex(m => m.id === id)
    if (idx !== -1) {
      missions.value[idx] = { ...missions.value[idx], ...changes, updatedAt: new Date().toISOString() }
      saveMissions()
    }
  }

  function deleteMission(id: string) {
    missions.value = missions.value.filter(m => m.id !== id)
    saveMissions()
  }

  function addStepToMission(missionId: string, step: Omit<MissionStep, 'id'>) {
    const mission = missions.value.find(m => m.id === missionId)
    if (mission) {
      mission.steps.push({ ...step, id: makeId() })
      saveMissions()
    }
  }

  function exportSnapshot() {
    return { encounters: encounters.value, missions: missions.value }
  }

  return {
    encounters,
    missions,
    load,
    createEncounter,
    updateEncounter,
    deleteEncounter,
    addNpcToEncounter,
    removeNpcFromEncounter,
    createMission,
    updateMission,
    deleteMission,
    addStepToMission,
    exportSnapshot,
  }
})

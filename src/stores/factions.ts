import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Faction, FactionStatus, FactionCategory } from '@/types/blades'
import { buildAurelionFactions } from '@/data/aurelion'

const KEY = 'ttdb_factions'

function makeId() { return Math.random().toString(36).slice(2, 10) }

export function buildCoreFactions(): Faction[] {
  const now = new Date().toISOString()
  return buildAurelionFactions().map(f => ({
    ...f,
    crewStatus: 0 as FactionStatus,
    createdAt: now,
    updatedAt: now,
  }))
}

export const useFactionsStore = defineStore('factions', () => {
  const factions = ref<Faction[]>([])

  function load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        factions.value = JSON.parse(raw)
        return
      }
    } catch { console.warn('Failed to load factions') }
    // First run: seed with Aurelion factions
    factions.value = buildCoreFactions()
    save()
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(factions.value))
  }

  function create(partial: Partial<Faction> = {}): Faction {
    const now = new Date().toISOString()
    const f: Faction = {
      id: makeId(),
      name: 'New Faction',
      tier: 1,
      hold: 'weak',
      category: 'other',
      description: '',
      crewStatus: 0,
      createdAt: now,
      updatedAt: now,
      ...partial,
    }
    factions.value.push(f)
    save()
    return f
  }

  function update(id: string, changes: Partial<Faction>) {
    const idx = factions.value.findIndex(f => f.id === id)
    if (idx !== -1) {
      factions.value[idx] = { ...factions.value[idx], ...changes, updatedAt: new Date().toISOString() }
      save()
    }
  }

  function remove(id: string) {
    factions.value = factions.value.filter(f => f.id !== id)
    save()
  }

  function setStatus(id: string, status: FactionStatus) {
    update(id, { crewStatus: status })
  }

  function get(id: string) { return factions.value.find(f => f.id === id) }

  const byCategory = computed(() => {
    const map: Partial<Record<FactionCategory, Faction[]>> = {}
    for (const f of factions.value) {
      if (!map[f.category]) map[f.category] = []
      map[f.category]!.push(f)
    }
    return map
  })

  const categories = computed<FactionCategory[]>(() => {
    const cats = new Set<FactionCategory>()
    for (const f of factions.value) cats.add(f.category)
    return Array.from(cats).sort()
  })

  function resetToAurelion() {
    factions.value = buildCoreFactions()
    save()
  }

  function exportSnapshot() { return factions.value }

  return {
    factions,
    load, create, update, remove, setStatus, get,
    byCategory, categories,
    resetToAurelion,
    exportSnapshot,
  }
})

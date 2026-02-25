import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Location, LocationType } from '@/types/blades'
import { buildAurelionLocations } from '@/data/aurelion'

const KEY = 'ttdb_locations'

function makeId() { return Math.random().toString(36).slice(2, 10) }

export const useLocationsStore = defineStore('locations', () => {
  const locations = ref<Location[]>([])

  function load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        locations.value = JSON.parse(raw)
        return
      }
    } catch { console.warn('Failed to load locations') }
    // First run: seed with Aurelion world
    locations.value = buildAurelionLocations()
    save()
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(locations.value))
  }

  function create(partial: Partial<Location> = {}): Location {
    const now = new Date().toISOString()
    const loc: Location = {
      id: makeId(),
      name: 'New Location',
      type: 'site',
      parentId: null,
      createdAt: now,
      updatedAt: now,
      ...partial,
    }
    locations.value.push(loc)
    save()
    return loc
  }

  function update(id: string, changes: Partial<Location>) {
    const idx = locations.value.findIndex(l => l.id === id)
    if (idx !== -1) {
      locations.value[idx] = { ...locations.value[idx], ...changes, updatedAt: new Date().toISOString() }
      save()
    }
  }

  function remove(id: string) {
    // Remove location and all descendants
    const toRemove = new Set<string>()
    const collect = (lid: string) => {
      toRemove.add(lid)
      locations.value.filter(l => l.parentId === lid).forEach(child => collect(child.id))
    }
    collect(id)
    locations.value = locations.value.filter(l => !toRemove.has(l.id))
    save()
  }

  function get(id: string) { return locations.value.find(l => l.id === id) }

  // Tree helpers
  function children(parentId: string | null) {
    return locations.value.filter(l => l.parentId === parentId)
  }

  function roots() { return children(null) }

  function ancestors(id: string): Location[] {
    const loc = get(id)
    if (!loc || !loc.parentId) return []
    const parent = get(loc.parentId)
    if (!parent) return []
    return [...ancestors(loc.parentId), parent]
  }

  function descendants(id: string): Location[] {
    const kids = children(id)
    return [...kids, ...kids.flatMap(k => descendants(k.id))]
  }

  const typeOrder: LocationType[] = ['region', 'city', 'district', 'site']
  function typeRank(t: LocationType) { return typeOrder.indexOf(t) }

  function resetToAurelion() {
    locations.value = buildAurelionLocations()
    save()
  }

  function exportSnapshot() { return locations.value }

  return {
    locations,
    load, create, update, remove, get,
    children, roots, ancestors, descendants,
    typeRank,
    resetToAurelion,
    exportSnapshot,
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Item } from '@/types/blades'

const KEY = 'ttdb_items'
function makeId() { return Math.random().toString(36).slice(2, 10) }

export const useItemsStore = defineStore('items', () => {
  const items = ref<Item[]>([])

  function load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) items.value = JSON.parse(raw)
    } catch { console.warn('Failed to load items') }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(items.value))
  }

  function create(partial: Partial<Item> = {}): Item {
    const now = new Date().toISOString()
    const item: Item = {
      id: makeId(),
      name: 'New Item',
      load: 1,
      description: '',
      createdAt: now,
      updatedAt: now,
      ...partial,
    }
    items.value.push(item)
    save()
    return item
  }

  function update(id: string, changes: Partial<Item>) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) {
      items.value[idx] = { ...items.value[idx], ...changes, updatedAt: new Date().toISOString() }
      save()
    }
  }

  function remove(id: string) {
    items.value = items.value.filter(i => i.id !== id)
    save()
  }

  function get(id: string) { return items.value.find(i => i.id === id) }

  function exportSnapshot() { return items.value }

  return { items, load, create, update, remove, get, exportSnapshot }
})

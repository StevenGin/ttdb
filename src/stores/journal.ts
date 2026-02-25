import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { JournalEntry } from '@/types/blades'

const KEY = 'ttdb_journal'

function makeId() { return Math.random().toString(36).slice(2, 10) }

export const useJournalStore = defineStore('journal', () => {
  const entries = ref<JournalEntry[]>([])

  function load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) entries.value = JSON.parse(raw)
    } catch { console.warn('Failed to load journal') }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(entries.value))
  }

  function create(partial: Partial<JournalEntry> = {}): JournalEntry {
    const now = new Date().toISOString()
    const entry: JournalEntry = {
      id: makeId(),
      title: 'Session Notes',
      content: '',
      isPublic: true,
      createdAt: now,
      updatedAt: now,
      ...partial,
    }
    entries.value.unshift(entry)
    save()
    return entry
  }

  function update(id: string, changes: Partial<JournalEntry>) {
    const idx = entries.value.findIndex(e => e.id === id)
    if (idx !== -1) {
      entries.value[idx] = { ...entries.value[idx], ...changes, updatedAt: new Date().toISOString() }
      save()
    }
  }

  function remove(id: string) {
    entries.value = entries.value.filter(e => e.id !== id)
    save()
  }

  function get(id: string) { return entries.value.find(e => e.id === id) }

  function exportSnapshot() { return entries.value }

  return { entries, load, create, update, remove, get, exportSnapshot }
})

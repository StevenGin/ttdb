import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Score } from '@/types/blades'

const KEY = 'ttdb_jobs'

function makeId() { return Math.random().toString(36).slice(2, 10) }

export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref<Score[]>([])

  function load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) jobs.value = JSON.parse(raw)
    } catch { console.warn('Failed to load jobs') }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(jobs.value))
  }

  function create(partial: Partial<Score> = {}): Score {
    const now = new Date().toISOString()
    const job: Score = {
      id: makeId(),
      name: 'Unnamed Score',
      type: 'heist',
      status: 'planning',
      contactIds: [],
      clocks: [],
      createdAt: now,
      updatedAt: now,
      ...partial,
    }
    jobs.value.unshift(job)
    save()
    return job
  }

  function update(id: string, changes: Partial<Score>) {
    const idx = jobs.value.findIndex(j => j.id === id)
    if (idx !== -1) {
      jobs.value[idx] = { ...jobs.value[idx], ...changes, updatedAt: new Date().toISOString() }
      save()
    }
  }

  function remove(id: string) {
    jobs.value = jobs.value.filter(j => j.id !== id)
    save()
  }

  function get(id: string) { return jobs.value.find(j => j.id === id) }

  function exportSnapshot() { return jobs.value }

  return { jobs, load, create, update, remove, get, exportSnapshot }
})

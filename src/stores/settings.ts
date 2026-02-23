import { defineStore } from 'pinia'
import { ref } from 'vue'

const KEY = 'ttdb_settings'

export type AppTheme = 'dark' | 'light'

export const useSettingsStore = defineStore('settings', () => {
  const openaiKey = ref('')
  const theme = ref<AppTheme>('dark')

  function load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const d = JSON.parse(raw)
        openaiKey.value = d.openaiKey ?? ''
        theme.value = (d.theme === 'light') ? 'light' : 'dark'
      }
    } catch { /* ignore */ }
    _applyTheme(theme.value)
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify({ openaiKey: openaiKey.value, theme: theme.value }))
  }

  function _applyTheme(t: AppTheme) {
    document.documentElement.dataset.theme = t
  }

  function setTheme(t: AppTheme) {
    theme.value = t
    _applyTheme(t)
    save()
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function setOpenaiKey(key: string) {
    openaiKey.value = key
    save()
  }

  return { openaiKey, theme, load, setTheme, toggleTheme, setOpenaiKey }
})

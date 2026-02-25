import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import './style.css'

declare const __STATIC_MODE__: boolean

async function init() {
  // In static mode, load campaign data from the published JSON file and seed
  // localStorage so all stores work without modification.
  if (__STATIC_MODE__) {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}campaign-data.json`)
      if (res.ok) {
        const d = await res.json()
        if (d.characters?.length) localStorage.setItem('ttdb_characters', JSON.stringify(d.characters))
        if (d.locations?.length)  localStorage.setItem('ttdb_locations',  JSON.stringify(d.locations))
        if (d.factions?.length)   localStorage.setItem('ttdb_factions',   JSON.stringify(d.factions))
        if (d.items?.length)      localStorage.setItem('ttdb_items',      JSON.stringify(d.items))
        if (d.crew?.length)       localStorage.setItem('ttdb_crew',       JSON.stringify(d.crew))
        if (d.journal?.length)    localStorage.setItem('ttdb_journal',    JSON.stringify(d.journal))
      }
    } catch {
      // No campaign-data.json or network error — show default seeded data
    }
  }

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
}

init()

import { createRouter, createWebHashHistory } from 'vue-router'

declare const __STATIC_MODE__: boolean

const routes = [
  { path: '/', redirect: '/characters' },
  { path: '/characters', component: () => import('@/views/CharactersView.vue') },
  { path: '/characters/:id', component: () => import('@/views/CharacterDetailView.vue') },
  { path: '/locations', component: () => import('@/views/LocationsView.vue') },
  { path: '/factions', component: () => import('@/views/FactionsView.vue') },
  { path: '/items', component: () => import('@/views/ItemsView.vue') },
  { path: '/crew', component: () => import('@/views/CrewView.vue') },
  ...(__STATIC_MODE__
    ? []
    : [{ path: '/settings', component: () => import('@/views/SettingsView.vue') }]),
  { path: '/:pathMatch(.*)*', redirect: '/characters' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

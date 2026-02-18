import { createRouter, createWebHashHistory } from 'vue-router'

declare const __STATIC_MODE__: boolean

const routes = [
  {
    path: '/',
    redirect: '/compendium',
  },
  {
    path: '/compendium',
    component: () => import('@/views/CompendiumView.vue'),
    children: [
      { path: '', redirect: '/compendium/frames' },
      { path: 'frames', component: () => import('@/views/compendium/FramesView.vue') },
      { path: 'frames/:id', component: () => import('@/views/compendium/FrameDetailView.vue') },
      { path: 'weapons', component: () => import('@/views/compendium/WeaponsView.vue') },
      { path: 'systems', component: () => import('@/views/compendium/SystemsView.vue') },
      { path: 'npc-classes', component: () => import('@/views/compendium/NpcClassesView.vue') },
      { path: 'npc-classes/:id', component: () => import('@/views/compendium/NpcClassDetailView.vue') },
    ],
  },
  {
    path: '/pilots',
    component: () => import('@/views/PilotsView.vue'),
  },
  {
    path: '/pilots/:id',
    component: () => import('@/views/PilotDetailView.vue'),
  },
  {
    path: '/gm',
    component: () => import('@/views/GmView.vue'),
    children: [
      { path: '', redirect: '/gm/encounters' },
      { path: 'encounters', component: () => import('@/views/gm/EncountersView.vue') },
      { path: 'encounters/:id', component: () => import('@/views/gm/EncounterDetailView.vue') },
      { path: 'missions', component: () => import('@/views/gm/MissionsView.vue') },
    ],
  },
  // Only available in local mode
  ...(__STATIC_MODE__
    ? []
    : [
        {
          path: '/homebrew',
          component: () => import('@/views/HomebrewView.vue'),
        },
        {
          path: '/settings',
          component: () => import('@/views/SettingsView.vue'),
        },
      ]),
  {
    path: '/:pathMatch(.*)*',
    redirect: '/compendium',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

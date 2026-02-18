import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Frame, Manufacturer, NpcClass, NpcTemplate, NpcFeature, MechWeapon, MechSystem, CoreBonus, TagDef, HomebrewPackage, PilotTalent, PilotSkill } from '@/types/lancer'
import { FRAMES } from '@/data/frames'
import { MANUFACTURERS } from '@/data/manufacturers'
import { NPC_CLASSES } from '@/data/npc_classes'

const STORAGE_KEY = 'ttdb_homebrew'

export const useCompendiumStore = defineStore('compendium', () => {
  // ── Core (read-only SRD data) ──────────────────────────────────────────────
  const coreFrames = ref<Frame[]>(FRAMES)
  const coreManufacturers = ref<Manufacturer[]>(MANUFACTURERS)
  const coreNpcClasses = ref<NpcClass[]>(NPC_CLASSES)
  const coreNpcTemplates = ref<NpcTemplate[]>([])
  const coreNpcFeatures = ref<NpcFeature[]>([])
  const coreMechWeapons = ref<MechWeapon[]>([])
  const coreMechSystems = ref<MechSystem[]>([])
  const coreCoreBonuses = ref<CoreBonus[]>([])
  const coreTalents = ref<PilotTalent[]>([])
  const corePilotSkills = ref<PilotSkill[]>([])
  const coreTags = ref<TagDef[]>([
    { id: 'tg_accurate', name: 'Accurate', description: 'This weapon grants +1 Accuracy on attack rolls.' },
    { id: 'tg_ap', name: 'Armor-Piercing (AP)', description: 'This weapon ignores armor.' },
    { id: 'tg_arcing', name: 'Arcing', description: 'This weapon can be fired in an arc, ignoring intervening obstacles and cover.' },
    { id: 'tg_burn', name: 'Burn X', description: 'On a hit, the target receives Burn X.' },
    { id: 'tg_dancer', name: 'Dancer', description: 'When you attack with this weapon, you can move 1 space before or after the attack.' },
    { id: 'tg_heat_self', name: 'Heat (Self) X', description: 'When you attack with this weapon, you take X Heat.' },
    { id: 'tg_inaccurate', name: 'Inaccurate', description: 'This weapon grants +1 Difficulty on attack rolls.' },
    { id: 'tg_knockback', name: 'Knockback X', description: 'On a hit, push the target X spaces.' },
    { id: 'tg_limited', name: 'Limited X', description: 'This item has X uses.' },
    { id: 'tg_loading', name: 'Loading', description: 'This weapon must be reloaded (quick action) before it can be fired again.' },
    { id: 'tg_overkill', name: 'Overkill', description: 'When you roll damage with this weapon, any result of 1 can be rerolled once.' },
    { id: 'tg_overshield', name: 'Overshield', description: 'When you gain Overshield, you get temporary HP equal to the value.' },
    { id: 'tg_reliable', name: 'Reliable X', description: 'This weapon always deals at least X damage, even on a miss.' },
    { id: 'tg_seeking', name: 'Seeking', description: 'This weapon ignores cover and does not require line of sight.' },
    { id: 'tg_smart', name: 'Smart', description: 'This weapon targets E-Defense instead of Evasion.' },
    { id: 'tg_threat', name: 'Threat X', description: 'This melee weapon has threat X (default is 1).' },
    { id: 'tg_thrown', name: 'Thrown X', description: 'This weapon can be thrown, with range X.' },
    { id: 'tg_unique', name: 'Unique', description: 'This item is unique — you may only have one at a time.' },
  ])

  // ── Homebrew packages ──────────────────────────────────────────────────────
  const homebrewPackages = ref<HomebrewPackage[]>([])

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) homebrewPackages.value = JSON.parse(raw)
    } catch {
      console.warn('Failed to load homebrew from localStorage')
    }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(homebrewPackages.value))
  }

  function addHomebrewPackage(pkg: HomebrewPackage) {
    homebrewPackages.value.push(pkg)
    saveToStorage()
  }

  function removeHomebrewPackage(id: string) {
    homebrewPackages.value = homebrewPackages.value.filter(p => p.id !== id)
    saveToStorage()
  }

  function toggleHomebrewPackage(id: string) {
    const pkg = homebrewPackages.value.find(p => p.id === id)
    if (pkg) {
      pkg.active = !pkg.active
      saveToStorage()
    }
  }

  function updateHomebrewPackage(updated: HomebrewPackage) {
    const idx = homebrewPackages.value.findIndex(p => p.id === updated.id)
    if (idx !== -1) {
      homebrewPackages.value[idx] = updated
      saveToStorage()
    }
  }

  // ── Merged computed getters ────────────────────────────────────────────────
  const activeHomebrew = computed(() => homebrewPackages.value.filter(p => p.active))

  const allFrames = computed<Frame[]>(() => [
    ...coreFrames.value,
    ...activeHomebrew.value.flatMap(p => p.frames ?? []),
  ])

  const allManufacturers = computed<Manufacturer[]>(() => [
    ...coreManufacturers.value,
    ...activeHomebrew.value.flatMap(p => p.manufacturers ?? []),
  ])

  const allNpcClasses = computed<NpcClass[]>(() => [
    ...coreNpcClasses.value,
    ...activeHomebrew.value.flatMap(p => p.npcClasses ?? []),
  ])

  const allNpcTemplates = computed<NpcTemplate[]>(() => [
    ...coreNpcTemplates.value,
    ...activeHomebrew.value.flatMap(p => p.npcTemplates ?? []),
  ])

  const allNpcFeatures = computed<NpcFeature[]>(() => [
    ...coreNpcFeatures.value,
    ...activeHomebrew.value.flatMap(p => p.npcFeatures ?? []),
  ])

  const allMechWeapons = computed<MechWeapon[]>(() => [
    ...coreMechWeapons.value,
    ...activeHomebrew.value.flatMap(p => p.weapons ?? []),
  ])

  const allMechSystems = computed<MechSystem[]>(() => [
    ...coreMechSystems.value,
    ...activeHomebrew.value.flatMap(p => p.systems ?? []),
  ])

  const allCoreBonuses = computed<CoreBonus[]>(() => [
    ...coreCoreBonuses.value,
    ...activeHomebrew.value.flatMap(p => p.coreBonuses ?? []),
  ])

  const allTalents = computed<PilotTalent[]>(() => [
    ...coreTalents.value,
    ...activeHomebrew.value.flatMap(p => p.talents ?? []),
  ])

  const allTags = computed<TagDef[]>(() => [
    ...coreTags.value,
    ...activeHomebrew.value.flatMap(p => p.tags ?? []),
  ])

  function getTag(id: string) {
    return allTags.value.find(t => t.id === id)
  }

  function getManufacturer(id: string) {
    return allManufacturers.value.find(m => m.id === id)
  }

  function getFrame(id: string) {
    return allFrames.value.find(f => f.id === id)
  }

  function getNpcClass(id: string) {
    return allNpcClasses.value.find(c => c.id === id)
  }

  // ── Snapshot for static export ─────────────────────────────────────────────
  function exportSnapshot() {
    return {
      frames: allFrames.value,
      manufacturers: allManufacturers.value,
      npcClasses: allNpcClasses.value,
      npcTemplates: allNpcTemplates.value,
      npcFeatures: allNpcFeatures.value,
      mechWeapons: allMechWeapons.value,
      mechSystems: allMechSystems.value,
      coreBonuses: allCoreBonuses.value,
      talents: allTalents.value,
      tags: allTags.value,
    }
  }

  return {
    // raw
    homebrewPackages,
    // computed
    activeHomebrew,
    allFrames,
    allManufacturers,
    allNpcClasses,
    allNpcTemplates,
    allNpcFeatures,
    allMechWeapons,
    allMechSystems,
    allCoreBonuses,
    allTalents,
    allTags,
    corePilotSkills,
    // actions
    loadFromStorage,
    addHomebrewPackage,
    removeHomebrewPackage,
    toggleHomebrewPackage,
    updateHomebrewPackage,
    getTag,
    getManufacturer,
    getFrame,
    getNpcClass,
    exportSnapshot,
  }
})

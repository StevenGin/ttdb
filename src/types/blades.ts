// ─── Blades in the Dark Core Types ───────────────────────────────────────────

// ── Actions & Attributes ───────────────────────────────────────────────────────

export type InsightAction = 'hunt' | 'study' | 'survey' | 'tinker'
export type ProwessAction = 'finesse' | 'prowl' | 'skirmish' | 'wreck'
export type ResolveAction = 'attune' | 'command' | 'consort' | 'sway'
export type ActionName = InsightAction | ProwessAction | ResolveAction

export type AttributeName = 'insight' | 'prowess' | 'resolve'

export const ACTION_GROUPS: Record<AttributeName, ActionName[]> = {
  insight: ['hunt', 'study', 'survey', 'tinker'],
  prowess: ['finesse', 'prowl', 'skirmish', 'wreck'],
  resolve: ['attune', 'command', 'consort', 'sway'],
}

export const ACTION_LABELS: Record<ActionName, string> = {
  hunt: 'Hunt', study: 'Study', survey: 'Survey', tinker: 'Tinker',
  finesse: 'Finesse', prowl: 'Prowl', skirmish: 'Skirmish', wreck: 'Wreck',
  attune: 'Attune', command: 'Command', consort: 'Consort', sway: 'Sway',
}

// ── Playbooks ─────────────────────────────────────────────────────────────────

export interface SpecialAbility {
  name: string
  description: string
  clarification?: string
}

export interface PlaybookItem {
  name: string
  load: number
  description?: string
}

export interface Playbook {
  id: string
  name: string
  description: string
  xp_trigger: string
  starting_actions: Partial<Record<ActionName, number>>
  special_abilities: SpecialAbility[]
  starting_builds?: { name: string; actions: Partial<Record<ActionName, number>> }[]
  items: PlaybookItem[]
  friends: { name: string; description: string }[]
}

// ── Characters ───────────────────────────────────────────────────────────────

export type HarmLevel = 1 | 2 | 3

export interface HarmEntry {
  level: HarmLevel
  description: string
}

export interface CharacterItem {
  id: string
  name: string
  load: number
  equipped: boolean
  notes?: string
  // If linked to a catalog item
  itemId?: string
}

export interface ActionRatings {
  hunt: number
  study: number
  survey: number
  tinker: number
  finesse: number
  prowl: number
  skirmish: number
  wreck: number
  attune: number
  command: number
  consort: number
  sway: number
}

export interface Character {
  id: string
  name: string
  alias?: string
  playbookId: string
  heritage: string
  background: string
  vice: string
  viceSource?: string // "dealer/temple/etc."
  // Action ratings (0-4)
  actions: ActionRatings
  // Resources
  coin: number
  stash: number
  // Condition
  stress: number
  maxStress: number
  trauma: string[]
  harms: HarmEntry[]
  healingClock?: number // 0-4 ticks
  // XP tracks (0-8 for playbook, 0-6 for attributes)
  playbookXp: number
  insightXp: number
  prowessXp: number
  resolveXp: number
  // Abilities & gear
  specialAbilities: string[]
  items: CharacterItem[]
  // Relationships & notes
  description?: string
  looks?: string
  notes?: string
  friends?: string[]
  crewId?: string
  createdAt: string
  updatedAt: string
}

// ── Crew ─────────────────────────────────────────────────────────────────────

export interface CrewUpgrade {
  name: string
  acquired: boolean
}

export interface CrewClock {
  id: string
  name: string
  segments: number // 4, 6, or 8
  filled: number
}

export interface Crew {
  id: string
  name: string
  crewTypeId: string
  reputation: string // e.g. "audacious" "brutal" "honorable"...
  lair?: string       // locationId
  tier: 0 | 1 | 2 | 3 | 4 | 5
  hold: 'strong' | 'weak'
  rep: number          // 0-12, resets at 12 to gain tier
  heat: number         // 0-9
  wantedLevel: number  // 0-4
  coin: number
  vault: number
  description?: string
  notes?: string
  upgrades: CrewUpgrade[]
  clocks: CrewClock[]
  contacts: { name: string; description: string }[]
  createdAt: string
  updatedAt: string
}

export interface CrewType {
  id: string
  name: string
  description: string
  xp_trigger: string
  special_abilities: SpecialAbility[]
  upgrades: { name: string; description: string; cost: number }[]
  contacts: { name: string; description: string }[]
  starting_upgrades: string[]
}

// ── Locations ─────────────────────────────────────────────────────────────────

export type LocationType =
  | 'world'
  | 'city'
  | 'district'
  | 'area'
  | 'site'
  | 'room'
  | 'other'

export const LOCATION_TYPES: LocationType[] = [
  'world', 'city', 'district', 'area', 'site', 'room', 'other',
]

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  world: 'World',
  city: 'City',
  district: 'District',
  area: 'Area',
  site: 'Site / Building',
  room: 'Room / Space',
  other: 'Other',
}

export interface Location {
  id: string
  name: string
  type: LocationType
  parentId: string | null
  description?: string
  notes?: string
  tags?: string[]
  controlledBy?: string      // factionId
  notableNpcs?: string[]
  linkedItemIds?: string[]
  createdAt: string
  updatedAt: string
}

// ── Factions ──────────────────────────────────────────────────────────────────

export type FactionStatus = -3 | -2 | -1 | 0 | 1 | 2 | 3

export const FACTION_STATUS_LABELS: Record<FactionStatus, string> = {
  '-3': 'At War',
  '-2': 'Hostile',
  '-1': 'Cold',
  '0': 'Neutral',
  '1': 'Friendly',
  '2': 'Helpful',
  '3': 'Ally',
}

export const FACTION_STATUS_COLORS: Record<FactionStatus, string> = {
  '-3': '#b91c1c',
  '-2': '#dc2626',
  '-1': '#f97316',
  '0': '#6a6080',
  '1': '#16a34a',
  '2': '#15803d',
  '3': '#14532d',
}

export type FactionCategory =
  | 'criminal'
  | 'institutions'
  | 'labor & trade'
  | 'streets'
  | 'supernatural'
  | 'underworld'
  | 'other'

export interface Faction {
  id: string
  name: string
  tier: 0 | 1 | 2 | 3 | 4 | 5
  hold: 'strong' | 'weak'
  category: FactionCategory
  description: string
  headquarters?: string    // locationId or free text
  goals?: string
  threats?: string
  notes?: string
  // Crew relationship (editable)
  crewStatus: FactionStatus
  isCore?: boolean         // built-in SRD faction vs. custom
  createdAt: string
  updatedAt: string
}

// ── Items ─────────────────────────────────────────────────────────────────────

export interface Item {
  id: string
  name: string
  load: number
  description: string
  tags?: string[]
  isCore?: boolean
  // Where/who has it (optional links)
  heldBy?: string    // characterId
  locationId?: string
  createdAt: string
  updatedAt: string
}

// ── Scores / Missions ─────────────────────────────────────────────────────────

export type ClockSegments = 4 | 6 | 8

export interface Clock {
  id: string
  name: string
  segments: ClockSegments
  filled: number
  notes?: string
}

export interface Score {
  id: string
  name: string
  type: string          // 'assassination' | 'heist' | 'occult' | 'ransom' | 'sabotage' | 'smuggling' | 'sway' | 'theft'
  targetFactionId?: string
  locationId?: string
  description?: string
  plan?: string
  detail?: string
  notes?: string
  outcome?: string
  rep?: number
  heat?: number
  coin?: number
  clocks: Clock[]
  status: 'planning' | 'active' | 'complete' | 'abandoned'
  createdAt: string
  updatedAt: string
}

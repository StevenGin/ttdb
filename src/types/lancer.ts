// ─── Core Lancer Data Types ───────────────────────────────────────────────────

export type LancerSize = 'half' | 1 | 2 | 3
export type DamageType = 'kinetic' | 'energy' | 'explosive' | 'heat' | 'burn' | 'variable'
export type RangeType = 'range' | 'threat' | 'blast' | 'burst' | 'cone' | 'line'
export type MountType = 'aux' | 'aux/aux' | 'main' | 'main/aux' | 'heavy' | 'superheavy' | 'integrated' | 'flex'
export type SystemType = 'system' | 'tech' | 'mod' | 'ai' | 'shield' | 'deployable' | 'drone' | 'weapon' | 'integrated' | 'flight'

export interface Damage {
  val: number | string
  type: DamageType
}

export interface Range {
  val: number
  type: RangeType
  override?: boolean
  bonus?: number
}

export interface Tag {
  id: string
  val?: number | string
}

export interface TagDef {
  id: string
  name: string
  description: string
  filter_ignore?: boolean
  hidden?: boolean
}

export interface Action {
  name: string
  activation: 'free' | 'quick' | 'full' | 'quick tech' | 'full tech' | 'reaction' | 'passive' | 'protocol'
  detail: string
  log?: string
  init?: string
  trigger?: string
  range?: Range[]
  damage?: Damage[]
  tags?: Tag[]
  on_hit?: string
  on_attack?: string
  on_crit?: string
}

export interface Bonus {
  id: string
  val: number | string
  damage_types?: DamageType[]
  range_types?: RangeType[]
  weapon_types?: string[]
  weapon_sizes?: string[]
}

export interface Synergy {
  locations: string[]
  detail: string
  weapon_types?: string[]
  weapon_sizes?: string[]
  system_types?: string[]
  tags?: string[]
}

export interface Deployable {
  name: string
  type: string
  detail: string
  size?: number
  hp?: number
  evasion?: number
  edef?: number
  armor?: number
  speed?: number
  heat_cap?: number
  actions?: Action[]
  tags?: Tag[]
  activation?: string
  recall?: string
  redeploy?: string
  count?: number
  instances?: number
}

export interface Counter {
  id: string
  name: string
  default_value?: number
  min?: number
  max?: number
}

// ─── Manufacturers ────────────────────────────────────────────────────────────

export interface Manufacturer {
  id: string
  name: string
  logo?: string
  logo_url?: string
  color?: string
  description: string
  quote?: string
  location?: string
}

// ─── Pilot ───────────────────────────────────────────────────────────────────

export interface PilotBackground {
  id: string
  name: string
  triggers: string
  description: string
}

export interface Reserve {
  id: string
  type: 'mech' | 'tactical' | 'resource' | 'narrative' | 'bonus' | 'organization'
  name: string
  label?: string
  description?: string
  actions?: Action[]
  bonuses?: Bonus[]
  counters?: Counter[]
  integrated?: string[]
  deployables?: Deployable[]
  used?: boolean
}

export interface PilotTalentRank {
  name: string
  description: string
  exclusive?: boolean
  actions?: Action[]
  bonuses?: Bonus[]
  synergies?: Synergy[]
  deployables?: Deployable[]
  counters?: Counter[]
  integrated?: string[]
}

export interface PilotTalent {
  id: string
  name: string
  icon?: string
  icon_url?: string
  terse?: string
  description: string
  ranks: PilotTalentRank[]
}

export interface PilotSkill {
  id: string
  name: string
  description: string
  detail: string
  family: 'str' | 'dex' | 'int' | 'cha'
}

export interface PilotGear {
  id: string
  name: string
  type: 'gear'
  description: string
  tags?: Tag[]
  actions?: Action[]
  bonuses?: Bonus[]
  deployables?: Deployable[]
}

export interface PilotArmor {
  id: string
  name: string
  type: 'armor'
  description: string
  hp_bonus?: number
  armor?: number
  speed?: number
  speed_bonus?: number
  evasion?: number
  edef?: number
  tags?: Tag[]
  actions?: Action[]
  bonuses?: Bonus[]
}

export interface PilotWeapon {
  id: string
  name: string
  type: 'weapon'
  description: string
  range: Range[]
  damage: Damage[]
  tags?: Tag[]
  actions?: Action[]
  effect?: string
}

// ─── Frame / Mech ─────────────────────────────────────────────────────────────

export interface MechStats {
  size: LancerSize
  structure: number
  stress: number
  armor: number
  hp: number
  evasion: number
  edef: number
  heatcap: number
  repcap: number
  sensor_range: number
  tech_attack: number
  save: number
  speed: number
  sp: number
}

export interface MechMount {
  mount_type: MountType
  flexible?: boolean
  name?: string
}

export interface Trait {
  name: string
  description: string
  actions?: Action[]
  bonuses?: Bonus[]
  synergies?: Synergy[]
  deployables?: Deployable[]
  counters?: Counter[]
  integrated?: string[]
}

export interface CoreSystem {
  name: string
  active_name: string
  active_effect: string
  activation: Action['activation']
  description?: string
  deactivation?: Action['activation']
  use?: string
  active_actions?: Action[]
  active_bonuses?: Bonus[]
  active_synergies?: Synergy[]
  passive_name?: string
  passive_effect?: string
  passive_actions?: Action[]
  passive_bonuses?: Bonus[]
  passive_synergies?: Synergy[]
  tags?: Tag[]
  deployables?: Deployable[]
  counters?: Counter[]
  integrated?: string[]
}

export interface Frame {
  id: string
  source: string
  name: string
  mechtype: string[]
  license_level: number
  y_pos?: number
  description: string
  mounts: MountType[]
  stats: MechStats
  traits: Trait[]
  core_system: CoreSystem
  image_url?: string
  other_art?: { tag?: string; img: string }[]
}

// ─── Weapons ─────────────────────────────────────────────────────────────────

export interface MechWeapon {
  id: string
  source: string
  name: string
  mount: MountType
  type: 'Melee' | 'CQB' | 'Rifle' | 'Cannon' | 'Launcher' | 'Nexus' | 'Improvised'
  damage?: Damage[]
  range?: Range[]
  tags?: Tag[]
  description: string
  effect?: string
  on_attack?: string
  on_hit?: string
  on_crit?: string
  actions?: Action[]
  bonuses?: Bonus[]
  synergies?: Synergy[]
  deployables?: Deployable[]
  counters?: Counter[]
  integrated?: string[]
  sp?: number
  no_attack?: boolean
  no_mods?: boolean
  no_core_bonus?: boolean
  license_level: number
}

// ─── Systems ─────────────────────────────────────────────────────────────────

export interface MechSystem {
  id: string
  source: string
  name: string
  type: SystemType
  sp: number
  license_level: number
  description: string
  effect?: string
  tags?: Tag[]
  actions?: Action[]
  bonuses?: Bonus[]
  synergies?: Synergy[]
  deployables?: Deployable[]
  counters?: Counter[]
  integrated?: string[]
}

// ─── Core Bonuses ─────────────────────────────────────────────────────────────

export interface CoreBonus {
  id: string
  source: string
  name: string
  effect: string
  description: string
  mounted_effect?: string
  actions?: Action[]
  bonuses?: Bonus[]
  synergies?: Synergy[]
  deployables?: Deployable[]
  counters?: Counter[]
  integrated?: string[]
}

// ─── NPC ─────────────────────────────────────────────────────────────────────

export type NpcStatKey = 'activations' | 'armor' | 'hp' | 'evade' | 'edef' | 'heatcap' | 'speed' | 'sensor' | 'save' | 'hull' | 'agility' | 'systems' | 'engineering' | 'size'

export interface NpcStat {
  [key: string]: (number | null)[]
}

export interface NpcFeatureEffect {
  name?: string
  detail: string
}

export interface NpcFeature {
  id: string
  name: string
  origin: {
    type: 'Class' | 'Template'
    name: string
    base: boolean
  }
  base?: boolean
  type: 'Trait' | 'Reaction' | 'System' | 'Tech' | 'Weapon'
  effect?: string
  bonus?: Record<string, number | string>
  override?: Record<string, boolean>
  tags?: Tag[]
  locked?: boolean
  hide_active?: boolean
  // weapon-specific
  damage?: (Damage[] | null)[]
  range?: (Range[] | null)[]
  accuracy?: (number | null)[]
  attack_bonus?: (number | null)[]
  // reaction/tech
  trigger?: string
  action_type?: string
  recharge?: number
}

export interface NpcClass {
  id: string
  name: string
  role: 'striker' | 'controller' | 'support' | 'defender' | 'artillery' | 'biological'
  info: {
    flavor?: string
    tactics?: string
    diy?: string
  }
  stats: NpcStat
  base_features: string[]
  optional_features: string[]
  power: number
}

export interface NpcTemplate {
  id: string
  name: string
  description: string
  base_features: string[]
  optional_features: string[]
  power: number
}

// ─── Encounters & Missions ────────────────────────────────────────────────────

export interface EncounterNpc {
  npcId: string
  templateIds: string[]
  tier: 1 | 2 | 3
  name?: string
  notes?: string
}

export interface Encounter {
  id: string
  name: string
  description?: string
  labels?: string[]
  location?: string
  notes?: string
  npcs: EncounterNpc[]
  environment?: string
  sitrep?: string
  createdAt: string
  updatedAt: string
}

export interface MissionStep {
  id: string
  kind: 'encounter' | 'rest' | 'freeplay'
  encounterId?: string
  name: string
  description?: string
}

export interface Mission {
  id: string
  name: string
  description?: string
  labels?: string[]
  notes?: string
  steps: MissionStep[]
  createdAt: string
  updatedAt: string
}

// ─── Pilot Record (player-owned) ─────────────────────────────────────────────

export interface ActivePilotSkill {
  id: string
  rank: number
}

export interface ActivePilotTalent {
  id: string
  rank: number
}

export interface ActiveMechSystem {
  id: string
}

export interface ActiveMechWeapon {
  id: string
  mod?: string
}

export interface ActiveMount {
  mount_type: MountType
  weapons: ActiveMechWeapon[]
}

export interface ActiveMech {
  id: string
  name: string
  frameId: string
  mounts: ActiveMount[]
  systems: ActiveMechSystem[]
  coreBonuses: string[]
  notes?: string
}

export interface ActivePilot {
  id: string
  callsign: string
  name: string
  level: number
  background?: string
  history?: string
  notes?: string
  skills: ActivePilotSkill[]
  talents: ActivePilotTalent[]
  gear: string[]
  armor?: string
  weapons: string[]
  mechs: ActiveMech[]
  activeMechId?: string
  createdAt: string
  updatedAt: string
}

// ─── Homebrew ────────────────────────────────────────────────────────────────

export interface HomebrewPackage {
  id: string
  name: string
  author?: string
  version?: string
  description?: string
  website?: string
  active: boolean
  frames?: Frame[]
  weapons?: MechWeapon[]
  systems?: MechSystem[]
  coreBonuses?: CoreBonus[]
  npcClasses?: NpcClass[]
  npcTemplates?: NpcTemplate[]
  npcFeatures?: NpcFeature[]
  talents?: PilotTalent[]
  pilotGear?: (PilotGear | PilotArmor | PilotWeapon)[]
  manufacturers?: Manufacturer[]
  tags?: TagDef[]
}

// ─── App State ────────────────────────────────────────────────────────────────

export type AppView =
  | 'compendium'
  | 'pilots'
  | 'gm'
  | 'homebrew'
  | 'settings'

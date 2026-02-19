import type { Faction } from '@/types/blades'

const now = new Date().toISOString()

export const CORE_FACTIONS: Omit<Faction, 'crewStatus' | 'createdAt' | 'updatedAt'>[] = [
  // ── Criminal Underworld ───────────────────────────────────────────────────
  {
    id: 'lampblacks',
    name: 'The Lampblacks',
    tier: 2, hold: 'weak',
    category: 'criminal',
    description: 'A street gang that controls part of Crow\'s Foot. They deal in extortion, theft, and vice. Currently in a brutal gang war with the Red Sashes.',
    headquarters: "Crow's Foot",
    goals: 'Destroy the Red Sashes. Expand territory throughout the Docks.',
    isCore: true,
  },
  {
    id: 'red_sashes',
    name: 'The Red Sashes',
    tier: 2, hold: 'weak',
    category: 'criminal',
    description: 'A gang based around a dueling school. They train Skovlan street fighters and control territory in Crow\'s Foot. At war with the Lampblacks.',
    headquarters: "Crow's Foot",
    goals: 'Destroy the Lampblacks. Establish a legitimate dueling academy.',
    isCore: true,
  },
  {
    id: 'crows',
    name: 'The Crows',
    tier: 3, hold: 'strong',
    category: 'criminal',
    description: 'A large, established criminal organization that controls gambling, smuggling, and extortion throughout much of Doskvol.',
    goals: 'Maintain dominance over criminal enterprise. Expand into political influence.',
    isCore: true,
  },
  {
    id: 'fog_hounds',
    name: 'The Fog Hounds',
    tier: 2, hold: 'strong',
    category: 'criminal',
    description: 'A smuggling crew known for moving goods through the canals and fog-shrouded harbor with minimal interference.',
    isCore: true,
  },
  {
    id: 'silver_nails',
    name: 'The Silver Nails',
    tier: 1, hold: 'weak',
    category: 'criminal',
    description: 'A small crew of assassins-for-hire, primarily composed of Skovlan veterans.',
    isCore: true,
  },
  {
    id: 'billhooks',
    name: 'The Billhooks',
    tier: 2, hold: 'strong',
    category: 'streets',
    description: 'A brutal gang known for their signature hooked weapons and savage violence. They control parts of Barrowcleft and the Docks.',
    goals: 'Dominate the labor gangs. Extort the longshoremen\'s guilds.',
    isCore: true,
  },
  // ── Institutions ──────────────────────────────────────────────────────────
  {
    id: 'bluecoats',
    name: 'The Bluecoats',
    tier: 3, hold: 'strong',
    category: 'institutions',
    description: 'The city watch of Doskvol. They maintain order (and their own pockets) through a combination of genuine law enforcement and corruption.',
    headquarters: 'Precinct Houses throughout Doskvol',
    goals: 'Keep the peace. Collect bribes. Avoid scandal.',
    isCore: true,
  },
  {
    id: 'iruvian_consulate',
    name: 'The Iruvian Consulate',
    tier: 4, hold: 'strong',
    category: 'institutions',
    description: 'The diplomatic mission of Iruvia in Doskvol. The Iruvian mages and merchants wield significant political and economic power.',
    isCore: true,
  },
  {
    id: 'the_circle_of_flame',
    name: 'The Circle of Flame',
    tier: 4, hold: 'strong',
    category: 'institutions',
    description: 'An Iruvian cult with significant presence in Doskvol. They deal in occult matters and have mysterious agenda related to fire and transformation.',
    isCore: true,
  },
  // ── Labor & Trade ─────────────────────────────────────────────────────────
  {
    id: 'dockworkers_union',
    name: 'The Dockworkers\' Union',
    tier: 2, hold: 'strong',
    category: 'labor & trade',
    description: 'The organized labor union for dock workers, sailors, and longshoremen. They have real power to shut down the harbor.',
    goals: 'Improve working conditions. Fight off gang extortion. Gain political representation.',
    isCore: true,
  },
  {
    id: 'gondoliers',
    name: 'The Gondoliers',
    tier: 2, hold: 'strong',
    category: 'labor & trade',
    description: 'The guild of canal boat operators. They move people and goods through the waterways of Doskvol, and they know every secret that travels by water.',
    isCore: true,
  },
  {
    id: 'leviathan_hunters',
    name: 'The Leviathan Hunters',
    tier: 4, hold: 'strong',
    category: 'labor & trade',
    description: 'The crews that hunt leviathans in the Void Sea to harvest electroplasm. Wealthy, dangerous, and essential to the empire\'s power.',
    isCore: true,
  },
  // ── Streets ───────────────────────────────────────────────────────────────
  {
    id: 'lost',
    name: 'The Lost',
    tier: 0, hold: 'weak',
    category: 'streets',
    description: 'Doskvol\'s underground network of Skovlan refugees and displaced people. They survive through petty crime and mutual aid.',
    isCore: true,
  },
  // ── Supernatural ──────────────────────────────────────────────────────────
  {
    id: 'spirit_wardens',
    name: 'The Spirit Wardens',
    tier: 4, hold: 'strong',
    category: 'supernatural',
    description: 'A secretive order charged with hunting ghosts and maintaining the lightning barriers around the city. They work from Bellweather Crematorium.',
    headquarters: 'Bellweather Crematorium, Dunslough',
    goals: 'Contain supernatural threats. Prevent ghost incursions. Maintain the electroplasmic industry.',
    isCore: true,
  },
  {
    id: 'church_of_ecstasy',
    name: 'The Church of Ecstasy of the Flesh',
    tier: 3, hold: 'strong',
    category: 'supernatural',
    description: 'A widespread cult that worships sensation and the body as a path to transcendence. They operate pleasure houses and practice occult rituals.',
    isCore: true,
  },
  {
    id: 'dimmer_sisters',
    name: 'The Dimmer Sisters',
    tier: 3, hold: 'strong',
    category: 'supernatural',
    description: 'Two ancient and terrifying women (or something wearing their forms) who deal in ghosts, spirits, and dark bargains.',
    headquarters: 'Dunslough',
    isCore: true,
  },
  // ── Underworld Powers ─────────────────────────────────────────────────────
  {
    id: 'the_unseen',
    name: 'The Unseen',
    tier: 4, hold: 'strong',
    category: 'underworld',
    description: 'A secretive criminal organization with tentacles throughout Doskvol\'s institutions. Nobody knows who leads them or what their true goals are.',
    isCore: true,
  },
  {
    id: 'lord_scurlock',
    name: "Lord Scurlock",
    tier: 4, hold: 'strong',
    category: 'underworld',
    description: 'An ancient vampire lord who holds an estate in Whitecrown. He is incredibly wealthy, politically connected, and utterly amoral.',
    headquarters: 'Whitecrown',
    isCore: true,
  },
]

export function buildCoreFactions(): Faction[] {
  const now = new Date().toISOString()
  return CORE_FACTIONS.map(f => ({
    ...f,
    crewStatus: 0 as const,
    createdAt: now,
    updatedAt: now,
  }))
}

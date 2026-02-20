// ─── Aurelion World Seed Data ────────────────────────────────────────────────
// The former capital of a slain Demon Lord. A city that survives by
// compartmentalizing its collapse. Nothing is fixed. Everything is redirected.

import type { Location, Faction } from '@/types/blades'

const now = new Date().toISOString()
function id(slug: string) { return `aur_${slug}` }

// ── Location IDs ─────────────────────────────────────────────────────────────
export const LOC = {
  world:    id('world'),
  city:     id('city'),
  upper:    id('upper'),
  mid:      id('mid'),
  lower:    id('lower'),
  under:    id('under'),
  // Upper City
  crownrise:  id('crownrise'),
  sanctum:    id('sanctum'),
  stonefall:  id('stonefall'),
  archivum:   id('archivum'),
  // Mid City
  wardspire:  id('wardspire'),
  runeward:   id('runeward'),
  ironline:   id('ironline'),
  guildreach: id('guildreach'),
  // Lower City
  lowlanterns: id('lowlanterns'),
  nightmarket: id('nightmarket'),
  stacks:      id('stacks'),
  drownways:   id('drownways'),
  ashfall:     id('ashfall'),
  // Undercity
  oldnexus:   id('oldnexus'),
}

// ── Locations ─────────────────────────────────────────────────────────────────
export function buildAurelionLocations(): Location[] {
  return [
    // ── World root ──────────────────────────────────────────────────────────
    {
      id: LOC.world, name: 'Aurelion', type: 'region', parentId: null,
      description: 'The former capital of a slain Demon Lord. Centuries ago a hero\'s party defeated the Demon King and liberated the land — then failed to build a stable peace. The land beyond the walls is blighted and unlivable. Aurelion survives not because it is healthy, but because it isolates its failures.',
      tags: ['demon-king-legacy', 'isolated', 'blighted-wastes', 'hero-party-aftermath'],
      notes: 'Height = legitimacy and safety. Movement between tiers is frictional. Old Nexus lies beneath everything.',
      createdAt: now, updatedAt: now,
    },

    // ── City ──────────────────────────────────────────────────────────────
    {
      id: LOC.city, name: 'Aurelion City', type: 'city', parentId: LOC.world,
      description: 'A vertically and morally layered city. 14 districts divided into Upper City, Mid City, Lower City, and Undercity. The defining belief: it is better to contain a problem than fix it.',
      tags: ['walled', 'tiered', 'rail-connected', 'institutional'],
      notes: 'Connected to two surviving cities via warded rail lines (Ironline). Most citizens never leave.',
      createdAt: now, updatedAt: now,
    },

    // ── Tier groupings ────────────────────────────────────────────────────
    {
      id: LOC.upper, name: 'Upper City', type: 'district', parentId: LOC.city,
      description: 'Legitimacy, ideology, memory. The upper reaches of Aurelion where authority is performed and history is curated. Height equals safety here.',
      tags: ['upper-tier', 'legitimate', 'ideological'],
      createdAt: now, updatedAt: now,
    },
    {
      id: LOC.mid, name: 'Mid City', type: 'district', parentId: LOC.city,
      description: 'Control, infrastructure, necessity. Where the law lives, magic is licensed, goods move, and labor is organized. The machinery of the city.',
      tags: ['mid-tier', 'infrastructure', 'control'],
      createdAt: now, updatedAt: now,
    },
    {
      id: LOC.lower, name: 'Lower City', type: 'district', parentId: LOC.city,
      description: 'Survival, crime, adaptation. Not "poor districts" — different survival mechanisms, each absorbing a different kind of pressure the city cannot resolve.',
      tags: ['lower-tier', 'survival', 'crime', 'adaptation'],
      createdAt: now, updatedAt: now,
    },
    {
      id: LOC.under, name: 'Undercity', type: 'district', parentId: LOC.city,
      description: 'The buried remnants of the Demon King\'s power. Old, sealed, not resolved. Those who go below often do not return the same.',
      tags: ['undercity', 'sealed', 'demonic', 'dangerous'],
      createdAt: now, updatedAt: now,
    },

    // ── UPPER CITY DISTRICTS ──────────────────────────────────────────────
    {
      id: LOC.crownrise, name: 'Crownrise', type: 'site', parentId: LOC.upper,
      description: 'Ceremonial power and public spectacle. Authority as theater. Parades, proclamations, and monuments to the Hero\'s party fill wide boulevards. Legitimacy is performed here daily.',
      tags: ['ceremony', 'spectacle', 'monuments', 'theater-of-power'],
      controlledBy: 'aur_fac_ruling',
      createdAt: now, updatedAt: now,
    },
    {
      id: LOC.sanctum, name: 'High Sanctum', type: 'site', parentId: LOC.upper,
      description: 'Faith, charity, demon-hunting, and moral oversight. The Church founded by the original Cleric. Grand cathedral, healing wards, and the Order of the Pale Seal — the city\'s sanctioned demon-hunters.',
      tags: ['church', 'faith', 'demon-hunters', 'charity', 'moral-oversight'],
      controlledBy: 'aur_fac_sanctum',
      createdAt: now, updatedAt: now,
    },
    {
      id: LOC.stonefall, name: 'Stonefall', type: 'site', parentId: LOC.upper,
      description: 'Decaying noble estates and the abandoned prison. Old power rots here. Ancient families cling to titles that carry less weight each decade. The prison has been sealed for thirty years.',
      tags: ['nobles', 'decay', 'old-money', 'abandoned-prison'],
      createdAt: now, updatedAt: now,
    },
    {
      id: LOC.archivum, name: 'Archivum', type: 'site', parentId: LOC.upper,
      description: 'Records, identity, erasure. Reality is defined on paper here. The Archivum controls who exists legally in Aurelion — birth records, property deeds, licenses, and the quiet power to unmake a person by altering a ledger.',
      tags: ['records', 'identity', 'bureaucracy', 'erasure', 'paper-power'],
      controlledBy: 'aur_fac_archivum',
      createdAt: now, updatedAt: now,
    },

    // ── MID CITY DISTRICTS ─────────────────────────────────────────────────
    {
      id: LOC.wardspire, name: 'Wardspire', type: 'site', parentId: LOC.mid,
      description: 'Courts, Bluecoat HQ, central prison. Law made concrete. The Wardspire enforces law across all tiers, though its presence thins in the Lower City and disappears entirely in the Drownways.',
      tags: ['law', 'bluecoats', 'courts', 'prison', 'enforcement'],
      controlledBy: 'aur_fac_wardspire',
      createdAt: now, updatedAt: now,
    },
    {
      id: LOC.runeward, name: 'Runeward', type: 'site', parentId: LOC.mid,
      description: 'Licensed magic, ward engines, inspections. The institution founded by the original Mage. Magic is infrastructure here — not wonder. Unlicensed casting is illegal; inspectors patrol ward maintenance across the city.',
      tags: ['magic', 'licensed', 'ward-engines', 'inspections', 'regulated'],
      controlledBy: 'aur_fac_runeward',
      createdAt: now, updatedAt: now,
    },
    {
      id: LOC.ironline, name: 'Ironline', type: 'site', parentId: LOC.mid,
      description: 'Rail hub connecting Aurelion to the two other surviving cities. Movement is privilege. The warded rail lines pass through blighted wastes, making rail travel the only safe way out. Ironline controls that movement.',
      tags: ['rail', 'transit', 'warded', 'movement', 'privilege'],
      controlledBy: 'aur_fac_ironline',
      createdAt: now, updatedAt: now,
    },
    {
      id: LOC.guildreach, name: 'Guildreach', type: 'site', parentId: LOC.mid,
      description: 'Industry, labor contracts, and controlled production. Where goods are made and labor is formally organized — and exploited. The Guilds set wages, working hours, and which trades are permitted in each district.',
      tags: ['industry', 'guilds', 'labor', 'production', 'exploitation'],
      controlledBy: 'aur_fac_guildreach',
      createdAt: now, updatedAt: now,
    },

    // ── LOWER CITY DISTRICTS ───────────────────────────────────────────────
    {
      id: LOC.lowlanterns, name: 'Low Lanterns', type: 'site', parentId: LOC.lower,
      description: 'Pub district. Crews, street justice, social violence. The city\'s pressure-release valve for organized violence. Rival crews negotiate territory here. The Bluecoats make arrests when convenient, ignore problems when paid.',
      tags: ['pubs', 'crews', 'street-violence', 'pressure-release', 'informal-justice'],
      createdAt: now, updatedAt: now,
    },
    {
      id: LOC.nightmarket, name: 'Night Market', type: 'site', parentId: LOC.lower,
      description: 'Dense enclave. Gambling, family networks, pop-up stalls, folk healing, quiet crime. The city\'s unofficial commerce. Illicit goods move here. Family connections count for more than coin. Unlicensed magic is tolerated.',
      tags: ['market', 'gambling', 'folk-healing', 'unlicensed-magic', 'family-networks', 'illicit'],
      createdAt: now, updatedAt: now,
    },
    {
      id: LOC.stacks, name: 'The Stacks', type: 'site', parentId: LOC.lower,
      description: 'Vertical overcrowding. Labor reservoir. Elvish refugees in upper levels tend rooftop gardens and hold long memory and quiet resentment. The Stacks absorbs excess population the city cannot place elsewhere.',
      tags: ['overcrowding', 'labor', 'elvish-refugees', 'rooftop-gardens', 'vertical'],
      createdAt: now, updatedAt: now,
    },
    {
      id: LOC.drownways, name: 'Drownways', type: 'site', parentId: LOC.lower,
      description: 'Flooded low district. Canals, smuggling routes, waste transport. The city\'s waste and secrets flow through here. Canal networks connect to below-street passages. The Bluecoats rarely enter without reason.',
      tags: ['flooded', 'canals', 'smuggling', 'waste', 'secrecy'],
      createdAt: now, updatedAt: now,
    },
    {
      id: LOC.ashfall, name: 'Ashfall', type: 'site', parentId: LOC.lower,
      description: 'Blight containment. Quarantine, failing wards, quiet suffering. Where the demon-king\'s corruption still seeps through. Church wardens maintain failing wards. Residents cannot leave without a health writ. The city\'s supernatural failure, contained.',
      tags: ['blight', 'quarantine', 'failing-wards', 'corruption', 'suffering', 'containment'],
      controlledBy: 'aur_fac_sanctum',
      createdAt: now, updatedAt: now,
    },

    // ── UNDERCITY ──────────────────────────────────────────────────────────
    {
      id: LOC.oldnexus, name: 'Old Nexus', type: 'site', parentId: LOC.under,
      description: 'The buried heart of the Demon King\'s power. Sealed. Not resolved. Runeward\'s deepest wards hold here — barely. Treasure hunters, cultists, and the desperate venture below. Most don\'t come back unchanged.',
      tags: ['demon-king', 'sealed', 'nexus', 'dangerous', 'corruption', 'ruins'],
      createdAt: now, updatedAt: now,
    },
  ]
}

// ── Factions ──────────────────────────────────────────────────────────────────
export function buildAurelionFactions(): Omit<Faction, 'crewStatus' | 'createdAt' | 'updatedAt'>[] {
  return [
    // ── GOVERNMENT / INSTITUTIONS ─────────────────────────────────────────
    {
      id: 'aur_fac_ruling',
      name: 'The Ruling Structure',
      tier: 5, hold: 'strong',
      category: 'government',
      description: 'Symbolic authority descended from the original Hero. The seat of legitimate power — but mostly ceremonial. Actual decisions are brokered between the Church, Wardspire, and Runeward. The Ruling Structure legitimizes; it rarely commands.',
      headquarters: 'Crownrise',
      goals: 'Maintain the appearance of unified authority. Prevent any single institution from seizing full control.',
      threats: 'Institutional drift rendering the ruling structure irrelevant. Public loss of faith in the Hero\'s legacy.',
      isCore: true,
    },
    {
      id: 'aur_fac_sanctum',
      name: 'High Sanctum',
      tier: 4, hold: 'strong',
      category: 'institutions',
      description: 'The Church founded by the original Cleric. Controls faith, charity, moral oversight, and demon-hunting through the Order of the Pale Seal. Operates in High Sanctum and maintains a presence in Ashfall managing blight containment.',
      headquarters: 'High Sanctum',
      goals: 'Moral authority over all institutions. Expand the Order of the Pale Seal. Keep Ashfall contained.',
      threats: 'Failing wards in Ashfall. Runeward encroaching on supernatural jurisdiction. Loss of public faith.',
      isCore: true,
    },
    {
      id: 'aur_fac_wardspire',
      name: 'Wardspire',
      tier: 4, hold: 'strong',
      category: 'government',
      description: 'Military order evolved from the original Commander\'s forces into the city\'s law enforcement. Bluecoats, courts, and the central prison. Enforces law everywhere — though unevenly. Power flows through punishment and the threat of it.',
      headquarters: 'Wardspire District',
      goals: 'Maintain order through visible authority. Expand jurisdiction into areas that currently resist Wardspire presence.',
      threats: 'Corruption within the Bluecoats. Night Market and Low Lanterns undermining authority. Political pressure from Guildreach.',
      isCore: true,
    },
    {
      id: 'aur_fac_runeward',
      name: 'Runeward',
      tier: 3, hold: 'strong',
      category: 'institutions',
      description: 'The magic-regulating institution founded by the original Mage. Controls licensed magic, ward engine maintenance, and inspections across all districts. Magic is infrastructure — not wonder — and Runeward controls the infrastructure.',
      headquarters: 'Runeward District',
      goals: 'Maintain monopoly on licensed magic. Expand ward coverage into failing areas. Suppress unlicensed practice.',
      threats: 'Old Nexus leaking demon-corruption that overwhelms wards. Night Market\'s folk healers operating unlicensed. Runeward budget cuts.',
      isCore: true,
    },
    {
      id: 'aur_fac_archivum',
      name: 'The Archivum',
      tier: 3, hold: 'strong',
      category: 'institutions',
      description: 'Controls records, identity, and legal existence. Reality is defined on paper. The Archivum can erase a person — revoke citizenship, nullify property, expunge records. Quiet power. No armies needed when you control who exists.',
      headquarters: 'Archivum District',
      goals: 'Maintain control of identity infrastructure. Expand record-keeping to the Lower City. Commodify access to records.',
      threats: 'Night Market forgers undercutting official documents. Political pressure to falsify records for powerful clients.',
      isCore: true,
    },

    // ── LABOR & TRADE ─────────────────────────────────────────────────────
    {
      id: 'aur_fac_guildreach',
      name: 'Guildreach',
      tier: 3, hold: 'weak',
      category: 'labor & trade',
      description: 'The guild federation controlling industry, labor contracts, and production quotas. Formally legitimate. Functionally exploitative. Draws labor from The Stacks and sets wages that keep workers dependent. Rivals Wardspire for mid-city influence.',
      headquarters: 'Guildreach District',
      goals: 'Expand labor contracts into informal economies. Break Stacks Collective organizing. Secure preferred rail access through Ironline.',
      threats: 'Labor unrest. Stacks Collective building power. Wardspire investigating guild bribery.',
      isCore: true,
    },
    {
      id: 'aur_fac_ironline',
      name: 'Ironline Authority',
      tier: 3, hold: 'strong',
      category: 'labor & trade',
      description: 'Controls the warded rail lines connecting Aurelion to the two surviving cities. Movement is privilege and Ironline controls that privilege. Rail passes, cargo inspection, and customs enforcement generate enormous revenue.',
      headquarters: 'Ironline District',
      goals: 'Maintain monopoly on inter-city transit. Increase rail-pass prices. Prevent smuggling that bypasses official cargo.',
      threats: 'Drownways syndicate building smuggling routes that bypass customs. Blight expansion threatening rail ward integrity.',
      isCore: true,
    },
    {
      id: 'aur_fac_stacks',
      name: 'Stacks Collective',
      tier: 1, hold: 'weak',
      category: 'labor & trade',
      description: 'An informal labor organizing body centered in The Stacks, with growing support among elvish refugees. Quietly building mutual aid networks, strike funds, and a collective memory of grievance. Guildreach wants them destroyed.',
      headquarters: 'The Stacks',
      goals: 'Improve working conditions. Establish formal elvish representation. Build enough power to negotiate with Guildreach.',
      threats: 'Wardspire infiltration. Guildreach pressure. Internal division between human labor and elvish factions.',
      isCore: true,
    },

    // ── STREETS ────────────────────────────────────────────────────────────
    {
      id: 'aur_fac_lanterns',
      name: 'Low Lantern Crews',
      tier: 2, hold: 'weak',
      category: 'streets',
      description: 'Collective term for the rotating constellation of street crews that control territory in Low Lanterns. They manage extortion, debt collection, and street-level violence. Frequently at war with each other; occasionally united against outside threats.',
      headquarters: 'Low Lanterns',
      goals: 'Control more territory. Extract tribute from businesses. Avoid full Wardspire crackdowns.',
      threats: 'Wardspire consolidation efforts. Rival crews. Night Market encroaching on their income streams.',
      isCore: true,
    },
    {
      id: 'aur_fac_drownways',
      name: 'Drownways Syndicate',
      tier: 2, hold: 'weak',
      category: 'criminal',
      description: 'Smuggling operation built around the canal networks of the Drownways. Moves illicit goods, provides underground transit, and handles waste disposal for parties that need discretion. Operates below Wardspire notice — mostly.',
      headquarters: 'Drownways',
      goals: 'Expand canal routes. Establish a reliable channel into Old Nexus for artifact recovery. Avoid Wardspire crackdowns.',
      threats: 'Ironline Authority lobbying for canal inspection rights. Old Nexus instability disrupting lower routes.',
      isCore: true,
    },

    // ── UNDERWORLD ─────────────────────────────────────────────────────────
    {
      id: 'aur_fac_nightmarket',
      name: 'Night Market',
      tier: 2, hold: 'strong',
      category: 'underworld',
      description: 'The dense informal economy of the Night Market district. Family networks, forgers, folk healers, unlicensed magic practitioners, and quiet crime. Handles the unofficial problems the city cannot acknowledge. More stable than it looks.',
      headquarters: 'Night Market',
      goals: 'Maintain independence from Wardspire and Runeward. Protect family networks. Quietly expand into Guildreach\'s blind spots.',
      threats: 'Archivum cracking down on forged documents. Runeward inspectors raiding folk healers. Wardspire informants.',
      isCore: true,
    },

    // ── SUPERNATURAL ──────────────────────────────────────────────────────
    {
      id: 'aur_fac_stonefall',
      name: 'Stonefall Houses',
      tier: 1, hold: 'weak',
      category: 'other',
      description: 'The decaying noble families of Stonefall, clinging to old titles and older debts. Some dabble in forbidden deals — with Old Nexus, with Night Market, with anyone who can restore their fading influence. Individually weak; collectively unpredictable.',
      headquarters: 'Stonefall',
      goals: 'Restore political relevance. Recover lost estates. Access Old Nexus resources without anyone finding out.',
      threats: 'Further decay. Younger families absorbing their assets. Wardspire investigating old crimes.',
      isCore: true,
    },
    {
      id: 'aur_fac_nexus',
      name: 'Old Nexus',
      tier: 4, hold: 'weak',
      category: 'supernatural',
      description: 'Not a faction in the traditional sense — more a pressure. The sealed heart of the Demon King\'s power. Something still stirs below the wards. Cultists, relic hunters, and the desperate are drawn to it. What emerges from the Nexus rarely serves human interests.',
      headquarters: 'Old Nexus',
      goals: 'Unknown. Expansion. Return. The wards hold — for now.',
      threats: 'Runeward wards failing. Cultists accelerating whatever process is occurring below.',
      isCore: true,
    },
    {
      id: 'aur_fac_seal',
      name: 'Order of the Pale Seal',
      tier: 2, hold: 'strong',
      category: 'supernatural',
      description: 'The Church\'s demon-hunting order. Trained to detect, contain, and cleanse demonic corruption. Operates with religious authority above Wardspire in matters of blight and possession. Currently stretched thin between Ashfall and reports from the Drownways.',
      headquarters: 'High Sanctum',
      goals: 'Contain Ashfall blight. Investigate Nexus-related incidents. Maintain Church authority over supernatural jurisdiction.',
      threats: 'Overwhelmed by Ashfall\'s expansion. Political friction with Runeward over who has authority over demonic magic.',
      isCore: true,
    },
  ]
}

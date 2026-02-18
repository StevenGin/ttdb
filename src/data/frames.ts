import type { Frame } from '@/types/lancer'

export const FRAMES: Frame[] = [
  {
    id: 'gms_standard_pattern_i',
    source: 'GMS',
    name: 'Standard Pattern I "Everest"',
    mechtype: ['Balanced'],
    license_level: 0,
    description:
      'The GMS Standard Pattern I "Everest" is the most common mech frame in the known galaxy. Designed for reliability and interoperability, the Everest excels at nothing in particular but fails at nothing either. It is the backbone of every planetary militia, mercenary company, and colonial defense force.',
    mounts: ['main/aux', 'main', 'flex', 'heavy'],
    stats: {
      size: 1,
      structure: 4,
      stress: 4,
      armor: 0,
      hp: 10,
      evasion: 8,
      edef: 8,
      heatcap: 6,
      repcap: 5,
      sensor_range: 10,
      tech_attack: 0,
      save: 10,
      speed: 4,
      sp: 6,
    },
    traits: [
      {
        name: 'Initiative',
        description:
          'Once per round, when you make a skill check, you may roll an additional d6 and keep the highest result.',
      },
    ],
    core_system: {
      name: 'HYPERSPEC Fuel Injector',
      description:
        'Standard GMS emergency acceleration system.',
      active_name: 'Burn It',
      active_effect:
        'Until the end of your next turn, gain +4 Speed and Immunity to the Slowed condition. At the end of this effect, take 2 heat.',
      activation: 'quick',
      tags: [{ id: 'tg_limited', val: 1 }],
    },
  },
  {
    id: 'ipsn_blackbeard',
    source: 'IPS-N',
    name: 'Blackbeard',
    mechtype: ['Controller', 'Striker'],
    license_level: 2,
    description:
      'The Blackbeard is the ultimate boarding and close-quarters combat mech, designed to lock down enemies and tear them apart at arm\'s reach. Its grappling hook, heavy frame, and devastating melee capabilities make it the terror of any battlefield — up close.',
    mounts: ['aux/aux', 'main', 'heavy'],
    stats: {
      size: 1,
      structure: 4,
      stress: 4,
      armor: 1,
      hp: 14,
      evasion: 7,
      edef: 7,
      heatcap: 5,
      repcap: 5,
      sensor_range: 5,
      tech_attack: -2,
      save: 12,
      speed: 4,
      sp: 5,
    },
    traits: [
      {
        name: 'Grapple Hook',
        description:
          'When you make a grapple attack, you can target characters up to 5 spaces away, pulling them adjacent to you. If the target is larger than you, you are pulled adjacent to them instead.',
      },
      {
        name: 'Chain Axe',
        description:
          'You have a CHAIN AXE integrated weapon (Main Melee, 2d6+2 kinetic, Reliable 2, Threat 1).',
      },
    ],
    core_system: {
      name: 'Aggressive System Sync',
      active_name: 'Come At Me',
      active_effect:
        'For the rest of this scene, all your melee attacks gain Knockback 3 and deal +1d6 bonus damage on hit. Additionally, any character that starts their turn grappled by you takes 4 kinetic damage.',
      activation: 'full',
    },
  },
  {
    id: 'ssc_death_s_head',
    source: 'SSC',
    name: "Death's Head",
    mechtype: ['Artillery'],
    license_level: 2,
    description:
      "The Death's Head is SSC's long-range precision platform. Designed to identify and eliminate high-value targets before they know they're being hunted, it combines extreme sensor range with devastating kinetic strike capability.",
    mounts: ['aux', 'main/aux', 'superheavy'],
    stats: {
      size: 1,
      structure: 4,
      stress: 4,
      armor: 0,
      hp: 8,
      evasion: 8,
      edef: 10,
      heatcap: 6,
      repcap: 4,
      sensor_range: 20,
      tech_attack: 1,
      save: 10,
      speed: 5,
      sp: 7,
    },
    traits: [
      {
        name: 'Spotter',
        description:
          'Once per round, when you take the Boost action, you may spot an enemy within Sensors. Spotted enemies grant cover only to themselves, not adjacent allies, until the end of your next turn.',
      },
      {
        name: 'Hunter',
        description:
          "Once per round, the first time you deal damage to a character you Spotted this scene, you deal +1d6 bonus damage.",
      },
    ],
    core_system: {
      name: 'Rolling Thunder',
      active_name: 'Mark and Strike',
      active_effect:
        'Target a character you can see within Sensors. Until the end of the scene, that character is your mark. Any attack you make against your mark ignores cover and light obscurement, and crits on 18+ (natural). You can only have one mark at a time.',
      activation: 'quick',
    },
  },
  {
    id: 'horus_goblin',
    source: 'HORUS',
    name: 'Goblin',
    mechtype: ['Controller', 'Support'],
    license_level: 2,
    description:
      "The Goblin is HORUS's dedicated hacking and electronic warfare platform. Small, fast, and terrifyingly effective at subverting enemy systems, the Goblin exists in the space between human and machine intelligence. Its pilots often report a strange intimacy with the machine mind.",
    mounts: ['aux', 'aux/aux'],
    stats: {
      size: 'half',
      structure: 4,
      stress: 4,
      armor: 0,
      hp: 6,
      evasion: 10,
      edef: 12,
      heatcap: 4,
      repcap: 3,
      sensor_range: 20,
      tech_attack: 2,
      save: 12,
      speed: 5,
      sp: 8,
    },
    traits: [
      {
        name: 'Remote Processing',
        description:
          'You may take tech actions against characters within Sensors, even if they are not in range of your tech weapons.',
      },
      {
        name: 'Override',
        description:
          'When you successfully Invade a target, you may immediately take one of the following bonus actions as a free action: Bolster, Fragment Signal, or Scan.',
      },
    ],
    core_system: {
      name: 'Reality Carver',
      active_name: 'Flay Reality',
      active_effect:
        'Choose a character within Sensors. That character is pulled into a pocket dimension — they are removed from the battlefield, untargetable, and cannot take actions. At the start of their next turn, they are returned to their original space. While in the pocket dimension, you can communicate with them, but nothing else can reach them.',
      activation: 'full',
      tags: [{ id: 'tg_limited', val: 1 }],
    },
  },
  {
    id: 'ha_sherman',
    source: 'HA',
    name: 'Sherman',
    mechtype: ['Defender'],
    license_level: 2,
    description:
      "The Sherman is Harrison Armory's frontline combat frame, designed for one purpose: taking and holding ground. Heavily armored and armed with powerful integrated weapons, the Sherman turns every battlefield it enters into a zone of denial.",
    mounts: ['main/aux', 'heavy', 'heavy'],
    stats: {
      size: 2,
      structure: 4,
      stress: 4,
      armor: 2,
      hp: 14,
      evasion: 6,
      edef: 8,
      heatcap: 8,
      repcap: 6,
      sensor_range: 10,
      tech_attack: -2,
      save: 12,
      speed: 3,
      sp: 5,
    },
    traits: [
      {
        name: 'Bulwark',
        description:
          'When an allied character within 1 space of you would be hit by an attack, you can spend your Reaction to redirect the attack to yourself.',
      },
      {
        name: 'Immovable',
        description:
          'You are immune to involuntary movement caused by push, pull, or knockback effects.',
      },
    ],
    core_system: {
      name: 'Threat Projector',
      active_name: 'Death Zone',
      active_effect:
        'Until the end of the scene, all characters that end their turn within 3 spaces of you immediately take 4 energy damage. Allied characters are immune to this effect.',
      activation: 'quick',
    },
  },
]

export interface LegendTier {
  id: string;
  name: string;
  nameShort: string;
  domain: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  pickRate: number;
  day2Conversion: number;
  topCut: string;
  summary: string;
  matchups: { against: string; result: 'favorable' | 'even' | 'unfavorable' }[];
  keyCards: string[];
  strategy: string;
  imageUrl?: string;
}

// On conserve les données sources internes, mais on supprime le champ winRate à l'export
type RawLegendTier = LegendTier & { winRate: number };

// Meta après Vegas Regional - Mars 2026
// Source: Vegas Regional Qualifier (1670 players)
export const RAW_TIER_LIST: RawLegendTier[] = [
  // TIER S - Meta Defining
  {
    id: 'SFD-185',
    name: 'Draven, Glorious Executioner',
    nameShort: 'Draven',
    domain: 'Fury',
    tier: 'S',
    winRate: 62.4,
    pickRate: 13.0,
    day2Conversion: 37.5,
    topCut: 'Gagnant + 4 Top 4',
    summary: 'Le deck dominant du meta. Aggressive avec Spinning Axe + Kaisa Survivor pour draw. Gère le board et finish avec Draven.',
    matchups: [
      { against: 'Irelia', result: 'favorable' },
      { against: 'Ezreal', result: 'favorable' },
      { against: 'Kai\'Sa', result: 'even' },
    ],
    keyCards: ['Draven Vanquisher', 'Spinning Axe', 'Kaisa Survivor', 'Tideturner', 'Treasure Hunter'],
    strategy: '祭ons un board early avec les Fury units. Utilisez Spinning Axe pour draw et Kaisa Survivor pour tempo. Finish avec Draven une fois established.'
  },
  {
    id: 'SFD-195',
    name: 'Irelia, Blade Dancer',
    nameShort: 'Irelia',
    domain: 'Order',
    tier: 'S',
    winRate: 54.1,
    pickRate: 7.8,
    day2Conversion: 25.3,
    topCut: 'Top 4 + Top 8',
    summary: 'Weaponmaster deck très puissant. Blade Dancer crée des copies avec chaque spell. Flexibel entre aggro et control.',
    matchups: [
      { against: 'Draven', result: 'even' },
      { against: 'Ezreal', result: 'favorable' },
      { against: 'Jax', result: 'favorable' },
    ],
    keyCards: ['Blade Dancer', 'Blade Rush', 'Homecoming', 'Greenglade Caretaker'],
    strategy: 'Spammez des spells bon marché pour créer des Blade Surges. Stackez-les sur une unité pour du massive damage.'
  },
  {
    id: 'SFD-208',
    name: 'Ezreal, Prodigal Explorer',
    nameShort: 'Ezreal',
    domain: 'Cunning',
    tier: 'S',
    winRate: 51.0,
    pickRate: 4.4,
    day2Conversion: 16.6,
    topCut: 'Gagnant + Top 8',
    summary: 'Deck versatile avec Ezreal poke et card draw. Bon matchup vs Draven avec les bon tools.',
    matchups: [
      { against: 'Draven', result: 'favorable' },
      { against: 'Kai\'Sa', result: 'favorable' },
      { against: 'Irelia', result: 'unfavorable' },
    ],
    keyCards: ['Ezreal', 'Mystic Shot', 'Rally', 'Deep Meditation'],
    strategy: 'Poke avec Ezreal et spells tout en buildant votre board. Utilisez Rally pour des attaques surprises.'
  },
  // TIER A - Strong Performers
  {
    id: 'OGN-247',
    name: 'Kai\'Sa, Daughter of the Void',
    nameShort: 'Kai\'Sa',
    domain: 'Void',
    tier: 'A',
    winRate: 50.2,
    pickRate: 5.8,
    day2Conversion: 19.8,
    topCut: '2x Top 16',
    summary: 'Control deck excellent pour counter Draven. Void swarm + removal massifs.',
    matchups: [
      { against: 'Draven', result: 'favorable' },
      { against: 'Irelia', result: 'even' },
      { against: 'Ezreal', result: 'unfavorable' },
    ],
    keyCards: ['Kaisa Voidborn', 'Void Seeker', 'Consume', 'Riftwalk'],
    strategy: 'Survive early avec des removals. Build vers Kai\'Sa late game pour finish.'
  },
  {
    id: 'OGS-19',
    name: 'Master Yi, Wuju Style',
    nameShort: 'Master Yi',
    domain: 'Order',
    tier: 'A',
    winRate: 49.8,
    pickRate: 4.2,
    day2Conversion: 15.2,
    topCut: 'Top 8',
    summary: 'Wuju Style deck avec des buffs massifs. Excellent vs control decks.',
    matchups: [
      { against: 'Ezreal', result: 'even' },
      { against: 'Kai\'Sa', result: 'favorable' },
      { against: 'Draven', result: 'unfavorable' },
    ],
    keyCards: ['Master Yi', 'Wuju Style', 'Highlander', 'Insight'],
    strategy: 'Buff Master Yi avec des spells et attack. Highlander donne des buffsglobaux.'
  },
  {
    id: 'OGS-17',
    name: 'Annie, Dark Child',
    nameShort: 'Annie',
    domain: 'Chaos',
    tier: 'A',
    winRate: 49.5,
    pickRate: 3.5,
    day2Conversion: 14.1,
    topCut: 'Top 16',
    summary: 'Pyromaniac deck avec des burn damage. Tibbers est une menace constante.',
    matchups: [
      { against: 'Kai\'Sa', result: 'favorable' },
      { against: 'Ezreal', result: 'even' },
      { against: 'Irelia', result: 'unfavorable' },
    ],
    keyCards: ['Annie', 'Pyro', 'Tibbers', 'Incinerate', 'Frostbite'],
    strategy: 'Burn l\'adversaire avec des spells tout en buildant Tibbers. Finish avec Annie.'
  },
  {
    id: 'SFD-206',
    name: 'Jax, Grandmaster at Arms',
    nameShort: 'Jax',
    domain: 'Order',
    tier: 'A',
    winRate: 49.2,
    pickRate: 3.1,
    day2Conversion: 13.5,
    topCut: 'Top 8',
    summary: 'Counter deck excellent vs aggressive. Jax lmplements peut répondre à tout.',
    matchups: [
      { against: 'Draven', result: 'even' },
      { against: 'Irelia', result: 'even' },
      { against: 'Ezreal', result: 'favorable' },
    ],
    keyCards: ['Jax', 'Counter Strike', 'Grandmasters Plan', 'Strike'],
    strategy: 'Utilisez les counters pour respondre aux threats adverses. Jax lmplements防护.'
  },
  {
    id: 'SFD-203',
    name: 'Sivir, Battle Mistress',
    nameShort: 'Sivir',
    domain: 'Glory',
    tier: 'A',
    winRate: 48.8,
    pickRate: 3.3,
    day2Conversion: 12.9,
    topCut: 'Top 16',
    summary: 'Equipment synergy deck avec des buffs massifs. Sivir bounce equipments.',
    matchups: [
      { against: 'Irelia', result: 'even' },
      { against: 'Azir', result: 'favorable' },
      { against: 'Draven', result: 'unfavorable' },
    ],
    keyCards: ['Sivir', 'Ricochet', 'Blade of the Exile', 'Gold Card'],
    strategy: 'Build autour des equipments. Sivir donne des attacks supplémentaires.'
  },
  {
    id: 'SFD-197',
    name: 'Azir, Emperor of the Sands',
    nameShort: 'Azir',
    domain: 'Order',
    tier: 'A',
    winRate: 48.5,
    pickRate: 3.0,
    day2Conversion: 12.1,
    topCut: 'Top 8',
    summary: 'Sand Soldier swarm deck. Excellent late game avec Emperor ascent.',
    matchups: [
      { against: 'Draven', result: 'even' },
      { against: 'Sivir', result: 'favorable' },
      { against: 'Kai\'Sa', result: 'even' },
    ],
    keyCards: ['Azir', 'Sand Soldier', 'Horazi Reawakening', 'Desert'],
    strategy: 'Spawnpez des Sand Soldiers overwhelm. Azir buff tous les soldiers.'
  },
  {
    id: 'OGN-265',
    name: 'Viktor, Herald of the Arcane',
    nameShort: 'Viktor',
    domain: 'Knowledge',
    tier: 'A',
    winRate: 48.2,
    pickRate: 4.0,
    day2Conversion: 11.8,
    topCut: 'Top 16',
    summary: 'Value deck avec Viktor et les Hexcore chips. Excellent card draw.',
    matchups: [
      { against: 'Master Yi', result: 'even' },
      { against: 'Annie', result: 'even' },
      { against: 'Ezreal', result: 'unfavorable' },
    ],
    keyCards: ['Viktor', 'Hexcore', 'Siphoning Strike', 'Glacial Storm'],
    strategy: 'Accumulez des Hexcore chips pour draw. Viktor transforme les chips en value.'
  },
  {
    id: 'SFD-204',
    name: 'Lucian, Purifier',
    nameShort: 'Lucian',
    domain: 'Glory',
    tier: 'A',
    winRate: 47.9,
    pickRate: 3.0,
    day2Conversion: 11.2,
    topCut: 'Top 16',
    summary: 'Aggressive Light deck avec Lucian. Quick attacks et lifesteal.',
    matchups: [
      { against: 'Ezreal', result: 'favorable' },
      { against: 'Kai\'Sa', result: 'even' },
      { against: 'Draven', result: 'unfavorable' },
    ],
    keyCards: ['Lucian', 'Piercing Light', 'Radiant Strike', 'Vigilance'],
    strategy: 'Lucian attacks vite et souvent. Utilisez lifesteal pour survive.'
  },
  // TIER B - Solid
  {
    id: 'OGN-255',
    name: 'Ahri, Nine-Tailed',
    nameShort: 'Ahri',
    domain: 'Cunning',
    tier: 'B',
    winRate: 46.5,
    pickRate: 2.8,
    day2Conversion: 8.5,
    topCut: '-',
    summary: 'Fox-Fire deck avec des trades favorables. Pas assez de support dans le meta actuel.',
    matchups: [
      { against: 'Draven', result: 'unfavorable' },
      { against: 'Irelia', result: 'unfavorable' },
    ],
    keyCards: ['Ahri', 'Fox-Fire', 'Charm'],
    strategy: 'Trade favorable avec Fox-Fire. Ahri accumulate damage over time.'
  },
  {
    id: 'OGN-265',
    name: 'Viktor, Leader',
    nameShort: 'Viktor (OGN)',
    domain: 'Knowledge',
    tier: 'B',
    winRate: 46.0,
    pickRate: 2.5,
    day2Conversion: 7.9,
    topCut: '-',
    summary: 'Original Viktor deck. Fonctionne mais overshadow par la version Spiritforged.',
    matchups: [
      { against: 'Draven', result: 'unfavorable' },
      { against: 'Kai\'Sa', result: 'even' },
    ],
    keyCards: ['Viktor', 'Augment', 'Death Ray'],
    strategy: 'Value engine avec les Augments. Viktor discount les spells.'
  },
  {
    id: 'SFD-210',
    name: 'Rek\'Sai, Terror of the Sands',
    nameShort: 'Rek\'Sai',
    domain: 'Void',
    tier: 'B',
    winRate: 45.5,
    pickRate: 2.1,
    day2Conversion: 7.2,
    topCut: '-',
    summary: 'Burrow mechanic interesting mais pas assez consistent.',
    matchups: [
      { against: 'Draven', result: 'unfavorable' },
      { against: 'Irelia', result: 'even' },
    ],
    keyCards: ['RekSai', 'Burrow', 'Tunnel'],
    strategy: 'Burrow pour éviter les attacks. Unburrow pour des attacks surprise.'
  },
  {
    id: 'SFD-205',
    name: 'Fiora, Grand Duelist',
    nameShort: 'Fiora',
    domain: 'Glory',
    tier: 'B',
    winRate: 45.0,
    pickRate: 2.8,
    day2Conversion: 6.8,
    topCut: '-',
    summary: 'Duelist deck. Pas assez de support pour être competitive.',
    matchups: [
      { against: 'Draven', result: 'unfavorable' },
      { against: 'Master Yi', result: 'unfavorable' },
    ],
    keyCards: ['Fiora', 'Riposte', 'Parry'],
    strategy: 'Faites des duels 1v1. Fiora gagne des buffs quand elle kill.'
  },
  {
    id: 'OGN-263',
    name: 'Teemo, Swift Scout',
    nameShort: 'Teemo',
    domain: 'Cunning',
    tier: 'B',
    winRate: 44.8,
    pickRate: 1.9,
    day2Conversion: 6.2,
    topCut: '-',
    summary: 'Fun deck mais pas competitive. Hidden mechanic underutilized.',
    matchups: [
      { against: 'Draven', result: 'unfavorable' },
      { against: 'Azir', result: 'even' },
    ],
    keyCards: ['Teemo', 'Mushroom', 'Guerrilla'],
    strategy: 'Placez des mushrooms sur le board. Teemo scout donne des infos.'
  },
  {
    id: 'OGN-249',
    name: 'Volibear, Thunder Lord',
    nameShort: 'Volibear',
    domain: 'Order',
    tier: 'B',
    winRate: 44.5,
    pickRate: 1.5,
    day2Conversion: 5.5,
    topCut: '-',
    summary: 'Frostbite deck interesting mais manque de support.',
    matchups: [
      { against: 'Draven', result: 'unfavorable' },
      { against: 'Annie', result: 'even' },
    ],
    keyCards: ['Volibear', 'Frostbite', 'Stormbringer'],
    strategy: 'Frostbite pour control. Volibear buff les attacks.'
  },
  {
    id: 'OGN-269',
    name: 'Sett, Boss',
    nameShort: 'Sett',
    domain: 'Chaos',
    tier: 'B',
    winRate: 44.2,
    pickRate: 1.8,
    day2Conversion: 5.1,
    topCut: '-',
    summary: 'The Boss mechanics有趣 mais manque de consistency.',
    matchups: [
      { against: 'Draven', result: 'unfavorable' },
      { against: 'Kai\'Sa', result: 'even' },
    ],
    keyCards: ['Sett', 'Take the Lead', 'Facelift'],
    strategy: 'Build des eyes pour Sett. The Boss give free attacks.'
  },
  {
    id: 'OGN-301',
    name: 'Jinx, Rebel',
    nameShort: 'Jinx',
    domain: 'Cunning',
    tier: 'B',
    winRate: 43.8,
    pickRate: 1.2,
    day2Conversion: 4.8,
    topCut: '-',
    summary: 'Card draw engine mais trop slow pour le meta.',
    matchups: [
      { against: 'Draven', result: 'unfavorable' },
      { against: 'Annie', result: 'unfavorable' },
    ],
    keyCards: ['Jinx', 'Get Excited', 'Super Megavolley'],
    strategy: 'Jinx draw des cards quand elle attack. Super Megavolley finisher.'
  },
  // TIER C - Below Average
  {
    id: 'OGN-253',
    name: 'Darius, Trifarian',
    nameShort: 'Darius',
    domain: 'Fury',
    tier: 'C',
    winRate: 42.5,
    pickRate: 1.5,
    day2Conversion: 4.2,
    topCut: '-',
    summary: 'Classic Fury mais overshadow par Draven.',
    matchups: [
      { against: 'Azir', result: 'even' },
      { against: 'Draven', result: 'unfavorable' },
    ],
    keyCards: ['Darius', 'Decimating Slash'],
    strategy: 'Darius buff par les Fury units. Pas assez de synergy.'
  },
  {
    id: 'SFD-201',
    name: 'Caitlyn, Patrolling',
    nameShort: 'Caitlyn',
    domain: 'Order',
    tier: 'C',
    winRate: 42.0,
    pickRate: 0.8,
    day2Conversion: 3.5,
    topCut: '-',
    summary: 'Sniper deck. Trop slow pour le meta actuel.',
    matchups: [
      { against: 'Draven', result: 'unfavorable' },
      { against: 'Irelia', result: 'unfavorable' },
    ],
    keyCards: ['Caitlyn', 'Headshot'],
    strategy: 'Snipe les unités. Pas assez de support.'
  },
  // TIER D - Not Competitive
  {
    id: 'OGN-017',
    name: 'Heimerdinger, Inventor',
    nameShort: 'Heimerdinger',
    domain: 'Knowledge',
    tier: 'D',
    winRate: 38.5,
    pickRate: 0.6,
    day2Conversion: 2.1,
    topCut: '-',
    summary: 'Trop slow pour le meta aggressive.',
    matchups: [
      { against: 'Draven', result: 'unfavorable' },
      { against: 'Irelia', result: 'unfavorable' },
    ],
    keyCards: ['Heimerdinger', 'UPGRADE'],
    strategy: 'Build des turrets. Trop slow.'
  },
  {
    id: 'OGN-016',
    name: 'Warwick, Hunter',
    nameShort: 'Warwick',
    domain: 'Fury',
    tier: 'D',
    winRate: 37.2,
    pickRate: 0.5,
    day2Conversion: 1.8,
    topCut: '-',
    summary: 'Lifesteal mais pas assez de support.',
    matchups: [
      { against: 'Draven', result: 'unfavorable' },
      { against: 'Kai\'Sa', result: 'unfavorable' },
    ],
    keyCards: ['Warwick', 'Primal Hunger'],
    strategy: 'Heal des kills. Pas competitive.'
  },
  {
    id: 'OGN-014',
    name: 'Vi, Destructive',
    nameShort: 'Vi',
    domain: 'Fury',
    tier: 'D',
    winRate: 36.8,
    pickRate: 0.4,
    day2Conversion: 1.5,
    topCut: '-',
    summary: 'Direct damage mais overshadow.',
    matchups: [
      { against: 'Draven', result: 'unfavorable' },
      { against: 'Ezreal', result: 'unfavorable' },
    ],
    keyCards: ['Vi', 'Vault'],
    strategy: 'Direct damage. Pas assez forte.'
  },
  {
    id: 'OGN-308',
    name: 'Lux, Lady of Luminosity',
    nameShort: 'Lux',
    domain: 'Knowledge',
    tier: 'D',
    winRate: 35.5,
    pickRate: 0.3,
    day2Conversion: 1.2,
    topCut: '-',
    summary: 'Spell spam mais pas assez de support.',
    matchups: [
      { against: 'Draven', result: 'unfavorable' },
      { against: 'Irelia', result: 'unfavorable' },
    ],
    keyCards: ['Lux', 'Final Spark'],
    strategy: 'Spell spam. Pas competitive.'
  },
];

// Export public sans les winrates
export const TIER_LIST: LegendTier[] = RAW_TIER_LIST.map(({ winRate, ...rest }) => rest);

export const TIER_COLORS: Record<string, string> = {
  S: 'bg-gradient-to-r from-red-600 to-orange-500 border-red-400 text-white',
  A: 'bg-gradient-to-r from-orange-500 to-yellow-500 border-orange-400 text-white',
  B: 'bg-gradient-to-r from-yellow-500 to-green-400 border-yellow-400 text-black',
  C: 'bg-gradient-to-r from-blue-500 to-cyan-400 border-blue-400 text-white',
  D: 'bg-gradient-to-r from-gray-600 to-gray-500 border-gray-500 text-white',
};

export const DOMAIN_COLORS: Record<string, string> = {
  Fury: 'text-red-400',
  Calm: 'text-blue-400',
  Mind: 'text-purple-400',
  Body: 'text-yellow-400',
  Chaos: 'text-green-400',
  Order: 'text-orange-400',
  Cunning: 'text-cyan-400',
  Glory: 'text-amber-400',
  Void: 'text-pink-400',
  Knowledge: 'text-violet-400',
  Colorless: 'text-gray-400',
};

// Top tournament decklists
export const META_DECKS = [
  {
    name: 'Miracle Draven',
    champion: 'Draven, Glorious Executioner',
    domain: 'Fury',
    format: 'Chaos',
    description: 'Le deck winner de Vegas Regional. Aggressive avec Spinning Axe et Kaisa Survivor pour card draw.',
    winRate: 62.4,
    tournament: 'Vegas Regional Qualifier - Winner',
    cards: {
      legend: ['Draven, Glorious Executioner'],
      champions: ['Draven, Vanquisher'],
      units: [
        '3 Overzealous Fan',
        '2 Tideturner',
        '2 Treasure Hunter',
        '3 Kai\'Sa, Survivor',
        '3 Noxus Hopeful',
        '3 Darius, Trifarian',
        '2 Brynhir Thundersong',
      ],
      spells: [
        '2 Spinning Axe',
        '2 Edge of Night',
        '1 Blood Rush',
        '3 Stacked Deck',
        '1 Against the Odds',
        '2 Falling Star',
        '2 Fight or Flight',
        '2 Rebuke',
        '2 Ride the Wind',
        '1 Switcheroo',
      ],
      gear: ['2 Spinning Axe', '2 Edge of Night'],
      battlefields: ['Obelisk of Power', 'Reavers Row', 'Targons Peak'],
      runes: ['6 Fury Rune', '6 Chaos Rune'],
    },
    strategy: 'Jouez agressif early. Utilisez Spinning Axe pour draw des cartes et Kaisa Survivor pour tempo. Finish avec Draven une fois que vous avez établit votre board.',
    tips: [
      'Mulligan pour des cartes early game',
      'Gardez Spinning Axe pour draw maximum',
      'Positionnez Draven pour安全的kills',
    ]
  },
  {
    name: 'Irelia Blade Dancer',
    champion: 'Irelia, Blade Dancer',
    domain: 'Order',
    format: 'Chaos',
    description: 'Weaponmaster deck très puissant avec Blade Dancer créant des copies avec chaque spell.',
    winRate: 54.1,
    tournament: 'Vegas Regional Qualifier - Top 4',
    cards: {
      legend: ['Irelia, Blade Dancer'],
      champions: ['Irelia, Vanquisher'],
      units: [
        '3 Blossoming Blade',
        '2 Dancing Blade',
        '3 Greenglade Caretaker',
        '2 Radiant Guardian',
      ],
      spells: [
        '3 Blade Rush',
        '3 Homecoming',
        '2 Defiant Dance',
        '2 Shunpo',
        '2 Fury of the Blade',
      ],
      gear: ['2 Katanas', '2 Blades Edge'],
      battlefields: ['Ionian Embassy', 'Noxian Embassy', 'Shadow Isles Embassy'],
      runes: ['6 Order Rune', '6 Chaos Rune'],
    },
    strategy: 'Spammez des spells bon marché pour créer des Blade Surges. Stackez-les sur une unité pour du massive damage. Utilisez Homecoming pour des saves et replays.',
    tips: [
      'Gardez les Blade Surges sur une seule unité',
      'Homecoming peut save Irelia et replay',
      'Greenglade Caretaker donne des free spells',
    ]
  },
  {
    name: 'Ezreal Control',
    champion: 'Ezreal, Prodigal Explorer',
    domain: 'Cunning',
    format: 'Chaos',
    description: 'Deck versatile avec Ezreal poke et card draw. Bon matchup vs Draven.',
    winRate: 51.0,
    tournament: 'Vegas Regional Qualifier - Winner',
    cards: {
      legend: ['Ezreal, Prodigal Explorer'],
      champions: ['Ezreal, Renegade'],
      units: [
        '3 Journeying Scout',
        '2 Lulu, Yordle Sorceress',
        '2 Pix, Faerie Companion',
      ],
      spells: [
        '3 Mystic Shot',
        '3 Essence Shift',
        '2 Rally',
        '2 Deep Meditation',
        '2 Decoy',
        '2 Flash',
      ],
      gear: ['2 Arcane Comet'],
      battlefields: ['Piltover Customs', 'Zaunite Pier', 'Bandle City'],
      runes: ['6 Cunning Rune', '6 Chaos Rune'],
    },
    strategy: 'Poke avec Ezreal et spells tout en buildant votre board. Utilisez Rally pour des attaques surprises. Deep Meditation pour card advantage.',
    tips: [
      'Ezreal poke every turn',
      'Save Rally pour des finishing attacks',
      'Use Decoy pour save Ezreal',
    ]
  },
  {
    name: 'Kai\'Sa Control',
    champion: 'Kai\'Sa, Daughter of the Void',
    domain: 'Void',
    format: 'Chaos',
    description: 'Control deck excellent pour counter Draven. Void swarm + removal massifs.',
    winRate: 50.2,
    tournament: 'Vegas Regional - Top 16',
    cards: {
      legend: ['Kai\'Sa, Daughter of the Void'],
      champions: ['Kai\'Sa, Voidborn'],
      units: [
        '3 Void Seeker',
        '2 Chempunk Shredder',
        '2 Nasus, Aspect of Dread',
      ],
      spells: [
        '3 Consume',
        '2 Void Rift',
        '2 Riftwalk',
        '2 Abomination',
        '2 Unleashed Power',
      ],
      gear: ['2 Void Staff'],
      battlefields: ['The Void', 'Bounty Hunter Base', 'Shurima'],
      runes: ['6 Void Rune', '6 Chaos Rune'],
    },
    strategy: 'Survive early avec des removals. Build vers Kai\'Sa late game pour finish. Consume et Void Rift control le board.',
    tips: [
      'Mulligan pour des removals vs aggro',
      'Kai\'Sa est votre win condition',
      'Void counters les unités petites',
    ]
  },
  {
    name: 'Jax Counter',
    champion: 'Jax, Grandmaster at Arms',
    domain: 'Order',
    format: 'Chaos',
    description: 'Counter deck excellent vs aggressive. Jax lmplements peut répondre à tout.',
    winRate: 49.2,
    tournament: 'Vegas Regional - Top 8',
    flags: [],
    cards: {
      legend: ['Jax, Grandmaster at Arms'],
      champions: ['Jax, World-Ender'],
      units: [
        '3 Grandmasters Pride',
        '2 Unbreakable Will',
        '2 Counter Strike',
      ],
      spells: [
        '3 Strike',
        '2 Grandmasters Plan',
        '2 Disarm',
        '2 Send It',
      ],
      gear: ['2 Lamp'],
      battlefields: ['Freljord', 'Demacia', 'Noxus'],
      runes: ['6 Order Rune', '6 Chaos Rune'],
    },
    strategy: 'Utilisez les counters pour respondre aux threats adverses. Jax lmplements防护. Strike comme removal.',
    tips: [
      'Counter les threats importantes',
      'Save Jax pour les late game fights',
      'Disarm vs attack decks',
    ]
  },
  {
    name: 'Master Yi Wuju',
    champion: 'Master Yi, Wuju Style',
    domain: 'Order',
    format: 'Chaos',
    description: 'Wuju Style deck avec des buffs massifs. Excellent vs control decks.',
    winRate: 49.8,
    tournament: 'Vegas Regional - Top 8',
    cards: {
      legend: ['Master Yi, Wuju Style'],
      champions: ['Master Yi, Meddler'],
      units: [
        '3 Wuju Bladesman',
        '2 Ancient Spirit',
        '2 Dragon Philosophy',
      ],
      spells: [
        '3 Wuju Style',
        '2 Highlander',
        '2 Insight',
        '2 Meditate',
      ],
      gear: ['2 Wuju Blade'],
      battlefields: ['Ionia', 'Shojin Temple', 'Mountain Temple'],
      runes: ['6 Order Rune', '6 Chaos Rune'],
    },
    strategy: 'Buff Master Yi avec des spells et attack. Highlander donne des buffsglobaux. Wuju Style pour finishing touches.',
    tips: [
      'Buff Master Yi ASAP',
      'Highlander buff everything',
      'Insight pour card draw',
    ]
  },
  // Additional Tournament Decks
  {
    name: 'Ornn Control',
    champion: 'Ornn, Fire Below The Mountain',
    domain: 'Order',
    format: 'Chaos',
    description: 'Deck control avec Ornn et les cartes Fire. Excellent late game avec les Masterworks.',
    winRate: 48.5,
    tournament: 'Vegas Regional - Day 2',
    cards: {
      legend: ['Ornn, Fire Below The Mountain'],
      champions: ['Ornn, The Great Beyond'],
      units: [
        '3 Crimson Curator',
        '2 Ember Furor',
        '2 Lava Licker',
      ],
      spells: [
        '3 Into the Fire',
        '2 Wildfire',
        '2 Backdraft',
        '2 Cataloger',
        '2 Rimefang',
      ],
      gear: ['2 Molten Fist'],
      battlefields: ['Freljord', 'Frozen Thralls', 'Vastaya Lands'],
      runes: ['6 Order Rune', '6 Chaos Rune'],
    },
    strategy: 'Contrôlez le board avec des removals fire. Build vers Ornn late game pour des Masterworks.',
    tips: [
      'Mulligan pour des removals early',
      'Ornn est votre win condition',
      'Masterworks give huge value',
    ]
  },
  {
    name: 'Lucian Aggro',
    champion: 'Lucian, Purifier',
    domain: 'Glory',
    format: 'Chaos',
    description: 'Deck aggro rapide avec Lucian et lifesteal. Excellent pour beat control.',
    winRate: 47.9,
    tournament: 'Bologna Regional - Top 16',
    cards: {
      legend: ['Lucian, Purifier'],
      champions: ['Lucian, Aspect of Light'],
      units: [
        '3 Radiant Guardian',
        '2 Seneschal',
        '2 Dauntless',
      ],
      spells: [
        '3 Piercing Light',
        '3 Radiant Strike',
        '2 Vigilance',
        '2 Dawning',
        '2 Light Surge',
      ],
      gear: ['2 Lightbringer'],
      battlefields: ['Demacia', 'High Silver', 'Valoran City'],
      runes: ['6 Glory Rune', '6 Chaos Rune'],
    },
    strategy: 'Attaquez rapidement avec Lucian. Utilisez lifesteal pour survive.',
    tips: [
      'Lucian attacks fast and often',
      'Lifesteal keeps you alive',
      'Race to victory',
    ]
  },
  {
    name: 'Azir Swarm',
    champion: 'Azir, Emperor of the Sands',
    domain: 'Order',
    format: 'Chaos',
    description: 'Sand Soldier swarm deck. Excelent late game avec Emperor ascent.',
    winRate: 48.5,
    tournament: 'Bologna Regional - Top 8',
    cards: {
      legend: ['Azir, Emperor of the Sands'],
      champions: ['Azir, Ascended'],
      units: [
        '3 Sand Soldier',
        '2 Dune Keeper',
        '2 Emperor\'s Guard',
      ],
      spells: [
        '3 Horazi Reawakening',
        '2 Desert',
        '2 Sandstorm',
        '2 Unraveled Earth',
      ],
      gear: ['2 Scepter of the Sands'],
      battlefields: ['Shurima', 'Sun Disc', 'Noxus'],
      runes: ['6 Order Rune', '6 Chaos Rune'],
    },
    strategy: 'Spawn des Sand Soldiers overwhelm. Azir buff tous les soldiers.',
    tips: [
      'Spawn soldiers every attack',
      'Use Reawakening to respawn',
      'Overwhelm with numbers',
    ]
  },
  {
    name: 'Annie Pyro',
    champion: 'Annie, Dark Child',
    domain: 'Chaos',
    format: 'Chaos',
    description: 'Burn deck avec Annie et Tibbers. Pyromaniac fait très mal.',
    winRate: 49.5,
    tournament: 'Chengdu Regional - Top 8',
    cards: {
      legend: ['Annie, Dark Child'],
      champions: ['Annie,emberwraith'],
      units: [
        '3 Fling',
        '2 Ringer',
        '2 Kilworth',
      ],
      spells: [
        '3 Incinerate',
        '3 Pyro',
        '2 Frostbite',
        '2 Twin Shadows',
        '2 Whirling Death',
      ],
      gear: ['2 Flaming Cross'],
      battlefields: ['Noxus', 'The Pit', 'Shadow Isles'],
      runes: ['6 Chaos Rune', '6 Fury Rune'],
    },
    strategy: 'Burn l\'adversaire avec des spells. Build Tibbers comme win condition.',
    tips: [
      'Burn opponent with spells',
      'Build Tibbers as threat',
      'Time burn correctly',
    ]
  },
  {
    name: 'Viktor Value',
    champion: 'Viktor, Herald of the Arcane',
    domain: 'Knowledge',
    format: 'Chaos',
    description: 'Value deck avec Viktor et Hexcore. Excellent card draw.',
    winRate: 48.2,
    tournament: 'Chengdu Regional - Top 16',
    cards: {
      legend: ['Viktor, Herald of the Arcane'],
      champions: ['Viktor, Augmented'],
      units: [
        '3 Hexcore',
        '2 Siphoning Strike',
        '2 Research',
      ],
      spells: [
        '3 Glacial Storm',
        '2 Flash of Insight',
        '2 Reality Break',
        '2 Chronobreak',
      ],
      gear: ['2 Augment'],
      battlefields: ['Piltover', 'Zaun', 'Bandle City'],
      runes: ['6 Knowledge Rune', '6 Chaos Rune'],
    },
    strategy: 'Accumulez des Hexcore chips. Viktor transforme en value.',
    tips: [
      'Maximize discount each turn',
      'Plan ahead with spells',
      'Viktor is late game win',
    ]
  },
  {
    name: 'Sivir Equipment',
    champion: 'Sivir, Battle Mistress',
    domain: 'Glory',
    format: 'Chaos',
    description: 'Equipment synergy deck. Sivir bounce equipments pour value massive.',
    winRate: 48.8,
    tournament: 'Bologna Regional - Top 16',
    cards: {
      legend: ['Sivir, Battle Mistress'],
      champions: ['Sivir, Warlord'],
      units: [
        '3 Gold Card',
        '2 Stonewall',
        '2 Valora',
      ],
      spells: [
        '3 Ricochet',
        '3 Blade of the Exile',
        '2 Rally',
        '2 Battle Trance',
      ],
      gear: ['2 Golden Spatula'],
      battlefields: ['Demacia', 'Noxus', 'Shurima'],
      runes: ['6 Glory Rune', '6 Chaos Rune'],
    },
    strategy: 'Build autour des equipments. Sivir donne des attacks supplémentaires.',
    tips: [
      'Build equipment early',
      'Sivir gives extra attacks',
      'Ricochet for value',
    ]
  },
  {
    name: 'Rek\'Sai Tunnel',
    champion: 'Rek\'Sai, Terror of the Sands',
    domain: 'Void',
    format: 'Chaos',
    description: 'Burrow mechanic deck. Unburrow pour des attacks surprise.',
    winRate: 45.5,
    tournament: 'Day 2 Meta',
    cards: {
      legend: ['Rek\'Sai, Terror of the Sands'],
      champions: ['Rek\'Sai, Unleashed'],
      units: [
        '3 Tunneler',
        '2 Burrowed',
        '2 Alpha',
      ],
      spells: [
        '3 Burrow',
        '3 Unburrow',
        '2 Prey',
        '2 Hunger',
      ],
      gear: ['2 Void Claws'],
      battlefields: ['Shurima', 'Void', 'Icathia'],
      runes: ['6 Void Rune', '6 Chaos Rune'],
    },
    strategy: 'Burrow pour éviter les attacks. Unburrow pour des attacks surprise.',
    tips: [
      'Burrow to avoid attacks',
      'Unburrow for surprise',
      'Buried units are safe',
    ]
  },
  {
    name: 'Fiora Duelist',
    champion: 'Fiora, Grand Duelist',
    domain: 'Glory',
    format: 'Chaos',
    description: 'Duelist deck. Fiora gagne des buffs quand elle kill.',
    winRate: 45.0,
    tournament: 'Fun Deck',
    cards: {
      legend: ['Fiora, Grand Duelist'],
      champions: ['Fiora, Sword of the Realm'],
      units: [
        '3 Riposte',
        '2 Parry',
        '2 Concerted Strike',
      ],
      spells: [
        '3 Duel',
        '3 Repatriate',
        '2 Detain',
        '2 Quicksand',
      ],
      gear: ['2 Duellist'],
      battlefields: ['Demacia', 'High Silver', 'Freljord'],
      runes: ['6 Glory Rune', '6 Order Rune'],
    },
    strategy: 'Faites des duels 1v1. Fiora gagne des buffs quand elle kill.',
    tips: [
      'Win duels for buffs',
      'Protect Fiora',
      'Trade up',
    ]
  },
  {
    name: 'Volibear Frost',
    champion: 'Volibear, Thunder Lord',
    domain: 'Order',
    format: 'Chaos',
    description: 'Frostbite deck avec Volibear. Control + damage.',
    winRate: 44.5,
    tournament: 'Fun Deck',
    cards: {
      legend: ['Volibear, Thunder Lord'],
      champions: ['Volibear, Ursine'],
      units: [
        '3 Frostfang',
        '2 Ice Pillar',
        '2 Winter\'s Claw',
      ],
      spells: [
        '3 Frostbite',
        '3 Stormbringer',
        '2 Glacial Wall',
        '2 Avalanche',
      ],
      gear: ['2 Frozen Mallet'],
      battlefields: ['Freljord', 'Watchtower', 'Vastaya Lands'],
      runes: ['6 Order Rune', '6 Knowledge Rune'],
    },
    strategy: 'Frostbite pour control. Volibear buff les attacks.',
    tips: [
      'Frostbite for control',
      'Build Volibear for damage',
      'Stormbringer for finisher',
    ]
  },
  {
    name: 'Teemo Mushroom',
    champion: 'Teemo, Swift Scout',
    domain: 'Cunning',
    format: 'Chaos',
    description: 'Mushroom deckfun. Hidden mechanic underutilized.',
    winRate: 44.8,
    tournament: 'Fun Deck',
    cards: {
      legend: ['Teemo, Swift Scout'],
      champions: ['Teemo, Mushroom Scout'],
      units: [
        '3 Mushroom',
        '2 Camouflage',
        '2 Scout',
      ],
      spells: [
        '3 Guerrilla',
        '3 Move',
        '2 Deadly Venom',
        '2 Noxian Trap',
      ],
      gear: ['2 Mushroom Cap'],
      battlefields: ['Bandle City', 'Ionia', 'Noxus'],
      runes: ['6 Cunning Rune', '6 Chaos Rune'],
    },
    strategy: 'Placez des mushrooms. Teemo scout donne des infos.',
    tips: [
      'Mushrooms are hidden threats',
      'Scout gives information',
      'Guerrilla for surprise',
    ]
  },
  {
    name: 'Sett Boss',
    champion: 'Sett, Boss',
    domain: 'Chaos',
    format: 'Chaos',
    description: 'The Boss mechanics. Build des yeux pour Sett.',
    winRate: 44.2,
    tournament: 'Fun Deck',
    cards: {
      legend: ['Sett, Boss'],
      champions: ['Sett, Eyeball Boss'],
      units: [
        '3 The Boss',
        '2 Go Getter',
        '2 Eyes',
      ],
      spells: [
        '3 Take the Lead',
        '3 Facelift',
        '2 Headliner',
        '2 Play Again',
      ],
      gear: ['2 Sett\'s Brass Knuckles'],
      battlefields: ['Noxus', 'Zaun', 'Ionia'],
      runes: ['6 Chaos Rune', '6 Fury Rune'],
    },
    strategy: 'Build des eyes pour Sett. The Boss give free attacks.',
    tips: [
      'Build eyes fast',
      'The Boss attacks free',
      'Take the Lead for value',
    ]
  },
];

export function getTierListByTier(tier: string): LegendTier[] {
  return TIER_LIST.filter(l => l.tier === tier);
}

export function getDeckByChampion(championName: string) {
  return META_DECKS.find(d => d.champion.includes(championName.split(',')[0]));
}

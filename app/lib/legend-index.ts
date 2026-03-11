/**
 * legend-index.ts
 * Source of truth for the Legend ↔ Champion ↔ Units relationship.
 * All IDs reference actual entries in ALL_CARDS (riftbound-full.ts + spiritforged-cards.ts).
 *
 * Legend IDs use the *regular* (non-Showcase) variant as the primary.
 * Units list the confirmed champion cards in the game.
 */

export type LegendRecord = {
  /** Canonical champion name (used in UI labels, deckbuilder, etc.) */
  champion: string;
  /** Primary legend card (regular variant) */
  legend: { id: string; name: string };
  /** All legend variants for this champion (regular + showcase) */
  legendVariants: { id: string; name: string }[];
  /** Confirmed unit cards for this champion */
  units: { id: string; name: string }[];
  /** Domain of the primary legend */
  domain: string;
  /** Optional secondary domain to display alongside primary */
  secondaryDomain?: string;
};

export const LEGENDS: LegendRecord[] = [
  {
    champion: 'Ahri',
    legend: { id: 'OGN-255', name: 'Nine-Tailed Fox' },
    legendVariants: [
      { id: 'OGN-255', name: 'Nine-Tailed Fox' },
      { id: 'OGN-303', name: 'Nine-Tailed Fox (Showcase)' },
    ],
    units: [
      { id: 'OGN-119', name: 'Ahri, Inquisitive' },
      { id: 'OGN-66',  name: 'Ahri, Alluring' },
    ],
    domain: 'Calm',
    secondaryDomain: 'Mind',
  },
  {
    champion: 'Annie',
    legend: { id: 'OGS-17', name: 'Dark Child' },
    legendVariants: [
      { id: 'OGS-17', name: 'Dark Child' },
    ],
    units: [
      { id: 'OGS-10', name: 'Annie, Stubborn' },
      { id: 'OGS-1',  name: 'Annie, Fiery' },
    ],
    domain: 'Fury',
    secondaryDomain: 'Chaos',
  },
  {
    champion: 'Azir',
    legend: { id: 'SFD-197', name: 'Emperor of the Sands' },
    legendVariants: [
      { id: 'SFD-197', name: 'Emperor of the Sands' },
    ],
    units: [
      { id: 'SFD-177', name: 'Azir, Sovereign' },
      { id: 'SFD-50',  name: 'Azir, Ascendant' },
    ],
    domain: 'Calm',
    secondaryDomain: 'Order',
  },
  {
    champion: 'Darius',
    legend: { id: 'OGN-253', name: 'Hand of Noxus' },
    legendVariants: [
      { id: 'OGN-253', name: 'Hand of Noxus' },
      { id: 'OGN-302', name: 'Hand of Noxus (Showcase)' },
    ],
    units: [
      { id: 'OGN-27',  name: 'Darius, Trifarian' },
      { id: 'OGN-243', name: 'Darius, Executioner' },
    ],
    domain: 'Fury',
    secondaryDomain: 'Order',
  },
  {
    champion: 'Draven',
    legend: { id: 'SFD-185', name: 'Glorious Executioner' },
    legendVariants: [
      { id: 'SFD-185', name: 'Glorious Executioner' },
    ],
    units: [
      { id: 'SFD-20',  name: 'Draven, Vanquisher' },
      { id: 'OGN-28',  name: 'Draven, Showboat' },
      { id: 'SFD-148', name: 'Draven, Audacious' },
    ],
    domain: 'Fury',
    secondaryDomain: 'Chaos',
  },
  {
    champion: 'Ezreal',
    legend: { id: 'SFD-208', name: 'Prodigal Explorer' },
    legendVariants: [
      { id: 'SFD-208', name: 'Prodigal Explorer' },
    ],
    units: [
      { id: 'SFD-149', name: 'Ezreal, Prodigy' },
      { id: 'SFD-82',  name: 'Ezreal, Dashing' },
    ],
    domain: 'Mind',
    secondaryDomain: 'Chaos',
  },
  {
    champion: 'Fiora',
    legend: { id: 'SFD-205', name: 'Grand Duelist' },
    legendVariants: [
      { id: 'SFD-205', name: 'Grand Duelist' },
    ],
    units: [
      { id: 'SFD-179', name: 'Fiora, Worthy' },
      { id: 'OGN-232', name: 'Fiora, Victorious' },
    ],
    domain: 'Body',
    secondaryDomain: 'Order',
  },
  {
    champion: 'Garen',
    legend: { id: 'OGS-23', name: 'Might of Demacia' },
    legendVariants: [
      { id: 'OGS-23', name: 'Might of Demacia' },
    ],
    units: [
      { id: 'OGS-13', name: 'Garen, Commander' },
      { id: 'OGS-7',  name: 'Garen, Rugged' },
    ],
    domain: 'Body',
    secondaryDomain: 'Order',
  },
  {
    champion: 'Irelia',
    legend: { id: 'SFD-195', name: 'Blade Dancer' },
    legendVariants: [
      { id: 'SFD-195', name: 'Blade Dancer' },
    ],
    units: [
      { id: 'SFD-57', name: 'Irelia, Fervent' },
    ],
    domain: 'Calm',
    secondaryDomain: 'Chaos',
  },
  {
    champion: 'Jax',
    legend: { id: 'SFD-206', name: 'Grandmaster at Arms' },
    legendVariants: [
      { id: 'SFD-206', name: 'Grandmaster at Arms' },
    ],
    units: [
      { id: 'SFD-54',  name: 'Jax, Unmatched' },
      { id: 'SFD-119', name: 'Jax, Unrelenting' },
    ],
    domain: 'Calm',
    secondaryDomain: 'Body',
  },
  {
    champion: 'Jinx',
    legend: { id: 'OGN-251', name: 'Loose Cannon' },
    legendVariants: [
      { id: 'OGN-251', name: 'Loose Cannon' },
      { id: 'OGN-301', name: 'Loose Cannon (Showcase)' },
    ],
    units: [
      { id: 'OGN-202', name: 'Jinx, Rebel' },
      { id: 'OGN-30',  name: 'Jinx, Demolitionist' },
    ],
    domain: 'Fury',
    secondaryDomain: 'Chaos',
  },
  {
    champion: "Kai'Sa",
    legend: { id: 'OGN-247', name: 'Daughter of the Void' },
    legendVariants: [
      { id: 'OGN-247', name: 'Daughter of the Void' },
      { id: 'OGN-299', name: 'Daughter of the Void (Showcase)' },
    ],
    units: [
      { id: 'OGN-39',  name: "Kai'Sa, Survivor" },
      { id: 'OGN-112', name: "Kai'Sa, Evolutionary" },
    ],
    domain: 'Fury',
    secondaryDomain: 'Mind',
  },
  {
    champion: 'Lee Sin',
    legend: { id: 'OGN-257', name: 'Blind Monk' },
    legendVariants: [
      { id: 'OGN-257', name: 'Blind Monk' },
      { id: 'OGN-304', name: 'Blind Monk (Showcase)' },
    ],
    units: [
      { id: 'OGN-151', name: 'Lee Sin, Centered' },
      { id: 'OGN-78',  name: 'Lee Sin, Ascetic' },
    ],
    domain: 'Calm',
    secondaryDomain: 'Body',
  },
  {
    champion: 'Leona',
    legend: { id: 'OGN-261', name: 'Radiant Dawn' },
    legendVariants: [
      { id: 'OGN-261', name: 'Radiant Dawn' },
      { id: 'OGN-306', name: 'Radiant Dawn (Showcase)' },
    ],
    units: [
      { id: 'OGN-238', name: 'Leona, Determined' },
      { id: 'OGN-79',  name: 'Leona, Zealot' },
    ],
    domain: 'Calm',
    secondaryDomain: 'Order',
  },
  {
    champion: 'Lucian',
    legend: { id: 'SFD-204', name: 'Purifier' },
    legendVariants: [
      { id: 'SFD-204', name: 'Purifier' },
    ],
    units: [
      { id: 'SFD-113', name: 'Lucian, Merciless' },
      { id: 'SFD-28',  name: 'Lucian, Gunslinger' },
    ],
    domain: 'Fury',
    secondaryDomain: 'Body',
  },
  {
    champion: 'Lux',
    legend: { id: 'OGS-21', name: 'Lady of Luminosity' },
    legendVariants: [
      { id: 'OGS-21',  name: 'Lady of Luminosity' },
      { id: 'OGN-265', name: 'Herald of the Arcane' },
      { id: 'OGN-308', name: 'Herald of the Arcane (Showcase)' },
    ],
    units: [
      { id: 'OGS-14', name: 'Lux, Crownguard' },
      { id: 'OGS-6',  name: 'Lux, Illuminated' },
    ],
    domain: 'Mind',
    secondaryDomain: 'Order',
  },
  {
    champion: 'Master Yi',
    legend: { id: 'OGS-19', name: 'Wuju Bladesman' },
    legendVariants: [
      { id: 'OGS-19', name: 'Wuju Bladesman' },
    ],
    units: [
      { id: 'OGS-4', name: 'Yi, Meditative' },
      { id: 'OGS-9', name: 'Yi, Honed' },
    ],
    domain: 'Calm',
    secondaryDomain: 'Body',
  },
  {
    champion: 'Miss Fortune',
    legend: { id: 'OGN-267', name: 'Bounty Hunter' },
    legendVariants: [
      { id: 'OGN-267', name: 'Bounty Hunter' },
      { id: 'OGN-309', name: 'Bounty Hunter (Showcase)' },
    ],
    units: [
      { id: 'OGN-162', name: 'Miss Fortune, Captain' },
      { id: 'OGN-193', name: 'Miss Fortune, Buccaneer' },
    ],
    domain: 'Body',
    secondaryDomain: 'Chaos',
  },
  {
    champion: 'Ornn',
    legend: { id: 'SFD-209', name: 'Fire Below the Mountain' },
    legendVariants: [
      { id: 'SFD-209', name: 'Fire Below the Mountain' },
    ],
    units: [
      { id: 'SFD-85', name: 'Ornn, Forge God' },
      { id: 'SFD-58', name: 'Ornn, Blacksmith' },
    ],
    domain: 'Calm',
    secondaryDomain: 'Mind',
  },
  {
    champion: "Rek'Sai",
    legend: { id: 'SFD-210', name: 'Void Burrower' },
    legendVariants: [
      { id: 'SFD-210', name: 'Void Burrower' },
    ],
    units: [
      { id: 'SFD-29',  name: "Rek'Sai, Breacher" },
      { id: 'SFD-170', name: "Rek'Sai, Swarm Queen" },
    ],
    domain: 'Fury',
    secondaryDomain: 'Order',
  },
  {
    champion: 'Renata Glasc',
    legend: { id: 'SFD-201', name: 'Chem-Baroness' },
    legendVariants: [
      { id: 'SFD-201', name: 'Chem-Baroness' },
    ],
    units: [
      { id: 'SFD-88',  name: 'Renata Glasc, Mastermind' },
      { id: 'SFD-171', name: 'Renata Glasc, Industrialist' },
    ],
    domain: 'Mind',
    secondaryDomain: 'Order',
  },
  {
    champion: 'Rumble',
    legend: { id: 'SFD-207', name: 'Mechanized Menace' },
    legendVariants: [
      { id: 'SFD-207', name: 'Mechanized Menace' },
    ],
    units: [
      { id: 'SFD-26', name: 'Rumble, Hotheaded' },
      { id: 'SFD-89', name: 'Rumble, Scrapper' },
    ],
    domain: 'Fury',
    secondaryDomain: 'Mind',
  },
  {
    champion: 'Sett',
    legend: { id: 'OGN-269', name: 'The Boss' },
    legendVariants: [
      { id: 'OGN-269', name: 'The Boss' },
      { id: 'OGN-310', name: 'The Boss (Showcase)' },
    ],
    units: [
      { id: 'OGN-164', name: 'Sett, Brawler' },
      { id: 'OGN-240', name: 'Sett, Kingpin' },
    ],
    domain: 'Body',
    secondaryDomain: 'Order',
  },
  {
    champion: 'Sivir',
    legend: { id: 'SFD-203', name: 'Battle Mistress' },
    legendVariants: [
      { id: 'SFD-203', name: 'Battle Mistress' },
    ],
    units: [
      { id: 'SFD-143', name: 'Sivir, Mercenary' },
      { id: 'SFD-120', name: 'Sivir, Ambitious' },
    ],
    domain: 'Body',
    secondaryDomain: 'Chaos',
  },
  {
    champion: 'Teemo',
    legend: { id: 'OGN-263', name: 'Swift Scout' },
    legendVariants: [
      { id: 'OGN-263', name: 'Swift Scout' },
      { id: 'OGN-307', name: 'Swift Scout (Showcase)' },
    ],
    units: [
      { id: 'OGN-197', name: 'Teemo, Scout' },
      { id: 'OGN-121', name: 'Teemo, Strategist' },
    ],
    domain: 'Mind',
    secondaryDomain: 'Chaos',
  },
  {
    champion: 'Viktor',
    legend: { id: 'OGN-265', name: 'Herald of the Arcane' },
    legendVariants: [
      { id: 'OGN-265', name: 'Herald of the Arcane' },
      { id: 'OGN-308', name: 'Herald of the Arcane (Showcase)' },
    ],
    units: [
      { id: 'OGN-246', name: 'Viktor, Leader' },
      { id: 'OGN-117', name: 'Viktor, Innovator' },
    ],
    domain: 'Mind',
    secondaryDomain: 'Order',
  },
  {
    champion: 'Volibear',
    legend: { id: 'OGN-249', name: 'Relentless Storm' },
    legendVariants: [
      { id: 'OGN-249', name: 'Relentless Storm' },
      { id: 'OGN-300', name: 'Relentless Storm (Showcase)' },
    ],
    units: [
      { id: 'OGN-41',  name: 'Volibear, Furious' },
      { id: 'OGN-158', name: 'Volibear, Imposing' },
    ],
    domain: 'Fury',
    secondaryDomain: 'Body',
  },
  {
    champion: 'Yasuo',
    legend: { id: 'OGN-259', name: 'Unforgiven' },
    legendVariants: [
      { id: 'OGN-259', name: 'Unforgiven' },
      { id: 'OGN-305', name: 'Unforgiven (Showcase)' },
    ],
    units: [
      { id: 'OGN-205', name: 'Yasuo, Windrider' },
      { id: 'OGN-76',  name: 'Yasuo, Remorseful' },
    ],
    domain: 'Calm',
    secondaryDomain: 'Chaos',
  },
];

// ─── Derived maps (generated from LEGENDS, single source of truth) ────────────

/** Legend ID → Champion name */
export const LEGEND_TO_CHAMPION_NAME: Record<string, string> = {};

/** Champion name → primary Legend ID */
export const CHAMPION_TO_PRIMARY_LEGEND_ID: Record<string, string> = {};

/** Champion name → all Legend IDs (regular + showcase) */
export const CHAMPION_TO_ALL_LEGEND_IDS: Record<string, string[]> = {};

/** Champion name → unit IDs */
export const CHAMPION_TO_UNIT_IDS: Record<string, string[]> = {};

for (const record of LEGENDS) {
  CHAMPION_TO_PRIMARY_LEGEND_ID[record.champion] = record.legend.id;
  CHAMPION_TO_ALL_LEGEND_IDS[record.champion] = record.legendVariants.map(v => v.id);
  CHAMPION_TO_UNIT_IDS[record.champion] = record.units.map(u => u.id);
  for (const variant of record.legendVariants) {
    LEGEND_TO_CHAMPION_NAME[variant.id] = record.champion;
  }
}

// ─── Helper functions ─────────────────────────────────────────────────────────

/** Get champion name from any legend ID */
export function getChampionFromLegend(legendId: string): string | undefined {
  return LEGEND_TO_CHAMPION_NAME[legendId];
}

/** Get the primary legend ID for a champion */
export function getPrimaryLegendId(champion: string): string | undefined {
  return CHAMPION_TO_PRIMARY_LEGEND_ID[champion];
}

/** Get full LegendRecord for a champion */
export function getLegendRecord(champion: string): LegendRecord | undefined {
  return LEGENDS.find(l => l.champion === champion);
}

/** Get full LegendRecord from a legend ID */
export function getLegendRecordFromId(legendId: string): LegendRecord | undefined {
  return LEGENDS.find(l => l.legendVariants.some(v => v.id === legendId));
}

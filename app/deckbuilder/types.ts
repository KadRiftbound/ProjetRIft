export interface DeckCard {
  id: string;
  name: string;
  type: string;
  domain: string;
  rarity: string;
  energy: number;
  might: number;
  power: number;
  rules: string;
  count: number;
  imageUrl?: string;
}

export interface Deck {
  id: string;
  name: string;
  domain: string;
  cards: DeckCard[];
  battlefields: DeckCard[];
  chosenChampion?: DeckCard | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeckStats {
  totalCards: number;
  champions: number;
  units: number;
  spells: number;
  gear: number;
  legend: number;
  battlefields: number;
  averageEnergy: string;
  domainDistribution: Record<string, number>;
  rarityDistribution: Record<string, number>;
}

export function calculateDeckStats(cards: DeckCard[], battlefields: DeckCard[] = []): DeckStats {
  const totalCards = cards.reduce((sum, card) => sum + card.count, 0);
  const champions = cards.filter(c => c.type === 'Champion').reduce((sum, c) => sum + c.count, 0);
  const units = cards.filter(c => c.type === 'Unit').reduce((sum, c) => sum + c.count, 0);
  const spells = cards.filter(c => c.type === 'Spell').reduce((sum, c) => sum + c.count, 0);
  const gear = cards.filter(c => c.type === 'Gear').reduce((sum, c) => sum + c.count, 0);
  const legend = cards.filter(c => c.type === 'Legend').reduce((sum, c) => sum + c.count, 0);
  const battlefieldCount = battlefields.reduce((sum, c) => sum + c.count, 0);

  const domainDistribution: Record<string, number> = {};
  const rarityDistribution: Record<string, number> = {};
  let totalEnergy = 0;

  cards.forEach(card => {
    domainDistribution[card.domain] = (domainDistribution[card.domain] || 0) + card.count;
    rarityDistribution[card.rarity] = (rarityDistribution[card.rarity] || 0) + card.count;
    totalEnergy += (card.energy || 0) * card.count;
  });

  battlefields.forEach(card => {
    domainDistribution[card.domain] = (domainDistribution[card.domain] || 0) + card.count;
    rarityDistribution[card.rarity] = (rarityDistribution[card.rarity] || 0) + card.count;
  });

  return {
    totalCards,
    champions,
    units,
    spells,
    gear,
    legend,
    battlefields: battlefieldCount,
    averageEnergy: totalCards > 0 ? (totalEnergy / totalCards).toFixed(1) : '0',
    domainDistribution,
    rarityDistribution,
  };
}

export function exportDeckToText(deck: Deck): string {
  const lines = [
    `# ${deck.name}`,
    `## ${deck.domain}`,
    ``,
    `### Champion choisi`,
    ...(deck.chosenChampion ? [`- 1x ${deck.chosenChampion.name}`] : ['- Aucun']),
    ``,
    `### Battlefields`,
    ...deck.battlefields.map(c => `- ${c.count}x ${c.name}`),
    ``,
    `### Champions`,
    ...deck.cards.filter(c => c.type === 'Champion').map(c => `- ${c.count}x ${c.name}`),
    ``,
    `### Units`,
    ...deck.cards.filter(c => c.type === 'Unit').map(c => `- ${c.count}x ${c.name}`),
    ``,
    `### Spells`,
    ...deck.cards.filter(c => c.type === 'Spell').map(c => `- ${c.count}x ${c.name}`),
    ``,
    `### Equipements`,
    ...deck.cards.filter(c => c.type === 'Gear').map(c => `- ${c.count}x ${c.name}`),
    ``,
    `Total: ${deck.cards.reduce((sum, c) => sum + c.count, 0)} cartes`,
  ];
  return lines.filter(l => l !== '').join('\n');
}

export const MAX_CARDS_IN_DECK = 40;
export const MAX_SAME_CARD = 3;
export const MIN_DECK_SIZE = 25;

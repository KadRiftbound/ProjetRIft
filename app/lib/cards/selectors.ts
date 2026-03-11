// ============================================================
// SÉLECTEURS UNIFIÉS POUR LES CARTES
// Point d'entrée unique pour toutes les données de cartes
// ============================================================

// Ré-exporter les types unifiés
export {
  type RiftboundCard,
  type CardVariant,
  type CardType,
  type RarityType,
  type DomainType,
  type SetType,
  CARD_TYPES,
  RARITIES,
  DOMAINS,
  DOMAIN_COLORS
} from './schema';

// Ré-exporter les données depuis riftbound-full (source canonique)
export {
  ALL_CARDS,
  ORIGINS_CARDS,
  PROVING_GROUNDS_CARDS,
  SPIRITFORGED_CARDS,
  SETS,
  getCardById,
  getCardsBySet,
  getChampions,
  getCardsByDomain,
} from './data';

// --- Sélecteurs supplémentaires ---

import { ALL_CARDS, getCardById, getCardsBySet, getChampions, getCardsByDomain } from './data';
import type { RiftboundCard, CardType, DomainType, RarityType } from './schema';

// Obtenir toutes les légendes (Legend type)
export function getLegends(): RiftboundCard[] {
  return ALL_CARDS.filter(c => c.type === 'Legend');
}

// Obtenir toutes les unités
export function getUnits(): RiftboundCard[] {
  return ALL_CARDS.filter(c => c.type === 'Unit');
}

// Obtenir tous les sorts
export function getSpells(): RiftboundCard[] {
  return ALL_CARDS.filter(c => c.type === 'Spell');
}

// Obtenir tous les équipements
export function getGear(): RiftboundCard[] {
  return ALL_CARDS.filter(c => c.type === 'Gear');
}

// Obtenir toutes les runes
export function getRunes(): RiftboundCard[] {
  return ALL_CARDS.filter(c => c.type === 'Rune');
}

// Obtenir tous les battlefields
export function getBattlefields(): RiftboundCard[] {
  return ALL_CARDS.filter(c => c.type === 'Battlefield');
}

// Rechercher des cartes avec filtres
export function searchCards(params: {
  q?: string;
  set?: string;
  domain?: string;
  type?: CardType;
  rarity?: RarityType;
  limit?: number;
  offset?: number;
}): RiftboundCard[] {
  let cards = [...ALL_CARDS];

  if (params.q) {
    const query = params.q.toLowerCase();
    cards = cards.filter(c => c.name.toLowerCase().includes(query));
  }

  if (params.set) {
    cards = cards.filter(c => c.set.toLowerCase() === params.set!.toLowerCase());
  }

  if (params.domain) {
    cards = cards.filter(c => c.domain.toLowerCase() === params.domain!.toLowerCase());
  }

  if (params.type) {
    cards = cards.filter(c => c.type === params.type);
  }

  if (params.rarity) {
    cards = cards.filter(c => c.rarity === params.rarity);
  }

  const offset = params.offset || 0;
  const limit = params.limit || cards.length;

  return cards.slice(offset, offset + limit);
}

// Obtenir l'URL d'image principale d'une carte
export function getCardImageUrl(card: RiftboundCard): string {
  if (card.variants && card.variants.length > 0) {
    return card.variants[0].imageUrl;
  }
  return '';
}

// Obtenir une carte par son ID (alias pour compatibilité)
export function findCardById(id: string): RiftboundCard | undefined {
  return getCardById(id);
}

// Compter les cartes par type
export function getCardCountByType(): Record<CardType, number> {
  const counts: Record<CardType, number> = {
    Champion: 0,
    Unit: 0,
    Spell: 0,
    Gear: 0,
    Rune: 0,
    Legend: 0,
    Battlefield: 0,
  };

  ALL_CARDS.forEach(card => {
    counts[card.type as CardType]++;
  });

  return counts;
}

// Compter les cartes par domaine
export function getCardCountByDomain(): Record<string, number> {
  const counts: Record<string, number> = {};

  ALL_CARDS.forEach(card => {
    counts[card.domain] = (counts[card.domain] || 0) + 1;
  });

  return counts;
}

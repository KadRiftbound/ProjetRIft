// ============================================================
// TYPES PUBLICS POUR L'APPLICATION
// ============================================================

// Ré-exporter les types unifiés depuis cards
export { 
  type RiftboundCard,
  type CardType,
  type RarityType, 
  type DomainType,
  type SetType,
  type CardVariant,
  CARD_TYPES,
  RARITIES,
  DOMAINS,
  SETS,
  DOMAIN_COLORS
} from '../lib/cards/types';

// Types pour les decks
export { type DeckCard, type Deck, type DeckStats } from '../lib/cards/types';

// Types pour les guides
export { type LegendGuide } from '../lib/cards/types';

// Types pour les decks méta
export { type MetaDeck, type Tournament } from '../lib/cards/types';

// Types pour l'authentification (garder ceux existants)
export interface Card {
  id: string;
  name: string;
  number: string;
  domain: string;
  type: string;
  rarity: string;
  rules: string | string[];
  images: {
    type?: string;
    large?: string;
    medium?: string;
    small?: string;
  }[];
  expansion: {
    id: string;
    name: string;
    code?: string;
  };
}

export interface Legend extends Card {
  ability: string;
  domain: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
}

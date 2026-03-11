// Backwards compatibility re-export for card-related types
export * from './schema';
export { SETS } from './data';

// Re-export app-wide shared types from their canonical modules
export type { DeckCard, Deck, DeckStats } from '../../deckbuilder/types';
export type { LegendGuide } from '../legend-guides';

export type { MetaDeck } from '../../decks/data';
export type { Tournament } from '../../decks/data';

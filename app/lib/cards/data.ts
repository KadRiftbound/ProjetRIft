// ============================================================
// DONNÉES CANONIQUES DES CARTES (JSON)
// Chargées depuis data/cards.json et data/sets.json
// ============================================================

// Import JSON data (bundled statiquement par Next)
// Note: chemin relatif depuis app/lib/cards → project root
import cardsJson from '../../../data/cards.json';
import setsJson from '../../../data/sets.json';

import type { RiftboundCard } from './schema';

export const ALL_CARDS: RiftboundCard[] = (cardsJson as any) as RiftboundCard[];

// Sets map tel que dans riftbound-full (clé = code set)
export const SETS: Record<string, { id: string; name: string }> = setsJson as any;

// Sous-ensembles pratiques (par compat)
export const ORIGINS_CARDS: RiftboundCard[] = ALL_CARDS.filter(c => c.set === 'OGN');
export const PROVING_GROUNDS_CARDS: RiftboundCard[] = ALL_CARDS.filter(c => c.set === 'OGS');
export const SPIRITFORGED_CARDS: RiftboundCard[] = ALL_CARDS.filter(c => c.set === 'SFD');

export function getCardById(id: string): RiftboundCard | undefined {
  const searchId = id.toUpperCase();
  return ALL_CARDS.find(c => c.id.toUpperCase() === searchId);
}

export function getCardsBySet(setId: string): RiftboundCard[] {
  return ALL_CARDS.filter(c => c.set.toUpperCase() === setId.toUpperCase());
}

export function getChampions(): RiftboundCard[] {
  return ALL_CARDS.filter(c => c.type === 'Champion');
}

export function getCardsByDomain(domain: string): RiftboundCard[] {
  return ALL_CARDS.filter(c => (c.domain || '').toLowerCase() === domain.toLowerCase());
}

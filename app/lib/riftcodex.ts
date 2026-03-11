import { ALL_CARDS, getCardById, getCardsBySet, getChampions, getCardsByDomain, SETS, getCardImageUrl, type RiftboundCard } from './cards';
import { transformCardToView } from './cards/transformers';

export { getCardById, getCardsBySet, getChampions, getCardsByDomain, ALL_CARDS, SETS, getCardImageUrl };

export type { RiftboundCard };

interface SearchParams {
  q?: string;
  limit?: number;
  offset?: number;
  set?: string;
  domain?: string;
  type?: string;
  rarity?: string;
}

export async function searchCards(params: SearchParams = {}): Promise<RiftboundCard[]> {
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
    cards = cards.filter(c => c.type.toLowerCase() === params.type!.toLowerCase());
  }

  if (params.rarity) {
    cards = cards.filter(c => c.rarity.toLowerCase() === params.rarity!.toLowerCase());
  }

  const offset = params.offset || 0;
  const limit = params.limit || cards.length;

  return cards.slice(offset, offset + limit);
}

export async function getCardByIdPublic(id: string): Promise<RiftboundCard | null> {
  const card = getCardById(id);
  return card || null;
}

export async function getSets() {
  return Object.values(SETS);
}

export { transformCardToView };

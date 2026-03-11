// ============================================================
// TYPES UNIFIES POUR RIFTBOUND
// Source de verite unique pour toutes les donnees de cartes
// ============================================================

// --- Types de base ---

export type CardType = 'Champion' | 'Unit' | 'Spell' | 'Gear' | 'Rune' | 'Legend' | 'Battlefield';
export type RarityType = 'Champion' | 'Epic' | 'Rare' | 'Uncommon' | 'Common' | 'Showcase';
// Domaines réels dans les données de cartes (OGN/OGS/SFD)
export type DomainType = 'Fury' | 'Calm' | 'Mind' | 'Body' | 'Chaos' | 'Order' | 'Colorless';
export type SetType = 'OGN' | 'OGS' | 'SFD';

// --- Interface Carte ---

export interface CardVariant {
  id: string;
  name: string;
  imageUrl: string;
  variantType: string;
}

export interface RiftboundCard {
  id: string;
  name: string;
  set: string;
  setName: string;
  number: number;
  type: string;
  domain: string;
  rarity: string;
  energy: number;
  might: number;
  power: number;
  rules: string;
  artist: string;
  variants: CardVariant[];
}

// --- Helpers pour les types ---

export const CARD_TYPES: CardType[] = ['Champion', 'Unit', 'Spell', 'Gear', 'Rune', 'Legend', 'Battlefield'];
export const RARITIES: RarityType[] = ['Champion', 'Epic', 'Rare', 'Uncommon', 'Common', 'Showcase'];
export const DOMAINS: DomainType[] = ['Fury', 'Calm', 'Mind', 'Body', 'Chaos', 'Order', 'Colorless'];

// --- Couleurs Tailwind par domaine (classes text + bg + border) ---
// Couvre les domaines actuels (cartes) et anciens (tierlist/meta hérités)
export const DOMAIN_COLORS: Record<string, string> = {
  // Domaines actuels
  Fury:      'text-red-400 border-red-500/30 bg-red-500/10',
  Calm:      'text-blue-400 border-blue-500/30 bg-blue-500/10',
  Mind:      'text-purple-400 border-purple-500/30 bg-purple-500/10',
  Body:      'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  Chaos:     'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  Order:     'text-orange-400 border-orange-500/30 bg-orange-500/10',
  Colorless: 'text-gray-400 border-gray-500/30 bg-gray-500/10',
  // Domaines hérités (tierlist/meta)
  Cunning:   'text-blue-400 border-blue-500/30 bg-blue-500/10',
  Glory:     'text-amber-400 border-amber-500/30 bg-amber-500/10',
  Void:      'text-pink-400 border-pink-500/30 bg-pink-500/10',
  Knowledge: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
  Hope:      'text-green-400 border-green-500/30 bg-green-500/10',
};

// Variantes utilitaires (text seulement, bg+text+border)
export function domainTextColor(domain: string): string {
  return DOMAIN_COLORS[domain]?.split(' ')[0] ?? 'text-gray-400';
}
export function domainBadgeClasses(domain: string): string {
  return DOMAIN_COLORS[domain] ?? 'text-gray-400 border-gray-500/30 bg-gray-500/10';
}

// --- Types pour les decks ---

// Deck/Legend/Tier/Meta types vivent dans leurs modules dédiés

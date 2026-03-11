'use client';

import { Deck } from '../deckbuilder/types';

const DECKS_KEY = 'riftbound_decks';
const USER_KEY = 'riftbound_user';

export interface LocalUser {
  id: string;
  email: string;
  name: string;
}

// --- User Management ---

export function getLocalUser(): LocalUser | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setLocalUser(user: LocalUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logoutLocalUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}

// --- Deck Management ---

export function getLocalDecks(): Deck[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(DECKS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveLocalDeck(deck: Deck): void {
  if (typeof window === 'undefined') return;
  const decks = getLocalDecks();
  const existingIndex = decks.findIndex(d => d.id === deck.id);
  
  if (existingIndex >= 0) {
    decks[existingIndex] = deck;
  } else {
    decks.push(deck);
  }
  
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
}

export function deleteLocalDeck(deckId: string): void {
  if (typeof window === 'undefined') return;
  const decks = getLocalDecks();
  const filtered = decks.filter(d => d.id !== deckId);
  localStorage.setItem(DECKS_KEY, JSON.stringify(filtered));
}

export function getLocalDeckById(deckId: string): Deck | undefined {
  const decks = getLocalDecks();
  return decks.find(d => d.id === deckId);
}

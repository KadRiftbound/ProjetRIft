import { NextResponse } from 'next/server';
import { META_DECKS, OFFMETA_DECKS } from '../../decks/data';

// Get day number since epoch (changes every 2 days)
function getTwoDayPeriod(): number {
  const now = new Date();
  const epoch = new Date('2024-01-01');
  const diffDays = Math.floor((now.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 2);
}

// Deterministic random based on day
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export async function GET() {
  const period = getTwoDayPeriod();
  const seed = period * 7 + 42; // Deterministic seed
  
  // Combine meta and offmeta decks
  const allDecks = [...META_DECKS, ...OFFMETA_DECKS];
  
  // Pick deck based on day
  const deckIndex = Math.floor(seededRandom(seed) * allDecks.length);
  const deck = allDecks[deckIndex];
  
  // Determine rotation info
  const now = new Date();
  const nextChange = new Date(now);
  nextChange.setDate(nextChange.getDate() + (2 - (nextChange.getDate() % 2)));
  nextChange.setHours(0, 0, 0, 0);
  
  const daysUntilChange = Math.ceil((nextChange.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Get legend image
  const legendImage = `/legends/${deck.id.includes('offmeta') ? 'SFD-185' : deck.id}`;
  
  return NextResponse.json({
    deck: {
      id: deck.id,
      champion: deck.champion,
      fullName: deck.fullName,
      domain: deck.domain,
      secondDomain: deck.secondDomain,
      archetype: deck.archetype,
      tier: deck.tier,
      description: deck.description,
      difficulty: deck.difficulty,
      keyCards: deck.keyCards,
      strengths: deck.strengths,
      weaknesses: deck.weaknesses,
    },
    meta: {
      type: deckIndex < META_DECKS.length ? 'meta' : 'offmeta',
      rotationDay: daysUntilChange,
      nextChange: nextChange.toISOString(),
      period,
    },
  });
}

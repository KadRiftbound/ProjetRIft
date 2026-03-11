import { NextResponse } from 'next/server';
import { RAW_META_DECKS } from '../../decks/data';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface DeckNewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  sourceType: 'official';
  confidence: 'confirmed';
  sources: string[];
  deckId: string;
}

// ─── TEMPLATES ────────────────────────────────────────────────────────────────

const TIER_LABELS: Record<string, string> = {
  S: 'S-tier',
  A: 'A-tier',
  B: 'B-tier',
  C: 'C-tier',
};

const ARCHETYPE_LABELS: Record<string, string> = {
  Midrange: 'Midrange',
  Miracle: 'Miracle',
  Aggro: 'Aggro',
  Control: 'Contrôle',
  Combo: 'Combo',
  Tempo: 'Tempo',
};

function generateDeckNews(deck: typeof RAW_META_DECKS[0], index: number): DeckNewsItem {
  const tier = TIER_LABELS[deck.tier] ?? deck.tier;
  const archetype = ARCHETYPE_LABELS[deck.archetype] ?? deck.archetype;
  const deckName = deck.fullName;
  const keyCard = deck.keyCards[0] ?? '';

  const templates = [
    {
      title: `${deckName} — Deck ${tier} à surveiller`,
      description: `${deck.description} Cartes clés : ${deck.keyCards.slice(0, 3).join(', ')}.`,
    },
    {
      title: `Guide ${archetype} : ${deck.champion} domine la meta`,
      description: `${deck.playstyle} Points forts : ${deck.strengths[0]}.`,
    },
    {
      title: `${deck.champion} ${archetype} : ${deck.placement}`,
      description: `${deck.description} Résultats récents : ${deck.results[0]?.event ?? deck.tournament}, ${deck.results[0]?.placement ?? deck.placement}.`,
    },
    {
      title: `Deck tech : ${deckName}`,
      description: `Découvrez ce deck ${tier} ${archetype}. Carte clé : ${keyCard}. ${deck.playstyle}`,
    },
  ];

  const template = templates[index % templates.length];

  // Simulate a progressive pubDate per deck (most recent deck = today - offset)
  const offsetDays = index * 2;
  const pubDate = new Date(Date.now() - offsetDays * 86400000).toISOString();

  return {
    title: template.title,
    link: `/decks?deck=${deck.id}`,
    description: template.description,
    pubDate,
    source: 'Riftbound Guide',
    sourceType: 'official',
    confidence: 'confirmed',
    sources: ['Riftbound Guide'],
    deckId: deck.id,
  };
}

// ─── GET HANDLER ──────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '6', 10), 20);

  // Generate news for the top N decks (sorted by tier then metaShare)
  const sorted = [...RAW_META_DECKS].sort((a, b) => {
    const tierOrder = { S: 0, A: 1, B: 2, C: 3 };
    const tA = tierOrder[a.tier as keyof typeof tierOrder] ?? 4;
    const tB = tierOrder[b.tier as keyof typeof tierOrder] ?? 4;
    if (tA !== tB) return tA - tB;
    return (b.metaShare ?? 0) - (a.metaShare ?? 0);
  });

  const news: DeckNewsItem[] = sorted.slice(0, limit).map((deck, i) =>
    generateDeckNews(deck, i),
  );

  return NextResponse.json({
    news,
    meta: {
      total: news.length,
      generatedAt: new Date().toISOString(),
    },
  });
}

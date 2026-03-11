'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getLocalDecks, deleteLocalDeck } from '../lib/local-storage';
import type { Deck as SavedDeck } from '../deckbuilder/types';
import { META_DECKS, MAJOR_TOURNAMENTS, OFFMETA_DECKS, type MetaDeck } from './data';
import { domainBadgeClasses, domainTextColor, ALL_CARDS } from '../lib/cards';
import { CHAMPION_TO_PRIMARY_LEGEND_ID } from '../lib/legend-index';
import { CardRail } from '../components/ui/CardRail';

const BEAUTIFUL_CARDS = [
  { id: "OGN-66", name: "Ahri, Alluring", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/fabbcc2f83f397cf07299236a702db05a151053b-744x1039.png" },
  { id: "OGN-41", name: "Volibear, Furious", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/c9165d49b8caae9a856433cd5151e8b368eb80b5-744x1039.png" },
  { id: "OGN-39", name: "Kai'Sa, Survivor", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/ad69bde670ce218adee1d2a618a7295d2fb7bd4c-744x1039.png" },
  { id: "OGN-55", name: "Yasuo, Tempest", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/8f2cf4d6c0bcf65e93f7f4cf2cc5b6d6a7bd8c1a-744x1039.png" },
  { id: "OGN-45", name: "Thresh, Eternal", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/9a8c5d4e3b7cf76e84f6e5dd2bb4c5e7b8cd9a2b-744x1039.png" },
  { id: "OGN-37", name: "Leona, Radiant", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/7b6d5e4c3a8bf97f65e4f5cc2aa5b6d7c8be8a3b-744x1039.png" },
  { id: "SFD-185", name: "Draven, Vanquisher", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/8fa3f1fe63392c4744152d98ff781497a4d17b74-744x1039.png" },
  { id: "SFD-195", name: "Irelia, Blade Dancer", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/7e8d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1e0d9-744x1039.png" },
  { id: "SFD-132", name: "Kai'Sa, Void Seeker", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/6d5c4b3a2e1f0d9c8b7a6f5e4d3c2b1a0f9e8d7-744x1039.png" },
  { id: "OGN-299", name: "Aurelion Sol, Star Forger", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/5c4b3a2d1e0f9c8b7a6f5e4d3c2b1a0f9e8d7c-744x1039.png" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Get card stats from decklist
function getDeckStats(decklist: { name: string; count: number }[] | undefined) {
  if (!decklist || decklist.length === 0) return { costs: [], recycles: [], powers: [] };
  
  const costs: number[] = [];
  const recycles: number[] = [];
  const powers: number[] = [];
  
  for (const card of decklist) {
    // Find card in ALL_CARDS by name (fuzzy match)
    const matchedCard = ALL_CARDS.find(c => 
      c.name.toLowerCase().includes(card.name.toLowerCase()) ||
      card.name.toLowerCase().includes(c.name.toLowerCase())
    );
    
    if (matchedCard) {
      for (let i = 0; i < card.count; i++) {
        costs.push(matchedCard.energy);
        recycles.push(matchedCard.might);
        powers.push(matchedCard.power);
      }
    }
  }
  
  return { costs, recycles, powers };
}

// Check if deck has any card matching the filter value
function deckHasStatValue(decklist: { name: string; count: number }[] | undefined, statType: 'cost' | 'recycle' | 'power', value: number): boolean {
  if (!decklist || decklist.length === 0 || !value) return true;
  
  for (const card of decklist) {
    const matchedCard = ALL_CARDS.find(c => 
      c.name.toLowerCase().includes(card.name.toLowerCase()) ||
      card.name.toLowerCase().includes(c.name.toLowerCase())
    );
    
    if (matchedCard) {
      const cardValue = statType === 'cost' ? matchedCard.energy : 
                        statType === 'recycle' ? matchedCard.might : 
                        matchedCard.power;
      if (cardValue === value) return true;
    }
  }
  return false;
}

function getLegendImage(champion: string): string | null {
  const legendId = CHAMPION_TO_PRIMARY_LEGEND_ID[champion];
  if (!legendId) return null;
  const card = ALL_CARDS.find(c => c.id === legendId);
  return card?.variants?.[0]?.imageUrl ?? null;
}

const TIER_COLORS: Record<string, string> = {
  S: 'bg-red-600 text-white shadow-[0_0_16px_rgba(220,38,38,0.5)]',
  A: 'bg-orange-500 text-white shadow-[0_0_16px_rgba(249,115,22,0.5)]',
  B: 'bg-yellow-500 text-black shadow-[0_0_16px_rgba(234,179,8,0.5)]',
  C: 'bg-blue-500 text-white shadow-[0_0_16px_rgba(59,130,246,0.5)]',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  'Débutant': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Intermédiaire': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Expert': 'bg-red-500/20 text-red-400 border-red-500/30',
};

type Tab = 'meta' | 'offmeta' | 'all' | 'tournaments' | 'saved';

// ─── Deck Card Component ──────────────────────────────────────────────────────

function DeckCard({
  deck,
  expanded,
  onToggle,
}: {
  deck: MetaDeck;
  expanded: boolean;
  onToggle: () => void;
}) {
  const imageUrl = getLegendImage(deck.champion);
  const totalCards = deck.decklist?.reduce((sum, c) => sum + c.count, 0) || null;

  return (
    <div
      className={`group relative bg-[var(--surface-3)] rounded-2xl border overflow-hidden transition-all duration-500 ${
        expanded
          ? 'border-rift-purple/50 shadow-[0_0_50px_rgba(139,92,246,0.15)]'
          : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
      }`}
    >
      {/* Card Header — click to expand */}
      <div
        onClick={onToggle}
        className="cursor-pointer flex items-stretch"
      >
        {/* Legend Portrait */}
        <div className="relative w-24 md:w-32 shrink-0 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={deck.champion}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
              style={{ minHeight: '8rem' }}
            />
          ) : (
            <div className="w-full h-full min-h-[8rem] bg-gradient-to-b from-[var(--border-subtle)] to-transparent flex items-center justify-center">
              <span className="text-4xl opacity-20">🃏</span>
            </div>
          )}
          {/* Gradient fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--surface-3)] pointer-events-none" />
          {/* Tier badge */}
          <div className={`absolute top-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${TIER_COLORS[deck.tier]}`}>
            {deck.tier}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight truncate">
                {deck.champion}
              </h3>
              <span className="text-[8px] font-black text-[var(--text-disabled)] uppercase tracking-widest shrink-0">
                {deck.archetype}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${domainBadgeClasses(deck.domain)}`}>
                {deck.domain}
              </span>
              {deck.secondDomain && (
                <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${domainBadgeClasses(deck.secondDomain)}`}>
                  {deck.secondDomain}
                </span>
              )}
              {deck.difficulty && (
                <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${DIFFICULTY_COLORS[deck.difficulty] ?? ''}`}>
                  {deck.difficulty}
                </span>
              )}
              {totalCards && (
                <span className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded border bg-white/5 text-gray-400 border-white/10">
                  {totalCards} cartes
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 shrink-0">
            {deck.metaShare > 0 && (
              <div className="text-center hidden sm:block">
                <div className="text-base font-black text-rift-blue">{deck.metaShare}%</div>
                <div className="text-[7px] font-bold text-[var(--text-disabled)] uppercase tracking-widest">Méta</div>
              </div>
            )}
            <div className={`text-[var(--text-tertiary)] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Panel */}
      {expanded && (
        <div className="border-t border-[var(--border-subtle)] bg-black/30 animate-in slide-in-from-top-2 duration-300">
          {/* Quick stats bar */}
          <div className="px-6 py-3 bg-gradient-to-r from-rift-purple/10 to-transparent flex items-center gap-6 text-xs">
            <span className="text-gray-400">
              <span className="text-white font-bold">{totalCards || '—'}</span> cartes
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">
              <span className="text-rift-gold font-bold">{deck.keyCards.length}</span> cartes clés
            </span>
            {deck.prerequisites && deck.prerequisites.length > 0 && (
              <>
                <span className="text-gray-500">|</span>
                <span className="text-yellow-400">
                  <span className="font-bold">{deck.prerequisites.length}</span> prérequis
                </span>
              </>
            )}
          </div>

          <div className="grid lg:grid-cols-12 gap-0">
            {/* Left: Strategy + Decklist */}
            <div className="lg:col-span-7 px-6 py-5 space-y-5">
              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed border-l-2 border-rift-purple/30 pl-4">
                &ldquo;{deck.description}&rdquo;
              </p>

              {/* Playstyle */}
              <div>
                <h4 className="text-[8px] font-black text-rift-purple uppercase tracking-[0.3em] mb-2">
                  Style de jeu
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{deck.playstyle}</p>
              </div>

              {/* Decklist - displayed prominently */}
              {deck.decklist && deck.decklist.length > 0 && (
                <div className="bg-[var(--surface-2)] rounded-xl p-4 border border-[var(--border-subtle)]">
                  <h4 className="text-[9px] font-black text-rift-blue uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Decklist complète
                  </h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                    {deck.decklist.map((card, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px] py-0.5">
                        <span className="text-[var(--text-secondary)] font-medium truncate">{card.name}</span>
                        <span className="text-[var(--text-disabled)] font-black ml-3 shrink-0">×{card.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              {deck.prerequisites && deck.prerequisites.length > 0 && (
                <div>
                  <h4 className="text-[8px] font-black text-yellow-400 uppercase tracking-[0.3em] mb-2">
                    Prérequis nécessaires
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {deck.prerequisites.map((req, i) => (
                      <span key={i} className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-[10px] font-bold text-yellow-400">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Cards */}
              <div>
                <h4 className="text-[8px] font-black text-rift-gold uppercase tracking-[0.3em] mb-2">
                  Cartes clés
                </h4>
                <div className="flex flex-wrap gap-2">
                  {deck.keyCards.map(c => (
                    <span key={c} className="px-2.5 py-1 bg-[var(--border-subtle)] border border-[var(--border-default)] rounded-lg text-[10px] font-bold text-[var(--text-secondary)]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Strengths + Weaknesses + CTA */}
            <div className="lg:col-span-5 px-6 py-5 bg-black/20 border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                  <h4 className="text-[8px] font-black text-green-400 uppercase tracking-widest mb-2">Forces</h4>
                  <ul className="text-[10px] text-[var(--text-secondary)] space-y-1">
                    {deck.strengths.map(s => (
                      <li key={s} className="flex gap-1.5">
                        <span className="text-green-500 shrink-0">+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <h4 className="text-[8px] font-black text-red-400 uppercase tracking-widest mb-2">Faiblesses</h4>
                  <ul className="text-[10px] text-[var(--text-secondary)] space-y-1">
                    {deck.weaknesses.map(w => (
                      <li key={w} className="flex gap-1.5">
                        <span className="text-red-500 shrink-0">−</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Link
                href={`/deckbuilder?deck=${encodeURIComponent(deck.champion)}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black font-black text-xs rounded-xl hover:scale-[1.02] transition-all tracking-widest"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                COPIER CE DECK
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Deck Grid Card (tabs ALL / OFFMETA) ──────────────────────────────────────

function DeckGridCard({ deck, onExpand }: { deck: MetaDeck; onExpand: () => void }) {
  const imageUrl = getLegendImage(deck.champion);

  return (
    <div
      onClick={onExpand}
      className="group relative cursor-pointer bg-[var(--surface-3)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] hover:border-rift-purple/40 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)] hover:-translate-y-1"
    >
      {/* Portrait */}
      <div className="relative aspect-[3/2] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={deck.champion}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--border-subtle)] to-transparent flex items-center justify-center">
            <span className="text-5xl opacity-10">🃏</span>
          </div>
        )}
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-3)] via-[var(--surface-3)]/30 to-transparent" />

        {/* Tier badge */}
        {deck.tier && (
          <div className={`absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${TIER_COLORS[deck.tier]}`}>
            {deck.tier}
          </div>
        )}

        {/* Domain badges bottom-left */}
        <div className="absolute bottom-3 left-3 flex gap-1">
          <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${domainBadgeClasses(deck.domain)}`}>
            {deck.domain}
          </span>
          {deck.secondDomain && (
            <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${domainBadgeClasses(deck.secondDomain)}`}>
              {deck.secondDomain}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tight">{deck.champion}</h3>
          <span className="text-[9px] font-black text-[var(--text-disabled)] uppercase tracking-widest shrink-0">{deck.archetype}</span>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] line-clamp-2 mb-3">{deck.description}</p>
        {deck.difficulty && (
          <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${DIFFICULTY_COLORS[deck.difficulty] ?? ''}`}>
            {deck.difficulty}
          </span>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <span className="text-[10px] font-black text-white bg-rift-purple px-4 py-2 rounded-full tracking-widest">
          VOIR LE DECK ▼
        </span>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function DeckLibraryPage() {
  const [tab, setTab] = useState<Tab>('meta');
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterCost, setFilterCost] = useState<string>('');
  const [filterRecycle, setFilterRecycle] = useState<string>('');
  const [filterPower, setFilterPower] = useState<string>('');
  const [expandedDeck, setExpandedDeck] = useState<string | null>(null);
  const [localDecks, setLocalDecks] = useState<SavedDeck[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [gridExpanded, setGridExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLocalDecks(getLocalDecks());
  }, [tab]);

  const filteredMeta = META_DECKS.filter(d => {
    const matchSearch =
      search === '' ||
      d.champion.toLowerCase().includes(search.toLowerCase()) ||
      d.archetype.toLowerCase().includes(search.toLowerCase()) ||
      d.domain.toLowerCase().includes(search.toLowerCase()) ||
      d.secondDomain.toLowerCase().includes(search.toLowerCase());
    const matchTier = filterTier === 'all' || d.tier === filterTier;
    const matchCost = !filterCost || deckHasStatValue(d.decklist, 'cost', parseInt(filterCost));
    const matchRecycle = !filterRecycle || deckHasStatValue(d.decklist, 'recycle', parseInt(filterRecycle));
    const matchPower = !filterPower || deckHasStatValue(d.decklist, 'power', parseInt(filterPower));
    return matchSearch && matchTier && matchCost && matchRecycle && matchPower;
  });

  const allDecks = [...META_DECKS, ...OFFMETA_DECKS];

  const filteredAllDecks = allDecks.filter(d => {
    const matchSearch =
      search === '' ||
      d.champion.toLowerCase().includes(search.toLowerCase()) ||
      d.archetype.toLowerCase().includes(search.toLowerCase()) ||
      d.domain.toLowerCase().includes(search.toLowerCase()) ||
      d.secondDomain.toLowerCase().includes(search.toLowerCase());
    const matchTier = filterTier === 'all' || d.tier === filterTier;
    const matchCost = !filterCost || deckHasStatValue(d.decklist, 'cost', parseInt(filterCost));
    const matchRecycle = !filterRecycle || deckHasStatValue(d.decklist, 'recycle', parseInt(filterRecycle));
    const matchPower = !filterPower || deckHasStatValue(d.decklist, 'power', parseInt(filterPower));
    return matchSearch && matchTier && matchCost && matchRecycle && matchPower;
  });

  const filteredOffmeta = OFFMETA_DECKS.filter(d => {
    const matchSearch =
      search === '' ||
      d.champion.toLowerCase().includes(search.toLowerCase()) ||
      d.archetype.toLowerCase().includes(search.toLowerCase()) ||
      d.domain.toLowerCase().includes(search.toLowerCase()) ||
      d.secondDomain.toLowerCase().includes(search.toLowerCase());
    const matchTier = filterTier === 'all' || d.tier === filterTier;
    const matchCost = !filterCost || deckHasStatValue(d.decklist, 'cost', parseInt(filterCost));
    const matchRecycle = !filterRecycle || deckHasStatValue(d.decklist, 'recycle', parseInt(filterRecycle));
    const matchPower = !filterPower || deckHasStatValue(d.decklist, 'power', parseInt(filterPower));
    return matchSearch && matchTier && matchCost && matchRecycle && matchPower;
  });

  return (
    <div className="min-h-screen bg-[var(--surface-2)] py-20 px-4 md:px-8">
      {/* Background Card Rails */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
        <div className="absolute -top-20 left-0 right-0">
          <CardRail
            cards={BEAUTIFUL_CARDS.slice(0, 6)}
            cardClassName="w-32 md:w-48 rounded-xl"
            className="opacity-40"
          />
        </div>
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2">
          <CardRail
            cards={BEAUTIFUL_CARDS.slice(2, 8)}
            reverse
            cardClassName="w-24 md:w-36 rounded-lg"
            className="opacity-30"
          />
        </div>
        <div className="absolute -bottom-20 left-0 right-0">
          <CardRail
            cards={BEAUTIFUL_CARDS.slice(4, 10)}
            cardClassName="w-32 md:w-48 rounded-xl"
            className="opacity-40"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-1 bg-rift-purple rounded-full" />
              <span className="text-xs font-black tracking-[0.3em] text-rift-purple uppercase">Archives tactiques</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
              DECK <span className="text-rift-purple italic">BIBLIOTHÈQUE</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] font-medium leading-relaxed">
              Explorez les meilleurs decks de tournois et les stratégies alternatives. Chaque deck affiche l&apos;image de sa légende.
            </p>
          </div>
          <Link
            href="/deckbuilder"
            className="px-8 py-4 bg-white text-black font-black rounded-2xl text-xs tracking-widest hover:scale-105 transition-all shadow-[var(--shadow-xl)] uppercase shrink-0"
          >
            + NOUVEAU DECK
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-10 flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex p-1.5 bg-[var(--border-subtle)] border border-[var(--border-default)] rounded-2xl overflow-x-auto gap-1">
            {([
              ['meta', 'MÉTA', `${META_DECKS.length}`],
              ['all', 'TOUS', `${allDecks.length}`],
              ['offmeta', 'HORS-MÉTA', `${OFFMETA_DECKS.length}`],
              ['tournaments', 'TOURNOIS', ''],
              ['saved', `MES DECKS`, `${localDecks.length}`],
            ] as [Tab, string, string][]).map(([id, label, count]) => (
              <button
                key={id}
                onClick={() => { setTab(id); setExpandedDeck(null); setGridExpanded(null); setSearch(''); setFilterTier('all'); setFilterCost(''); setFilterRecycle(''); setFilterPower(''); }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold tracking-wider transition-all whitespace-nowrap border-2 ${
                  tab === id 
                    ? 'bg-rift-blue text-black border-rift-blue shadow-[0_0_20px_rgba(10,200,255,0.3)]' 
                    : 'bg-white/5 text-gray-300 border-transparent hover:bg-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {label}
                {count && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${tab === id ? 'bg-black/20' : 'bg-white/10'}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search/filter for meta */}
          {tab === 'meta' && (
            <div className="flex flex-wrap items-center gap-3 w-full">
              <input
                type="text"
                placeholder="Rechercher decks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-[180px] px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-gray-500 focus:border-rift-blue focus:outline-none"
              />
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none uppercase tracking-wider appearance-none cursor-pointer min-w-[80px]"
              >
                <option value="all" className="bg-rift-dark">Tier</option>
                <option value="S" className="bg-rift-dark">S</option>
                <option value="A" className="bg-rift-dark">A</option>
                <option value="B" className="bg-rift-dark">B</option>
                <option value="C" className="bg-rift-dark">C</option>
              </select>
              <input
                type="number"
                placeholder="Coût"
                value={filterCost}
                onChange={(e) => setFilterCost(e.target.value)}
                min="0"
                max="10"
                className="w-20 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white text-center placeholder-gray-500 focus:border-rift-blue focus:outline-none"
              />
              <input
                type="number"
                placeholder="Recycle"
                value={filterRecycle}
                onChange={(e) => setFilterRecycle(e.target.value)}
                min="0"
                max="10"
                className="w-20 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white text-center placeholder-gray-500 focus:border-rift-blue focus:outline-none"
              />
              <input
                type="number"
                placeholder="Puissance"
                value={filterPower}
                onChange={(e) => setFilterPower(e.target.value)}
                min="0"
                max="20"
                className="w-24 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white text-center placeholder-gray-500 focus:border-rift-blue focus:outline-none"
              />
              {(filterCost || filterRecycle || filterPower) && (
                <button
                  onClick={() => { setFilterCost(''); setFilterRecycle(''); setFilterPower(''); }}
                  className="px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Search/filter for all and offmeta */}
          {(tab === 'all' || tab === 'offmeta') && (
            <div className="flex flex-wrap items-center gap-3 w-full">
              <input
                type="text"
                placeholder="Rechercher decks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-[180px] px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-gray-500 focus:border-rift-blue focus:outline-none"
              />
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none uppercase tracking-wider appearance-none cursor-pointer min-w-[80px]"
              >
                <option value="all" className="bg-rift-dark">Tier</option>
                <option value="S" className="bg-rift-dark">S</option>
                <option value="A" className="bg-rift-dark">A</option>
                <option value="B" className="bg-rift-dark">B</option>
                <option value="C" className="bg-rift-dark">C</option>
              </select>
              <input
                type="number"
                placeholder="Coût"
                value={filterCost}
                onChange={(e) => setFilterCost(e.target.value)}
                min="0"
                max="10"
                className="w-20 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white text-center placeholder-gray-500 focus:border-rift-blue focus:outline-none"
              />
              <input
                type="number"
                placeholder="Recycle"
                value={filterRecycle}
                onChange={(e) => setFilterRecycle(e.target.value)}
                min="0"
                max="10"
                className="w-20 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white text-center placeholder-gray-500 focus:border-rift-blue focus:outline-none"
              />
              <input
                type="number"
                placeholder="Puissance"
                value={filterPower}
                onChange={(e) => setFilterPower(e.target.value)}
                min="0"
                max="20"
                className="w-24 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white text-center placeholder-gray-500 focus:border-rift-blue focus:outline-none"
              />
              {(filterCost || filterRecycle || filterPower) && (
                <button
                  onClick={() => { setFilterCost(''); setFilterRecycle(''); setFilterPower(''); }}
                  className="px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── CONTENT ── */}
        <div className="animate-in fade-in duration-300">

          {/* MÉTA */}
          {tab === 'meta' && (
            <div className="space-y-4">
              {filteredMeta.length === 0 && (
                <div className="text-center py-24 bg-[var(--border-subtle)] rounded-[var(--radius-xl)] border border-[var(--border-subtle)]">
                  <p className="text-[var(--text-tertiary)] text-lg font-medium">Aucun deck ne correspond.</p>
                </div>
              )}
              {filteredMeta.map(deck => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  expanded={expandedDeck === deck.id}
                  onToggle={() => setExpandedDeck(expandedDeck === deck.id ? null : deck.id)}
                />
              ))}
            </div>
          )}

          {/* TOUS */}
          {tab === 'all' && (
            <div className="space-y-8">
              {filteredAllDecks.length === 0 && (
                <div className="text-center py-24 bg-[var(--border-subtle)] rounded-[var(--radius-xl)] border border-[var(--border-subtle)]">
                  <p className="text-[var(--text-tertiary)] text-lg font-medium">Aucun deck ne correspond.</p>
                </div>
              )}
              {gridExpanded ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setGridExpanded(null)}
                    className="flex items-center gap-2 text-xs font-black text-[var(--text-tertiary)] uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors"
                  >
                    ← RETOUR À LA GRILLE
                  </button>
                  {filteredAllDecks.filter(d => d.id === gridExpanded).map(deck => (
                    <DeckCard
                      key={deck.id}
                      deck={deck}
                      expanded={true}
                      onToggle={() => setGridExpanded(null)}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredAllDecks.map((deck, i) => (
                    <DeckGridCard
                      key={`${deck.id}-${i}`}
                      deck={deck}
                      onExpand={() => setGridExpanded(deck.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HORS-MÉTA */}
          {tab === 'offmeta' && (
            <div className="space-y-8">
              <div className="text-center py-6">
                <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-2">Decks Hors-Méta</h2>
                <p className="text-[var(--text-tertiary)] font-medium text-sm">Decks amusants et expérimentaux pour varier des stratégies classiques.</p>
              </div>
              {filteredOffmeta.length === 0 && (
                <div className="text-center py-24 bg-[var(--border-subtle)] rounded-[var(--radius-xl)] border border-[var(--border-subtle)]">
                  <p className="text-[var(--text-tertiary)] text-lg font-medium">Aucun deck ne correspond.</p>
                </div>
              )}
              {gridExpanded ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setGridExpanded(null)}
                    className="flex items-center gap-2 text-xs font-black text-[var(--text-tertiary)] uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors"
                  >
                    ← RETOUR À LA GRILLE
                  </button>
                  {filteredOffmeta.filter(d => d.id === gridExpanded).map(deck => (
                    <DeckCard
                      key={deck.id}
                      deck={deck}
                      expanded={true}
                      onToggle={() => setGridExpanded(null)}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredOffmeta.map((deck, i) => (
                    <DeckGridCard
                      key={`offmeta-${i}`}
                      deck={deck}
                      onExpand={() => setGridExpanded(deck.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TOURNOIS */}
          {tab === 'tournaments' && (
            <div className="space-y-4">
              {MAJOR_TOURNAMENTS.map(t => (
                <div key={t.id} className="bg-[var(--surface-3)] rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-7 hover:border-[var(--border-default)] transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="text-3xl">🏆</div>
                      <div>
                        <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-1">{t.name}</h3>
                        <p className="text-xs font-bold text-[var(--text-disabled)] uppercase tracking-widest">
                          {t.location} · {t.date} · {t.players.toLocaleString()} joueurs
                          {t.prizePool && ` · ${t.prizePool}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div>
                        <div className="text-[8px] font-black text-[var(--text-disabled)] uppercase tracking-widest mb-1">Vainqueur</div>
                        <div className={`text-lg font-black uppercase ${domainTextColor(t.winnerDomain)}`}>{t.winner}</div>
                      </div>
                    </div>
                  </div>
                  {/* Top 8 */}
                  {t.top8 && t.top8.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-[var(--border-subtle)]">
                      <h4 className="text-[8px] font-black text-[var(--text-disabled)] uppercase tracking-widest mb-3">Top 8</h4>
                      <div className="flex flex-wrap gap-2">
                        {t.top8.map((entry, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--border-subtle)] rounded-xl border border-[var(--border-subtle)] text-xs">
                            <span className="text-rift-gold font-black text-[10px]">{entry.placement}</span>
                            <span className="text-[var(--text-secondary)] font-bold">{entry.legend}</span>
                            {entry.player && <span className="text-[var(--text-disabled)] text-[10px]">({entry.player})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* MES DECKS */}
          {tab === 'saved' && (
            <>
              {localDecks.length === 0 ? (
                <div className="text-center py-32 bg-[var(--border-subtle)] rounded-[var(--radius-2xl)] border border-[var(--border-subtle)]">
                  <div className="text-6xl mb-6 opacity-20">📭</div>
                  <p className="text-[var(--text-tertiary)] text-xl font-medium mb-8">Vous n&apos;avez pas encore de deck sauvegardé.</p>
                  <Link
                    href="/deckbuilder"
                    className="px-8 py-4 bg-rift-blue text-rift-dark font-black rounded-2xl text-xs tracking-widest uppercase"
                  >
                    Créer mon premier deck
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {localDecks.map(deck => {
                    const updatedDate = new Date(deck.updatedAt ?? 0).toLocaleDateString('fr-FR');
                    return (
                      <div
                        key={deck.id}
                        className="group relative bg-[var(--surface-3)] rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-7 hover:border-rift-purple/30 transition-all duration-300 flex flex-col"
                      >
                        <div className="flex items-start justify-between mb-5">
                          <div>
                            <h3 className="text-xl font-black text-[var(--text-primary)] mb-1.5 uppercase tracking-tighter">{deck.name}</h3>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${domainBadgeClasses(deck.domain)}`}>
                              {deck.domain}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-[var(--text-disabled)] uppercase tracking-widest">{deck.cards.length} C</div>
                        </div>
                        <p className="text-sm text-[var(--text-tertiary)] mb-7 font-medium">
                          Modifié le {updatedDate}
                        </p>
                        <div className="mt-auto pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                          <div className="flex gap-2">
                            <Link
                              href={`/deckbuilder?deckId=${deck.id}`}
                              className="w-9 h-9 rounded-xl bg-[var(--border-subtle)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:text-rift-blue hover:bg-rift-blue/10 transition-all"
                              title="Modifier"
                            >
                              ✎
                            </Link>
                            <Link
                              href={`/decks/view?deckId=${deck.id}`}
                              className="px-4 py-2 rounded-xl bg-[var(--border-default)] text-[var(--text-primary)] text-[10px] font-black tracking-widest hover:bg-[var(--border-strong)] transition-all"
                            >
                              VOIR
                            </Link>
                            <Link
                              href={`/deckbuilder?deckId=${deck.id}`}
                              className="px-5 py-2 rounded-xl bg-rift-purple text-white text-[10px] font-black tracking-widest hover:scale-105 transition-all shadow-[var(--shadow-md)]"
                            >
                              MODIFIER
                            </Link>
                          </div>
                          <button
                            onClick={() => setDeleteConfirm(deck.id)}
                            className="w-9 h-9 rounded-xl bg-[var(--border-subtle)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-disabled)] hover:text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            🗑
                          </button>
                        </div>

                        {deleteConfirm === deck.id && (
                          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-[var(--radius-xl)] z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-200">
                            <p className="text-lg font-black text-white mb-6 uppercase tracking-tighter">Supprimer ce deck ?</p>
                            <div className="flex gap-4 w-full">
                              <button
                                onClick={() => {
                                  deleteLocalDeck(deck.id);
                                  setLocalDecks(localDecks.filter(d => d.id !== deck.id));
                                  setDeleteConfirm(null);
                                }}
                                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-red-700 transition-colors uppercase"
                              >
                                Supprimer
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-4 bg-[var(--border-default)] text-[var(--text-primary)] rounded-2xl font-black text-xs tracking-widest hover:bg-[var(--border-strong)] transition-colors uppercase"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

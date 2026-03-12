'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getLocalDecks, deleteLocalDeck } from '../lib/local-storage';
import type { Deck as SavedDeck } from '../deckbuilder/types';
import { META_DECKS, MAJOR_TOURNAMENTS, OFFMETA_DECKS, type MetaDeck } from './data';
import { domainBadgeClasses, domainTextColor, ALL_CARDS } from '../lib/cards';
import { CHAMPION_TO_PRIMARY_LEGEND_ID } from '../lib/legend-index';
import { CardRail } from '../components/ui/CardRail';
import { Button } from '../components/ui/Button';
import { CARD_RAIL_IMAGES, TIER_COLORS_WITH_SHADOW, DIFFICULTY_COLORS } from '../lib/ui-constants';

const BEAUTIFUL_CARDS = CARD_RAIL_IMAGES;

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

type Tab = 'meta' | 'offmeta' | 'all' | 'community' | 'saved';

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
          <div className={`absolute top-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${TIER_COLORS_WITH_SHADOW[deck.tier]}`}>
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
              
              <Button
                href={`/deckbuilder?deck=${encodeURIComponent(deck.champion)}`}
                variant="secondary"
                size="sm"
              >
                COPIER CE DECK
              </Button>
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
          <div className={`absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${TIER_COLORS_WITH_SHADOW[deck.tier]}`}>
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
    return matchSearch;
  });

  const allDecks = [...META_DECKS, ...OFFMETA_DECKS];

  const filteredAllDecks = allDecks.filter(d => {
    const matchSearch =
      search === '' ||
      d.champion.toLowerCase().includes(search.toLowerCase()) ||
      d.archetype.toLowerCase().includes(search.toLowerCase()) ||
      d.domain.toLowerCase().includes(search.toLowerCase()) ||
      d.secondDomain.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const filteredOffmeta = OFFMETA_DECKS.filter(d => {
    const matchSearch =
      search === '' ||
      d.champion.toLowerCase().includes(search.toLowerCase()) ||
      d.archetype.toLowerCase().includes(search.toLowerCase()) ||
      d.domain.toLowerCase().includes(search.toLowerCase()) ||
      d.secondDomain.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-0.5 bg-rift-purple rounded-full" />
              <span className="text-[9px] font-black tracking-[0.2em] text-rift-purple uppercase">Archives tactiques</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-2">
              DECK <span className="text-rift-purple italic">BIBLIOTHÈQUE</span>
            </h1>
            <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed hidden md:block">
              Decks méta, hors-méta et communautaire
            </p>
          </div>
          <Button
            href="/deckbuilder"
            variant="secondary"
            size="sm"
          >
            + NOUVEAU
          </Button>
        </div>

        {/* Tabs + Search */}
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex p-1 bg-[var(--border-subtle)] border border-[var(--border-default)] rounded-xl overflow-x-auto gap-0.5">
            {([
              ['all', 'TOUS', `${allDecks.length}`],
              ['meta', 'MÉTA', `${META_DECKS.length}`],
              ['offmeta', 'HORS-MÉTA', `${OFFMETA_DECKS.length}`],
              ['community', 'COMMUNAUTÉ', ''],
              ['saved', `MES DECKS`, `${localDecks.length}`],
            ] as [Tab, string, string][]).map(([id, label, count]) => (
              <button
                key={id}
                onClick={() => { setTab(id); setExpandedDeck(null); setGridExpanded(null); setSearch(''); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold tracking-wider transition-all whitespace-nowrap ${
                  tab === id 
                    ? 'bg-rift-blue text-black' 
                    : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
                {count && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${tab === id ? 'bg-black/20' : 'bg-white/5'}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search only */}
          {(tab === 'meta' || tab === 'all' || tab === 'offmeta' || tab === 'community') && (
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 md:w-[100px] px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white placeholder-gray-500 focus:border-rift-blue focus:outline-none"
            />
          )}

        </div>

        {/* ── CONTENT ── */}
        <div className="animate-in fade-in duration-300">

          {/* MÉTA */}
          {tab === 'meta' && (
            <div className="space-y-8">
              {filteredMeta.length === 0 && (
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
                  {filteredMeta.filter(d => d.id === gridExpanded).map(deck => (
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
                  {filteredMeta.map((deck, i) => (
                    <DeckGridCard
                      key={`meta-${i}`}
                      deck={deck}
                      onExpand={() => setGridExpanded(deck.id)}
                    />
                  ))}
                </div>
              )}
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

          {/* COMMUNAUTÉ */}
          {tab === 'community' && (
            <div className="space-y-8">
              <div className="text-center py-6">
                <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-2">Decks de la Communauté</h2>
                <p className="text-[var(--text-tertiary)] font-medium text-sm">Partagez vos decks avec la communauté Riftbound.</p>
              </div>
              <div className="text-center py-24 bg-[var(--border-subtle)] rounded-[var(--radius-xl)] border border-[var(--border-subtle)]">
                <p className="text-[var(--text-tertiary)] text-lg font-medium">Fonctionnalité à venir...</p>
              </div>
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

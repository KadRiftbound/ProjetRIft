'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TIER_LIST, TIER_COLORS, META_DECKS, type LegendTier } from './data';
import { domainTextColor } from '../lib/cards';
import { ALL_CARDS } from '../lib/cards';
import { getLegendRecordFromId } from '../lib/legend-index';
import { PageHeader } from '../components/ui/PageHeader';
import { CardPanel } from '../components/ui/CardPanel';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

function getLegendImage(legendId: string): string | null {
  // 1. Direct lookup by ID in ALL_CARDS Legend cards
  const legendCards = ALL_CARDS.filter(c => c.type === 'Legend');
  const card = legendCards.find(c => c.id === legendId);
  if (card?.variants?.[0]?.imageUrl) {
    return card.variants[0].imageUrl;
  }

  // 2. Via legend-index: find the record for this ID, then try primary legend ID
  const record = getLegendRecordFromId(legendId);
  if (record) {
    const primaryCard = legendCards.find(c => c.id === record.legend.id);
    if (primaryCard?.variants?.[0]?.imageUrl) {
      return primaryCard.variants[0].imageUrl;
    }
  }

  return null;
}

export default function TierListPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [showDeckGuides, setShowDeckGuides] = useState(false);

  const domains = ['All', ...new Set(TIER_LIST.map(l => l.domain))];
  const tiers = ['All', 'S', 'A', 'B', 'C', 'D'];

  const filteredLegends = TIER_LIST.filter(legend => {
    const matchesDomain = selectedDomain === 'All' || legend.domain === selectedDomain;
    const matchesTier = selectedTier === 'All' || legend.tier === selectedTier;
    return matchesDomain && matchesTier;
  });

  const tierOrder = ['S', 'A', 'B', 'C', 'D'];

  const tierDescriptions: Record<string, { title: string; desc: string }> = {
    S: { title: 'Meta Defining', desc: 'Les decks必备 du meta actuel' },
    A: { title: 'Strong Pick', desc: 'Performants et可靠的选择' },
    B: { title: 'Reliable', desc: 'Solides et versatiles' },
    C: { title: 'Niche', desc: 'Situationnels mais viables' },
    D: { title: 'Weak', desc: 'Difficile à jouer compet' },
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader
          eyebrow="Vegas Regional Meta"
          title="Tier"
          titleAccent="List"
          description="Classement des légendes basé sur 1670 matchs officiels - Vegas Regional Mars 2026"
          className="mb-16"
        />

        {/* Action Toggle - Plus spacieux */}
        <div className="flex flex-col items-center gap-8 mb-16">
          <button
            onClick={() => setShowDeckGuides(!showDeckGuides)}
            className={`px-12 py-5 rounded-2xl font-black text-sm tracking-widest transition-all ${
              showDeckGuides 
                ? 'bg-white text-black shadow-2xl scale-105' 
                : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {showDeckGuides ? '← RETOUR' : '📋 GUIDES DECKS MÉTA'}
          </button>
          
          {!showDeckGuides && (
            <div className="flex flex-col items-center gap-6 w-full max-w-3xl">
              {/* Domain Filters - Plus lisibles */}
              <div className="flex flex-wrap justify-center gap-3">
                {domains.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDomain(d)}
                    className={`px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                      selectedDomain === d
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {d === 'All' ? 'Tous' : d}
                  </button>
                ))}
              </div>
              
              {/* Tier Filters - Plus lisibles */}
              <div className="flex flex-wrap justify-center gap-3">
                {tiers.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTier(t)}
                    className={`px-5 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
                      selectedTier === t
                        ? `${TIER_COLORS[t]} shadow-lg`
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {t === 'All' ? 'Tous' : `Tier ${t}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {showDeckGuides ? (
          <div className="grid gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {META_DECKS.map((deck, index) => (
              <DeckGuideCard key={index} deck={deck} />
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {!selectedTier || selectedTier === 'All' ? (
              <div className="space-y-20">
                {tierOrder.map(tier => {
                  const legendsInTier = filteredLegends.filter(l => l.tier === tier);
                  if (legendsInTier.length === 0) return null;
                  
                  return (
                    <div key={tier} className="relative">
                      {/* Tier Header - Nouveau design */}
                      <div className="flex items-center gap-6 mb-10">
                        {/* Large tier letter */}
                        <div className={`text-6xl font-black tracking-tighter ${TIER_COLORS[tier].replace('bg-', 'text-')}`}>
                          {tier}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-black uppercase tracking-wider text-white">
                            Tier {tier}
                          </h2>
                          <p className="text-sm font-medium text-gray-400 mt-1">
                            {tierDescriptions[tier]?.title} • {legendsInTier.length} Légende{legendsInTier.length > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className={`h-px flex-1 bg-gradient-to-r from-white/10 to-transparent`} />
                      </div>
                      
                      {/* Legend Grid - Plus de cartes avec cartes étroites */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
                        {legendsInTier.map(legend => (
                          <LegendCardFullBleed key={legend.id} legend={legend} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
                {filteredLegends.map(legend => (
                  <LegendCardFullBleed key={legend.id} legend={legend} />
                ))}
              </div>
            )}

            {filteredLegends.length === 0 && (
              <EmptyState message="Aucune légende ne correspond aux filtres." />
            )}
          </div>
        )}

        {/* Legend Explicative - Design épuré */}
        {!showDeckGuides && (
          <div className="mt-24 p-8 md:p-10 rounded-3xl bg-white/5 border border-white/5">
            <h3 className="text-sm font-bold mb-8 text-center uppercase tracking-[0.3em] text-gray-400">
              Comprendre le Classement
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              {Object.entries(tierDescriptions).map(([tier, info]) => (
                <div key={tier} className="space-y-2">
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center font-black text-xl ${TIER_COLORS[tier]}`}>
                    {tier}
                  </div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">{info.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// LegendCard - Carte visible en entier, format portrait
function LegendCardFullBleed({ legend }: { legend: LegendTier }) {
  const imageUrl = legend.imageUrl || getLegendImage(legend.id);
  const record = getLegendRecordFromId(legend.id);
  const secondaryDomain = record?.secondaryDomain;

  return (
    <CardPanel className="group relative overflow-hidden p-0 hover:border-rift-gold/30 transition-all duration-500 w-56 mx-auto">
      {/* Image - Aspect ratio carte (3/4) avec object-contain pour voir toute la carte */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-rift-dark to-rift-dark-secondary overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={legend.nameShort}
            className="w-full h-full object-contain group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-30">🃏</span>
          </div>
        )}
        
        {/* Tier badge - Coin haut droit */}
        <div className={`absolute top-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-xl ${TIER_COLORS[legend.tier]}`}>
          {legend.tier}
        </div>
      </div>
      
      {/* Infos en dessous - Minimaliste */}
      <div className="p-4 bg-rift-dark-secondary space-y-3">
        <div>
          <h3 className="text-base font-black text-white uppercase tracking-tight truncate">
            {legend.nameShort}
          </h3>
          {secondaryDomain ? (
            <div className="flex gap-2 items-center mt-1">
              <span className={`text-xs font-bold uppercase tracking-wider ${domainTextColor(legend.domain)}`}>
                {legend.domain}
              </span>
              <span className="text-xs font-bold text-gray-600">•</span>
              <span className={`text-xs font-bold uppercase tracking-wider ${domainTextColor(secondaryDomain)}`}>
                {secondaryDomain}
              </span>
            </div>
          ) : (
            <span className={`text-xs font-bold uppercase tracking-wider ${domainTextColor(legend.domain)}`}>
              {legend.domain}
            </span>
          )}
        </div>
        
        {/* Stats compactes (Winrate retiré) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-blue-400">{legend.pickRate}%</span>
          </div>
          <Link 
            href={`/legends/${legend.id}`}
            className="text-xs font-bold text-rift-blue hover:text-white transition-colors"
          >
            GUIDE →
          </Link>
        </div>
      </div>
    </CardPanel>
  );
}

// NOUVELLE DeckGuideCard - Plus spacieuse, images plus grandes
function DeckGuideCard({ deck }: { deck: typeof META_DECKS[0] }) {
  return (
    <div className="group bg-rift-dark-secondary rounded-3xl border border-white/5 overflow-hidden shadow-2xl hover:border-rift-blue/30 transition-all duration-500">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-rift-purple/10 via-rift-blue/10 to-transparent p-8 md:p-10 border-b border-white/5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider bg-black/40 ${domainTextColor(deck.domain)}`}>
                {deck.domain}
              </span>
              <span className="text-sm font-medium text-gray-500">🏆 {deck.tournament}</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
              {deck.name}
            </h3>
            <p className="text-base text-gray-400 font-medium mt-3 max-w-xl">
              {deck.description}
            </p>
          </div>
          
          {/* Win Rate Badge */}
          <div className="shrink-0 bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 text-center min-w-[120px]">
            <div className="text-4xl font-black text-green-400 mb-1 leading-none">
              {deck.winRate}%
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Win Rate
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-10 grid lg:grid-cols-2 gap-10 bg-[#0c0c12]">
        {/* Card List Column */}
        <div className="space-y-8">
          <h4 className="text-sm font-bold text-rift-blue uppercase tracking-[0.3em] flex items-center gap-4">
            <span className="w-6 h-px bg-rift-blue" /> Decklist Officielle
          </h4>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Legend & Champion
                </span>
                <p className="text-base font-bold text-white">
                  {deck.cards.legend[0]} / {deck.cards.champions?.[0] || '-'}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Unités Clés
                </span>
                <ul className="space-y-1 text-gray-300 font-medium">
                  {deck.cards.units.slice(0, 4).map(u => <li key={u}>• {u}</li>)}
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Sorts & Équipements
                </span>
                <ul className="space-y-1 text-gray-300 font-medium">
                  {deck.cards.spells.slice(0, 3).map(s => <li key={s}>• {s}</li>)}
                  {deck.cards.gear.map(g => <li key={g}>• {g}</li>)}
                </ul>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Runes & Battlefields
                </span>
                <p className="text-sm text-gray-400">{deck.cards.runes.join(', ')}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/5">
            <Button 
              href="/deckbuilder" 
              variant="secondary"
              size="lg"
            >
              COPIER DANS LE BUILDER
            </Button>
          </div>
        </div>

        {/* Strategy Column */}
        <div className="space-y-8">
          <div>
            <h4 className="text-sm font-bold text-rift-gold uppercase tracking-[0.3em] flex items-center gap-4 mb-6">
              <span className="w-6 h-px bg-rift-gold" /> Stratégie
            </h4>
            <p className="text-base text-gray-300 leading-relaxed font-medium italic">
              &ldquo;{deck.strategy}&rdquo;
            </p>
          </div>
          
          <div className="grid gap-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Conseils d&apos;Experts
            </h4>
            {deck.tips.map((tip, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 items-start">
                <span className="text-rift-gold font-bold text-sm">{(i + 1).toString().padStart(2, '0')}</span>
                <p className="text-sm text-gray-300 font-medium">{tip.replace(/'/g, "&apos;")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

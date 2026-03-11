'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DeckOfTheDay {
  deck: {
    id: string;
    champion: string;
    fullName: string;
    domain: string;
    secondDomain: string;
    archetype: string;
    tier: string;
    description: string;
    difficulty: string;
    keyCards: string[];
    strengths: string[];
    weaknesses: string[];
  };
  meta: {
    type: 'meta' | 'offmeta';
    rotationDay: number;
    nextChange: string;
    period: number;
  };
}

export function DeckOfTheDay() {
  const [data, setData] = useState<DeckOfTheDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/deck-of-the-day')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-32 px-6 bg-[var(--surface-2)]">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse flex items-center justify-center h-64">
            <div className="text-[var(--text-tertiary)]">Chargement...</div>
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const { deck, meta } = data;
  const tierColor = {
    S: 'bg-red-600 text-white',
    A: 'bg-orange-500 text-white',
    B: 'bg-yellow-500 text-black',
    C: 'bg-blue-500 text-white',
  }[deck.tier] || 'bg-gray-500 text-white';

  return (
    <section className="py-20 md:py-32 px-6 bg-[var(--surface-2)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rift-blue/10 border border-rift-blue/20 mb-6">
            <span className="text-[10px] font-black tracking-[0.3em] text-rift-blue uppercase">Deck du Jour</span>
            <span className="text-[10px] text-[var(--text-tertiary)]">•</span>
            <span className="text-[10px] text-[var(--text-tertiary)]">Change dans {meta.rotationDay} jour{meta.rotationDay > 1 ? 's' : ''}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-4">
            Deck <span className="text-rift-blue italic">Sélectionné</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Notre deck recommandé pour aujourd&apos;hui. Mis à jour toutes les 48 heures.
          </p>
        </div>

        {/* Deck Card */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Info */}
          <div className="bg-[var(--surface-3)] rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black ${tierColor}`}>
                {deck.tier}
              </div>
              <div>
                <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase">{deck.champion}</h3>
                <p className="text-[var(--text-tertiary)] text-sm">{deck.fullName}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[var(--border-subtle)] text-[var(--text-secondary)] border border-[var(--border-default)]">
                {deck.domain}
              </span>
              {deck.secondDomain && (
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[var(--border-subtle)] text-[var(--text-secondary)] border border-[var(--border-default)]">
                  {deck.secondDomain}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rift-purple/20 text-rift-purple border border-rift-purple/30">
                {deck.archetype}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[var(--border-subtle)] text-[var(--text-tertiary)] border border-[var(--border-default)]">
                {deck.difficulty}
              </span>
            </div>

            <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
              {deck.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                <h4 className="text-[10px] font-black text-green-400 uppercase mb-2">Forces</h4>
                <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                  {deck.strengths.slice(0, 3).map((s, i) => (
                    <li key={i}>+ {s}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                <h4 className="text-[10px] font-black text-red-400 uppercase mb-2">Faiblesses</h4>
                <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                  {deck.weaknesses.slice(0, 3).map((w, i) => (
                    <li key={i}>− {w}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              href={`/deckbuilder?deck=${encodeURIComponent(deck.champion)}`}
              className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-black rounded-xl text-sm tracking-widest hover:scale-[1.02] transition-all"
            >
              🎯 Construire ce deck
            </Link>
          </div>

          {/* Right - Key Cards */}
          <div className="bg-[var(--surface-3)] rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8">
            <h4 className="text-xs font-black text-rift-gold uppercase tracking-[0.3em] mb-6">Cartes clés</h4>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {deck.keyCards.slice(0, 6).map((card, i) => (
                <div key={i} className="p-3 rounded-xl bg-[var(--border-subtle)] border border-[var(--border-default)] text-center">
                  <span className="text-sm font-bold text-[var(--text-primary)]">{card}</span>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-[var(--border-subtle)] border border-[var(--border-default)]">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="text-xs font-black text-[var(--text-tertiary)] uppercase tracking-widest">Type</div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    {meta.type === 'meta' ? 'Deck Méta' : 'Deck Hors-Méta'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔄</span>
                <div>
                  <div className="text-xs font-black text-[var(--text-tertiary)] uppercase tracking-widest">Prochain changement</div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    {new Date(meta.nextChange).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/decks"
              className="flex items-center justify-center gap-2 w-full mt-6 py-4 bg-[var(--border-subtle)] border border-[var(--border-default)] text-[var(--text-secondary)] font-black rounded-xl text-sm tracking-widest hover:bg-[var(--border-default)] hover:text-[var(--text-primary)] transition-all"
            >
              Voir tous les decks →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

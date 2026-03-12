import { notFound } from "next/navigation";
import Link from "next/link";
import { getCardById, searchCards, transformCardToView } from "../../../lib/riftcodex";
import { getLegendGuide } from "../../../lib/legend-guides";
import { Button } from "../../../components/ui/Button";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const cards = await searchCards({ limit: 1000 });
  const transformed = cards.map(transformCardToView);
  const legends = transformed.filter((c: any) => c.type === 'Legend');
  return legends.map((card: any) => ({
    id: card.id,
  }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = await getCardById(id);
  
  if (!card) {
    return { title: 'Guide - Riftbound' };
  }
  
  return {
    title: `Guide ${card.name} - Riftbound`,
    description: `Guide complet pour jouer ${card.name} dans Riftbound. Stratégie, matchups, mulligan et decklists.`,
  };
}

function getOutcomeColor(outcome: string): string {
  const colors: Record<string, string> = {
    'favorable': '#22c55e',
    'neutral': '#eab308',
    'unfavorable': '#f43f5e',
  };
  return colors[outcome] || colors.neutral;
}

function getOutcomeText(outcome: string): string {
  const texts: Record<string, string> = {
    'favorable': 'Favorable',
    'neutral': 'Équilibré',
    'unfavorable': 'Défavorable',
  };
  return texts[outcome] || 'Équilibré';
}

function getDomainColor(domain: string): string {
  const colors: Record<string, string> = {
    'Fury': '#f43f5e',
    'Hope': '#22c55e',
    'Glory': '#eab308',
    'Cunning': '#0ea5e9',
    'Knowledge': '#a855f7',
    'Order': '#f97316',
    'Void': '#ec4899',
    'Colorless': '#94a3b8',
  };
  return colors[domain] || colors.Colorless;
}

export default async function LegendGuidePage({ params }: Props) {
  const { id } = await params;
  const card = await getCardById(id);
  
  if (!card) {
    notFound();
  }

  const transformedCard = transformCardToView(card);
  const guide = getLegendGuide(transformedCard.id);
  const domainColor = getDomainColor(transformedCard.domain);

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-rift-dark text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-rift-dark-secondary to-rift-dark border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link 
            href={`/legends/${id}`}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-rift-gold transition-colors mb-8"
          >
            ← Retour à {transformedCard.name}
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-44 rounded-[20px] overflow-hidden bg-rift-dark-secondary border border-white/10 shrink-0">
              <img
                src={transformedCard.images?.[0]?.medium || '/placeholder.png'}
                alt={transformedCard.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-rift-gold/10 border border-rift-gold/20 rounded-full text-[10px] font-black uppercase tracking-widest text-rift-gold">
                  Guide Complet
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: `${domainColor}20`, color: domainColor }}>
                  {transformedCard.domain}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
                {transformedCard.name.split(',')[0].trim()}
              </h1>
              
              <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-2xl">
                {guide.overview}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        
        {/* Ability & Stats */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">
            <h3 className="text-[10px] font-black text-rift-gold uppercase tracking-[0.3em] mb-6">Capacité</h3>
            <p className="text-2xl font-bold text-white italic leading-tight">
              "{transformedCard.rules}"
            </p>
          </div>
          
          <div className="bg-rift-dark-secondary border border-white/5 rounded-[40px] p-10">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Style de Jeu</h3>
            <div className="flex flex-wrap gap-3">
              {guide.isMeta && (
                <span className="px-4 py-2 bg-rift-gold/10 border border-rift-gold/30 rounded-full text-xs font-black uppercase text-rift-gold">
                  Méta
                </span>
              )}
              {guide.decks?.[0]?.strategy && (
                <span className="px-4 py-2 bg-rift-blue/10 border border-rift-blue/30 rounded-full text-xs font-black uppercase text-rift-blue">
                  {guide.decks[0].strategy}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Strategy */}
        {guide.strategy && (
          <div className="bg-gradient-to-br from-rift-dark-secondary to-transparent border border-white/5 rounded-[48px] p-12">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-12 text-center">Stratégie</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-black/40 border border-rift-blue/20 rounded-[32px] p-8">
                <div className="w-12 h-12 rounded-2xl bg-rift-blue/10 flex items-center justify-center font-black text-rift-blue text-xl mb-6 border border-rift-blue/20">
                  E
                </div>
                <h3 className="text-sm font-black text-rift-blue uppercase tracking-widest mb-4">Early</h3>
                <p className="text-gray-400 font-medium leading-relaxed">
                  {guide.strategy.early}
                </p>
              </div>
              
              <div className="bg-black/40 border border-rift-purple/20 rounded-[32px] p-8">
                <div className="w-12 h-12 rounded-2xl bg-rift-purple/10 flex items-center justify-center font-black text-rift-purple text-xl mb-6 border border-rift-purple/20">
                  M
                </div>
                <h3 className="text-sm font-black text-rift-purple uppercase tracking-widest mb-4">Mid</h3>
                <p className="text-gray-400 font-medium leading-relaxed">
                  {guide.strategy.mid}
                </p>
              </div>
              
              <div className="bg-black/40 border border-rift-gold/20 rounded-[32px] p-8">
                <div className="w-12 h-12 rounded-2xl bg-rift-gold/10 flex items-center justify-center font-black text-rift-gold text-xl mb-6 border border-rift-gold/20">
                  L
                </div>
                <h3 className="text-sm font-black text-rift-gold uppercase tracking-widest mb-4">Late</h3>
                <p className="text-gray-400 font-medium leading-relaxed">
                  {guide.strategy.late}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mulligan */}
        {guide.mulligan && (
          <div className="bg-rift-dark-secondary border border-white/5 rounded-[48px] p-12">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-[20px] bg-rift-gold/10 flex items-center justify-center text-3xl border border-rift-gold/20">
                📥
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Mulligan</h2>
                <p className="text-gray-500 text-sm font-medium">Quelles cartes garder ?</p>
              </div>
            </div>
            <p className="text-xl text-gray-300 font-medium leading-relaxed">
              {guide.mulligan}
            </p>
          </div>
        )}

        {/* Tips */}
        {guide.tips && guide.tips.length > 0 && (
          <div className="border border-white/10 rounded-[48px] p-12">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-[20px] bg-rift-purple/10 flex items-center justify-center text-3xl border border-rift-purple/20">
                💡
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Conseils Avancés</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {guide.tips.map((tip, i) => (
                <div key={i} className="flex gap-4 p-6 bg-black/30 rounded-[24px] border border-white/5">
                  <span className="text-rift-purple font-black text-lg shrink-0">•</span>
                  <p className="text-gray-400 font-medium leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decks */}
        {guide.decks && guide.decks.length > 0 && (
          <div>
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8 text-center">Decks Recommandés</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {guide.decks.map((deck, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-[40px] p-10 hover:border-rift-gold/30 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-rift-gold">{deck.name}</h3>
                      <p className="text-gray-500 text-sm font-medium mt-1">{deck.description}</p>
                    </div>
                    {guide.decks.length > 1 && (
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase text-gray-400">
                        Variant {i + 1}
                      </span>
                    )}
                  </div>
                  {deck.strategy && (
                    <p className="text-gray-400 font-medium mb-6 italic">{deck.strategy}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {deck.coreCards?.map((card, j) => (
                      <span key={j} className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs font-black uppercase text-gray-300">
                        {card}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matchups */}
        {guide.matchups && guide.matchups.length > 0 && (
          <div className="bg-rift-dark-secondary border border-white/5 rounded-[48px] p-12">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8 text-center">Matchups</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guide.matchups.map((matchup, i) => (
                <div key={i} className="bg-black/30 border border-white/5 rounded-[24px] p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-black uppercase tracking-wider">vs {matchup.against}</span>
                    <span 
                      className="px-3 py-1 rounded-full text-[10px] font-black uppercase"
                      style={{ 
                        color: getOutcomeColor(matchup.outcome),
                        backgroundColor: `${getOutcomeColor(matchup.outcome)}15`,
                        border: `1px solid ${getOutcomeColor(matchup.outcome)}30`
                      }}
                    >
                      {getOutcomeText(matchup.outcome)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    {matchup.tips}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Synergies */}
        {guide.synergies && guide.synergies.length > 0 && (
          <div className="border border-white/10 rounded-[48px] p-12">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-[20px] bg-rift-blue/10 flex items-center justify-center text-3xl border border-rift-blue/20">
                🔗
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Synergies</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {guide.synergies.map((syn, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-black/30 rounded-[24px] border border-white/5">
                  <span className="text-lg font-black uppercase text-white">{syn.cardName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm font-medium">{syn.synergy}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      syn.priority === 'high' ? 'text-green-400 bg-green-400/10' : 
                      syn.priority === 'medium' ? 'text-yellow-400 bg-yellow-400/10' : 
                      'text-gray-500 bg-white/5'
                    }`}>
                      {syn.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Counters */}
        {guide.counters && guide.counters.length > 0 && (
          <div className="bg-red-500/5 border border-red-500/10 rounded-[48px] p-12">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-[20px] bg-red-500/10 flex items-center justify-center text-3xl border border-red-500/20">
                ⚠️
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Contre</h2>
                <p className="text-red-400 text-sm font-medium">Ce qui pose problème</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {guide.counters.map((counter, i) => (
                <span key={i} className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-sm font-black uppercase tracking-widest">
                  {counter}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col md:flex-row gap-6 justify-center pt-8 border-t border-white/5">
          <Button href={`/legends/${id}`} variant="secondary" size="lg">
            ← Fiche Légende
          </Button>
          <Button href={`/deckbuilder?legend=${id}`} variant="purple" size="lg">
            Construire un Deck
          </Button>
        </div>

      </div>
    </div>
  );
}

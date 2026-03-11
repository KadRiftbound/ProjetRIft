import { notFound } from "next/navigation";
import Link from "next/link";
import { getCardById, searchCards, transformCardToView } from "../../lib/riftcodex";
import { getLegendGuide } from "../../lib/legend-guides";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const cards = await searchCards({ limit: 1000 });
  const transformed = cards.map(transformCardToView);
  const relevantCards = transformed.filter((c: any) => c.type === 'Champion' || c.type === 'Legend');
  return relevantCards.map((card: any) => ({
    id: card.id,
  }));
}

const domainDescriptions: Record<string, string> = {
  'Fury': 'Focalisé sur l\'agression pure et les dégâts directs.',
  'Calm': 'Maîtrise du soin, de la protection et de la résilience.',
  'Mind': 'Optimisation des ressources et manipulation de la pioche.',
  'Body': 'Renforcement physique des unités et contrôle du terrain.',
  'Chaos': 'Disruption imprévisible et effets de surprise dévastateurs.',
  'Order': 'Défense inébranlable et contrôle méthodique du jeu.',
  'Void': 'Corruption et destruction systématique des défenses.',
};

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

export default async function LegendDetailPage({ params }: Props) {
  const { id } = await params;
  const card = await getCardById(id);
  
  if (!card) {
    notFound();
  }

  const transformedCard = transformCardToView(card);
  const guide = getLegendGuide(transformedCard.id);
  
  if (transformedCard.type !== 'Champion' && transformedCard.type !== 'Legend') {
    notFound();
  }

  const domainColor = getDomainColor(transformedCard.domain);

  return (
    <div className="min-h-screen bg-background text-white selection:bg-rift-gold selection:text-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-12">
          <Link href="/legends" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-rift-gold transition-colors">
            ← Retour au Panthéon
          </Link>
        </nav>

        {/* Hero Header */}
        <div className="grid lg:grid-cols-12 gap-16 mb-32 items-start">
          {/* Card Showcase */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-32">
              <div className="relative group">
                <div className="aspect-[3/4.2] rounded-[40px] overflow-hidden bg-rift-dark-secondary border-2 border-white/5 shadow-2xl transition-all duration-500 group-hover:border-rift-gold/30">
                  <img
                    src={transformedCard.images?.[0]?.large || transformedCard.images?.[0]?.medium || '/placeholder.png'}
                    alt={transformedCard.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
                {guide?.isMeta && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-rift-gold to-yellow-600 text-black font-black rounded-full text-[10px] tracking-[0.2em] shadow-2xl whitespace-nowrap">
                    CHAMPION MÉTA
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                {transformedCard.expansion.id} · {transformedCard.rarity}
              </span>
              <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: `${domainColor}20`, color: domainColor }}>
                Domaine {transformedCard.domain}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 uppercase tracking-tighter leading-none italic">
              {transformedCard.name.split(',')[0].trim()}
            </h1>

            {/* Ability Block */}
            <div className="bg-white/5 border border-white/10 rounded-[48px] p-12 mb-16 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rift-gold/5 rounded-full blur-[80px] group-hover:bg-rift-gold/10 transition-colors duration-1000" />
              <h2 className="text-[10px] font-black text-rift-gold uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                <span className="w-12 h-px bg-rift-gold" /> Capacité Unique
              </h2>
              <p className="text-3xl font-bold text-white leading-tight tracking-tight italic">
                "{transformedCard.rules || "Capacité non répertoriée."}"
              </p>
            </div>

            {/* Overview */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Analyse du Champion</h3>
              <p className="text-xl text-gray-400 font-medium leading-relaxed">
                {guide?.overview || "Cette légende est en cours d'étude par notre comité stratégique. Les données de performance seront disponibles après le prochain tournoi majeur."}
              </p>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC CONTENT SECTIONS --- */}
        {guide && (
          <div className="space-y-32">
            
            {/* Meta Specific Content */}
            {guide.isMeta && (
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-rift-dark-secondary rounded-[56px] border border-white/5 p-16 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-rift-gold/5 rounded-full blur-[60px]" />
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-3xl border border-white/10 shadow-inner">📥</div>
                    <h3 className="text-4xl font-black uppercase tracking-tighter">Mulligan</h3>
                  </div>
                  <p className="text-lg text-gray-400 leading-relaxed font-medium">
                    {guide.mulligan}
                  </p>
                </div>

                <div className="bg-white/5 rounded-[56px] border border-white/10 p-16 backdrop-blur-2xl">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-3xl border border-white/10 shadow-inner">🎯</div>
                    <h3 className="text-4xl font-black uppercase tracking-tighter">Stratégie</h3>
                  </div>
                  <div className="space-y-10">
                    {[
                      { l: 'Early', t: guide.strategy?.early, c: 'text-rift-blue', bg: 'bg-rift-blue/10' },
                      { l: 'Mid', t: guide.strategy?.mid, c: 'text-rift-purple', bg: 'bg-rift-purple/10' },
                      { l: 'Late', t: guide.strategy?.late, c: 'text-rift-gold', bg: 'bg-rift-gold/10' }
                    ].map(s => (
                      <div key={s.l} className="flex gap-8">
                        <div className={`shrink-0 w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center font-black ${s.c} border border-current opacity-40`}>{s.l[0]}</div>
                        <div>
                          <h4 className={`font-black text-xs uppercase tracking-widest mb-2 ${s.c}`}>{s.l} Game</h4>
                          <p className="text-gray-400 text-sm leading-relaxed font-medium">{s.t}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Non-Meta / Techniques Specific Content */}
            {!guide.isMeta && guide.techniques && (
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-white/5 rounded-[56px] border border-white/10 p-16 backdrop-blur-2xl">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-3xl border border-white/10 shadow-inner">🧠</div>
                    <h3 className="text-4xl font-black uppercase tracking-tighter">Techniques</h3>
                  </div>
                  <div className="space-y-6">
                    {guide.techniques.map((t, i) => (
                      <div key={i} className="p-8 rounded-[32px] bg-black/40 border border-white/5 group hover:border-rift-purple/30 transition-all duration-500">
                        <p className="text-gray-300 font-medium leading-relaxed">
                          <span className="text-rift-purple font-black mr-4">0{i+1}</span> {t}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-rift-dark-secondary rounded-[56px] border border-white/5 p-16 shadow-2xl">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-3xl border border-white/10 shadow-inner">🔗</div>
                    <h3 className="text-4xl font-black uppercase tracking-tighter">Combos</h3>
                  </div>
                  <div className="space-y-10">
                    {guide.combos?.map((c, i) => (
                      <div key={i} className="relative pl-10 border-l-2 border-white/5">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-rift-blue border-4 border-rift-dark-secondary shadow-[0_0_15px_rgba(10,200,255,0.4)]" />
                        <div className="flex flex-wrap gap-2 mb-4">
                          {c.cards.map(cardName => (
                            <span key={cardName} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase text-rift-blue tracking-tighter">{cardName}</span>
                          ))}
                        </div>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed italic">"{c.effect}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Universal Guide Content: Decks & Synergies */}
            <div className="space-y-16">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] text-center">Ressources Tactiques</h3>
              
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                  {guide.decks.map((d, i) => (
                    <div key={i} className="group bg-rift-dark-secondary rounded-[48px] p-12 border border-white/5 hover:border-rift-gold/30 transition-all duration-500">
                      <h4 className="text-3xl font-black text-rift-gold mb-4 uppercase tracking-tighter leading-none">{d.name}</h4>
                      <p className="text-gray-400 text-sm font-medium mb-10 leading-relaxed">{d.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {d.coreCards.map(cc => <span key={cc} className="px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-[9px] font-black text-gray-500 uppercase">{cc}</span>)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 rounded-[48px] border border-white/10 p-12 backdrop-blur-xl">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-10">Synergies Cartes</h4>
                  <div className="space-y-8">
                    {guide.synergies.map((s, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-black text-white uppercase tracking-widest">{s.cardName}</span>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${s.priority === 'high' ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-white/5'}`}>{s.priority}</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{s.synergy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Matchups & Weaknesses */}
            <div className="grid lg:grid-cols-2 gap-12 pb-32">
              <div className="bg-white/5 rounded-[56px] border border-white/10 p-16">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-12">Tableau des Matchups</h3>
                <div className="grid gap-4">
                  {guide.matchups.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-8 rounded-[32px] bg-black/40 border border-white/5">
                      <span className="text-xl font-black text-white uppercase tracking-tighter">vs {m.against}</span>
                      <span className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ color: getOutcomeColor(m.outcome), borderColor: `${getOutcomeColor(m.outcome)}40`, backgroundColor: `${getOutcomeColor(m.outcome)}10` }}>
                        {getOutcomeText(m.outcome)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-500/5 rounded-[56px] border border-red-500/10 p-16">
                <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-12 text-center">Faiblesses Critiques</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {guide.counters.map(c => (
                    <span key={c} className="px-8 py-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-[24px] text-sm font-black uppercase tracking-widest shadow-2xl">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Action Call */}
        <div className="flex flex-col items-center gap-10 pt-20 border-t border-white/5 mb-32">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter text-center leading-none">
            PRÊT À FORGER VOTRE <br /><span className="text-rift-gold">PROPRE DECK ?</span>
          </h2>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link 
              href={`/deckbuilder?legend=${transformedCard.id}`}
              className="px-12 py-6 bg-white text-black font-black rounded-[24px] hover:scale-105 transition-all shadow-2xl active:scale-95 uppercase tracking-widest"
            >
              Lancer le Builder 📋
            </Link>
            <Link 
              href={`/cards?domain=${transformedCard.domain}`}
              className="px-12 py-6 bg-white/5 border-2 border-white/10 text-white font-black rounded-[24px] hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest"
            >
              Cartes {transformedCard.domain} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

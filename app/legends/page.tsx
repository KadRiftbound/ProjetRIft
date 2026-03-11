"use client";

import { useState } from "react";
import Link from "next/link";
import { ALL_CARDS } from "../lib/cards";
import { LEGEND_GUIDES } from "../lib/legend-guides";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionTitle } from "../components/ui/SectionTitle";
import { EmptyState } from "../components/ui/EmptyState";
import { CardRail } from "../components/ui/CardRail";

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

export default function LegendsPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const legends = ALL_CARDS.filter(c => 
    c.type === 'Legend' || c.name.includes('Legend')
  );
  
  const uniqueLegends = legends.filter((card, index, self) => 
    index === self.findIndex(c => c.name === card.name)
  );
  
  const domains = [...new Set(uniqueLegends.map(c => c.domain))];

  const metaLegends = uniqueLegends.filter(l => LEGEND_GUIDES[l.id]?.isMeta);
  const filteredMetaLegends = metaLegends.filter(l =>
    selectedDomain === "all" || l.domain === selectedDomain
  );
  const filteredLegends = uniqueLegends.filter(l =>
    selectedDomain === "all" || l.domain === selectedDomain
  );

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      {/* Background Card Rails */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
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
        <PageHeader
          title="Légendes"
          titleAccent="Riftbound"
          description="Découvrez toutes les légendes du jeu. Cliquez sur une carte pour accéder à son guide complet avec stratégies et decks."
          className="mb-12"
        />

        {/* Quick Tutorial Banner */}
        <div className="mb-12 p-6 rounded-[24px] bg-gradient-to-r from-rift-blue/10 to-rift-purple/10 border border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black text-white mb-2 uppercase">Nouveau sur Riftbound ?</h3>
              <p className="text-gray-400 text-sm">Commencez avec nos légendes recommandées pour débutants</p>
            </div>
            <div className="flex gap-3">
              <Link href="/legends/SFD-185" className="px-6 py-3 bg-rift-gold text-black font-black rounded-xl text-xs tracking-widest hover:scale-105 transition-all">
                DRAVEN (Aggro)
              </Link>
              <Link href="/legends/SFD-195" className="px-6 py-3 bg-rift-purple text-white font-black rounded-xl text-xs tracking-widest hover:scale-105 transition-all">
                IRELIA (Combo)
              </Link>
              <Link href="/legends/SFD-132" className="px-6 py-3 bg-rift-blue text-white font-black rounded-xl text-xs tracking-widest hover:scale-105 transition-all">
                KAI'SA (Control)
              </Link>
            </div>
          </div>
        </div>
        
        {/* Domain Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            className={`px-6 py-2 font-black rounded-xl text-[10px] tracking-widest transition-all ${
              selectedDomain === "all"
                ? "bg-white text-black"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
            }`}
            onClick={() => setSelectedDomain("all")}
          >
            TOUS
          </button>
          {domains.map(domain => (
            <button 
              key={domain}
              className={`px-6 py-2 font-bold rounded-xl text-[10px] tracking-widest transition-all border border-white/5 ${
                selectedDomain === domain
                  ? "bg-white text-black"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
              onClick={() => setSelectedDomain(domain)}
            >
              {domain.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Meta Legends Section */}
        {filteredMetaLegends.length > 0 && (
          <div className="mb-12">
            <SectionTitle>Méta Actuelle</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredMetaLegends.map((card) => (
                <Link 
                  key={card.id} 
                  href={`/legends/${card.id}`}
                  className="group relative transition-transform duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="aspect-[3/4.2] rounded-2xl overflow-hidden bg-rift-dark-secondary border-2 border-rift-gold/30 group-hover:border-rift-gold transition-all duration-500 shadow-xl">
                    {card.variants && card.variants[0]?.imageUrl ? (
                      <img
                        src={card.variants[0].imageUrl}
                        alt={card.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-rift-dark to-rift-dark-secondary flex items-center justify-center">
                        <span className="text-4xl grayscale opacity-20">🃏</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] font-black text-white bg-rift-gold/80 px-3 py-1 rounded-full tracking-widest">GUIDE →</span>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rift-gold flex items-center justify-center">
                    <span className="text-[10px] font-black text-black">S</span>
                  </div>
                  <div className="mt-3 text-center text-sm font-black text-white uppercase tracking-tight">
                    {card.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Legends Grid */}
        <div>
          <SectionTitle lineClassName="bg-gradient-to-r from-white/20 to-transparent">
            Toutes les Légendes
          </SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredLegends.map((card) => (
              <Link 
                key={card.id} 
                href={`/legends/${card.id}`}
                className="group relative transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <div className="aspect-[3/4.2] rounded-2xl overflow-hidden bg-rift-dark-secondary border-2 border-white/5 group-hover:border-rift-gold/50 transition-all duration-500 shadow-xl">
                  {card.variants && card.variants[0]?.imageUrl ? (
                    <img
                      src={card.variants[0].imageUrl}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rift-dark to-rift-dark-secondary flex items-center justify-center">
                      <span className="text-4xl grayscale opacity-20">🃏</span>
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="text-[10px] font-black text-white bg-rift-gold/80 px-3 py-1 rounded-full tracking-widest">GUIDE →</span>
                  </div>
                </div>
                <div className="mt-3 text-center text-sm font-black text-white uppercase tracking-tight">
                  {card.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {filteredLegends.length === 0 && (
          <EmptyState message="Aucune légende trouvée." />
        )}
      </div>
    </div>
  );
}

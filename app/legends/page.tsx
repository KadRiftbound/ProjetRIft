"use client";

import { useState } from "react";
import Link from "next/link";
import { ALL_CARDS } from "../lib/cards";
import { LEGENDS } from "../lib/legend-index";
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

const DOMAINS = ['Fury', 'Calm', 'Mind', 'Body', 'Chaos', 'Order'];

const DOMAIN_COLORS: Record<string, string> = {
  Fury: 'bg-red-500/80 text-white',
  Calm: 'bg-blue-500/80 text-white',
  Mind: 'bg-purple-500/80 text-white',
  Body: 'bg-yellow-500/80 text-black',
  Chaos: 'bg-emerald-500/80 text-white',
  Order: 'bg-orange-500/80 text-white',
};

export default function LegendsPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  
  const allLegendIds = LEGENDS.flatMap(l => l.legendVariants.map(v => v.id));
  const allCardsData = ALL_CARDS.filter(c => allLegendIds.includes(c.id));
  
  const filteredLegends = LEGENDS.filter(legend => {
    if (selectedDomain === "all") return true;
    return legend.domain === selectedDomain || legend.secondaryDomain === selectedDomain;
  });

  const getCardData = (legendId: string) => {
    return allCardsData.find(c => c.id === legendId);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      {/* Background Card Rails */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
        <div className="absolute -top-10 left-0 right-0">
          <CardRail
            cards={BEAUTIFUL_CARDS.slice(0, 6)}
            cardClassName="w-24 md:w-36 rounded-lg"
            className="opacity-30"
          />
        </div>
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2">
          <CardRail
            cards={BEAUTIFUL_CARDS.slice(2, 8)}
            reverse
            cardClassName="w-20 md:w-28 rounded-lg"
            className="opacity-20"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-3">
            Légendes <span className="text-rift-blue italic">Riftbound</span>
          </h1>
          <p className="text-base text-gray-400">Cliquez sur une carte pour accéder au guide</p>
        </div>

        {/* Domain Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            className={`px-5 py-2.5 font-bold rounded-xl text-xs tracking-wider transition-all border-2 ${
              selectedDomain === "all"
                ? "bg-rift-blue text-black border-rift-blue shadow-[0_0_15px_rgba(10,200,255,0.3)]"
                : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border-white/10 hover:border-white/30"
            }`}
            onClick={() => setSelectedDomain("all")}
          >
            TOUS
          </button>
          {DOMAINS.map(domain => (
            <button 
              key={domain}
              className={`px-5 py-2.5 font-bold rounded-xl text-xs tracking-wider transition-all border-2 ${
                selectedDomain === domain
                  ? "bg-rift-blue text-black border-rift-blue shadow-[0_0_15px_rgba(10,200,255,0.3)]"
                  : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border-white/10 hover:border-white/30"
              }`}
              onClick={() => setSelectedDomain(domain)}
            >
              {domain.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Legends Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filteredLegends.map((legend) => {
            const cardData = getCardData(legend.legend.id);
            return (
              <Link 
                key={legend.legend.id} 
                href={`/legends/${legend.legend.id}`}
                className="group relative transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <div className="aspect-[3/4.2] rounded-xl overflow-hidden bg-rift-dark-secondary border-2 border-white/10 group-hover:border-rift-gold/60 transition-all duration-300 shadow-lg">
                  {cardData?.variants?.[0]?.imageUrl ? (
                    <img
                      src={cardData.variants[0].imageUrl}
                      alt={legend.legend.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rift-dark to-rift-dark-secondary flex items-center justify-center">
                      <span className="text-3xl grayscale opacity-20">🃏</span>
                    </div>
                  )}
                  
                  {/* Domain badges */}
                  <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${DOMAIN_COLORS[legend.domain]}`}>
                      {legend.domain.slice(0, 4).toUpperCase()}
                    </span>
                    {legend.secondaryDomain && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${DOMAIN_COLORS[legend.secondaryDomain]}`}>
                        {legend.secondaryDomain.slice(0, 4).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-bold text-white bg-rift-blue px-4 py-2 rounded-lg tracking-wider shadow-lg">VOIR</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredLegends.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune légende trouvée pour ce domaine.
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ALL_CARDS } from "../lib/cards";
import { LEGENDS } from "../lib/legend-index";
import { CardRail } from "../components/ui/CardRail";
import { CARD_RAIL_IMAGES, DOMAIN_COLORS_SOLID } from "../lib/ui-constants";

const BEAUTIFUL_CARDS = CARD_RAIL_IMAGES;

const DOMAINS = ['Fury', 'Calm', 'Mind', 'Body', 'Chaos', 'Order'];

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

      <div className="max-w-7xl mx-auto relative z-10 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Légendes
          </h1>
          <p className="text-lg font-semibold text-rift-blue bg-rift-blue/10 px-6 py-3 rounded-2xl inline-block border border-rift-blue/30 shadow-[0_0_20px_rgba(10,200,255,0.2)]">
            Cliquez sur une carte pour accéder au guide
          </p>
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
        <div className="grid grid-cols-6 gap-4">
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
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${DOMAIN_COLORS_SOLID[legend.domain]?.bg} ${DOMAIN_COLORS_SOLID[legend.domain]?.text}`}>
                      {legend.domain.slice(0, 4).toUpperCase()}
                    </span>
                    {legend.secondaryDomain && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${DOMAIN_COLORS_SOLID[legend.secondaryDomain]?.bg} ${DOMAIN_COLORS_SOLID[legend.secondaryDomain]?.text}`}>
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

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PageHeader } from '../../components/ui/PageHeader';
import { CardPanel } from '../../components/ui/CardPanel';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardRail } from '../../components/ui/CardRail';

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

interface CardData {
  id: string;
  name: string;
  domain: string;
  type: string;
  rarity: string;
  images: { medium?: string; large?: string }[];
}

export default function CardsClient({ initialCards }: { initialCards: any[] }) {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [rarityFilter, setRarityFilter] = useState('');

  const domains = useMemo(() => 
    [...new Set(initialCards.map(c => c.domain))].filter(Boolean).sort(),
    [initialCards]
  );
  
  const types = useMemo(() => 
    [...new Set(initialCards.map(c => c.type))].filter(Boolean).sort(),
    [initialCards]
  );

  const filteredCards = useMemo(() => {
    return initialCards.filter(card => {
      const matchesSearch = search === '' || 
        card.name.toLowerCase().includes(search.toLowerCase());
      const matchesDomain = domainFilter === '' || 
        card.domain?.toLowerCase() === domainFilter.toLowerCase();
      const matchesType = typeFilter === '' || 
        card.type?.toLowerCase() === typeFilter.toLowerCase();
      const matchesRarity = rarityFilter === '' || 
        card.rarity?.toLowerCase() === rarityFilter.toLowerCase();
      
      return matchesSearch && matchesDomain && matchesType && matchesRarity;
    });
  }, [initialCards, search, domainFilter, typeFilter, rarityFilter]);

  return (
    <div className="min-h-screen bg-background py-20 px-6">
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
        {/* Enhanced Description as Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-black uppercase tracking-wide leading-tight">
            <span className="text-rift-blue">Explorez</span> les cartes{' '}
            <span className="text-white">Origins</span> &{' '}
            <span className="text-rift-gold">Spiritforged</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            <span className="text-white font-semibold">Filtrez</span> par domaine, rareté ou type
          </p>
        </div>
        
        {/* Search & Filters UI - Compact */}
        <CardPanel className="p-3 mb-4 bg-white/5 border-white/10 backdrop-blur-xl">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2 px-1">Recherche</label>
              <input
                type="text"
                placeholder="Nom de la carte..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-rift-blue focus:outline-none transition-all text-xs"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2 px-1">Domaine</label>
              <select 
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-rift-blue focus:outline-none appearance-none cursor-pointer text-xs"
              >
                <option value="" className="bg-rift-dark">Tous</option>
                {domains.map(domain => (
                  <option key={domain} value={domain} className="bg-rift-dark">{domain}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2 px-1">Type</label>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-rift-blue focus:outline-none appearance-none cursor-pointer text-xs"
              >
                <option value="" className="bg-rift-dark">Tous</option>
                {types.map(type => (
                  <option key={type} value={type} className="bg-rift-dark">{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2 px-1">Rareté</label>
              <select 
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-rift-blue focus:outline-none appearance-none cursor-pointer text-xs"
              >
                <option value="" className="bg-rift-dark">Toutes</option>
                <option value="Champion" className="bg-rift-dark">Champion</option>
                <option value="Epic" className="bg-rift-dark">Epic</option>
                <option value="Rare" className="bg-rift-dark">Rare</option>
                <option value="Uncommon" className="bg-rift-dark">Uncommon</option>
                <option value="Common" className="bg-rift-dark">Common</option>
              </select>
            </div>
          </div>
        </CardPanel>

        {/* Results count */}
        <div className="flex items-center gap-3 mb-3 px-1">
          <Badge className="text-rift-gold border-rift-gold/30 bg-rift-gold/10 text-[10px]">
            {filteredCards.length} cartes
          </Badge>
          <div className="flex-1 h-px bg-white/5" />
        </div>
        
        {/* Cards Grid */}
        {filteredCards.length === 0 ? (
          <EmptyState message="Aucune carte trouvée pour cette sélection." />
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
            {filteredCards.map((card: any) => (
              <Link 
                key={card.id} 
                href={`/cards/${card.id}`}
                className="group relative block"
              >
                <div className="aspect-[3/4.2] overflow-hidden bg-rift-dark-secondary border border-white/5 group-hover:border-rift-blue/60 transition-all duration-200 shadow-md group-hover:shadow-xl group-hover:shadow-rift-blue/20">
                  <img
                    src={card.images?.[0]?.medium || '/placeholder.png'}
                    alt={card.name}
                    className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

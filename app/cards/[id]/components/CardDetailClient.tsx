'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '../../../components/ui/PageHeader';
import { CardPanel } from '../../../components/ui/CardPanel';
import { Badge } from '../../../components/ui/Badge';

interface CardVariant {
  id: string;
  name: string;
  imageUrl: string;
  variantType: 'regular' | 'alternate' | 'foil' | 'signature';
}

interface CardData {
  id: string;
  name: string;
  type: string;
  domain: string;
  rarity: string;
  rules: string;
  energy: number;
  might: number;
  power: number;
  number: string;
  expansion: { id: string; name: string };
  variants: CardVariant[];
  images: { large?: string; medium?: string }[];
}

export default function CardDetailClient({ card }: { card: CardData }) {
  const [selectedVariant, setSelectedVariant] = useState(0);

  const variant = card.variants[selectedVariant] || card.variants[0];
  const imageUrl = variant?.imageUrl || card.images[0]?.large || card.images[0]?.medium || '/placeholder.png';

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Champion': return 'bg-rift-gold/20 text-rift-gold border-rift-gold/30';
      case 'Epic': return 'bg-rift-purple/20 text-rift-purple border-rift-purple/30';
      case 'Rare': return 'bg-rift-blue/20 text-rift-blue border-rift-blue/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/cards" className="text-rift-blue hover:underline">
            ← Retour aux cartes
          </Link>
        </nav>

        <PageHeader
          eyebrow="Fiche Carte"
          title={card.name}
          description={card.rules || "Aucune règle spéciale."}
          align="left"
          className="mb-12"
          eyebrowClassName="bg-rift-blue/10 border-rift-blue/20"
          accentClassName="text-rift-blue italic"
        />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Card Image */}
          <div className="relative">
            <CardPanel className="aspect-[3/4] rounded-[24px] overflow-hidden border-white/10">
              <img
                src={imageUrl}
                alt={variant?.name || card.name}
                className="w-full h-full object-contain"
              />
            </CardPanel>
            
            {/* Variant Selector */}
            {card.variants.length > 1 && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Variantes:</p>
                <div className="flex gap-2 flex-wrap">
                  {card.variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(i)}
                      className={`px-3 py-1 rounded text-xs border transition-colors ${
                        selectedVariant === i 
                          ? 'bg-rift-blue/20 border-rift-blue text-rift-blue' 
                          : 'bg-rift-dark-secondary border-white/10 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {v.variantType === 'regular' ? 'Standard' : 
                       v.variantType === 'foil' ? 'Foil' :
                       v.variantType === 'alternate' ? 'Alt' : 'Signature'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Badge className={getRarityColor(card.rarity)}>{card.rarity}</Badge>
              <Badge className="bg-white/5 text-gray-300 border-white/10">{card.domain}</Badge>
              <Badge className="bg-white/5 text-gray-300 border-white/10">{card.type}</Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <CardPanel className="rounded-[20px] p-4 text-center border-white/10">
                <p className="text-gray-500 text-sm">Énergie</p>
                <p className="font-bold text-xl text-rift-blue">{card.energy}</p>
              </CardPanel>
              <CardPanel className="rounded-[20px] p-4 text-center border-white/10">
                <p className="text-gray-500 text-sm">Might</p>
                <p className="font-bold text-xl text-red-400">{card.might}</p>
              </CardPanel>
              <CardPanel className="rounded-[20px] p-4 text-center border-white/10">
                <p className="text-gray-500 text-sm">Power</p>
                <p className="font-bold text-xl text-blue-400">{card.power}</p>
              </CardPanel>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <CardPanel className="rounded-[20px] p-4 border-white/10">
                <p className="text-gray-500 text-sm">Type</p>
                <p className="font-semibold">{card.type}</p>
              </CardPanel>
              <CardPanel className="rounded-[20px] p-4 border-white/10">
                <p className="text-gray-500 text-sm">Numéro</p>
                <p className="font-semibold">{card.number}</p>
              </CardPanel>
            </div>

            <CardPanel className="rounded-[20px] p-4 border-white/10">
              <p className="text-sm text-gray-500">Extension: {card.expansion.name}</p>
            </CardPanel>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '../components/ui/PageHeader';
import { CardPanel } from '../components/ui/CardPanel';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'ability' | 'keyword' | 'zone' | 'resource' | 'mechanic';
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Might',
    definition: "La valeur d'attaque d'une unité. Détermine les déginfligés lors des combats. Une unité avec 3 Might inflige 3 dégâts.",
    category: 'keyword'
  },
  {
    term: 'Power',
    definition: "La valeur de défense d'une unité. Si les dégats reçus >= Power, l'unité est détruite.",
    category: 'keyword'
  },
  {
    term: 'Energy',
    definition: "La ressource générique pour jouer des cartes. Générée en inclinant des runes. 1 rune inclinée = 1 Energy.",
    category: 'resource'
  },
  {
    term: 'Puissance (Power Cost)',
    definition: "Coût spécifique à un domaine. Nécessite une rune du domaine correspondant. Représenté par des icônes colorées.",
    category: 'resource'
  },
  {
    term: 'Rune',
    definition: "Carte du deck de runes qui génère de l'Energy ou de la Puissance. Deux types: générique (incliner) ou domaine (recycler).",
    category: 'resource'
  },
  {
    term: 'Channel / Canaliser',
    definition: "Action de déplacer les runes du deck de runes vers la pool de runes. Génère des ressources pour le tour.",
    category: 'mechanic'
  },
  {
    term: 'Recycle / Recycler',
    definition: "Action de placer une rune sous son deck de runes. Génère de la Puissance du domaine correspondant mais la rune est temporairement perdue.",
    category: 'mechanic'
  },
  {
    term: 'Exhaust / Exhauster',
    definition: "Incliner une carte ou une rune à 90°. Marque qu'elle a été utilisée ce tour. Les unités exhaussées ne peuvent pas attacker.",
    category: 'mechanic'
  },
  {
    term: 'Ready / Redresser',
    definition: "Remettre une carte ou une rune en position verticale. Permet à une unité d'attaquer à nouveau.",
    category: 'mechanic'
  },
  {
    term: 'Battlefield',
    definition: "Zone de conflit sur le plateau. C'est ici que les combats ont lieu et où les points sont marqués.",
    category: 'zone'
  },
  {
    term: 'Base',
    definition: "Zone arrière sécurisée. Les unités y entrent en jeu et ne peuvent pas bloquer depuis la base (sauf capacité spéciale).",
    category: 'zone'
  },
  {
    term: 'Hold',
    definition: "État d'un Battlefield contrôlé au début de votre tour. Donne 1 point immédiat.",
    category: 'mechanic'
  },
  {
    term: 'Conquer / Conquête',
    definition: "Réussir une attaque sur un Battlefield non contrôlé. Marque 1 point de victoire.",
    category: 'mechanic'
  },
  {
    term: 'Showdown',
    definition: "Phase de combat quand des unités des deux joueurs sont sur le même Battlefield. Les unités s'échangent des dégâts.",
    category: 'mechanic'
  },
  {
    term: 'Overwhelm',
    definition: "Capacité permettant aux dégats excessifs de passer au joueur adverse comme dégats directs.",
    category: 'keyword'
  },
  {
    term: 'Deflect',
    definition: "Capacité nécessitant un coût supplémentaire pour être ciblée par des sorts ou capacités adverses.",
    category: 'keyword'
  },
  {
    term: 'Shield',
    definition: "Capacité give +1 Might supplémentaire quand l'unité défend (est assignée comme bloqueur).",
    category: 'keyword'
  },
  {
    term: 'Tank',
    definition: "Capacité forçant l'unité à recevoir les dmg d'combat en premier.",
    category: 'keyword'
  },
  {
    term: 'Ganking',
    definition: "Capacité permettant à l'unité de se déplacer entre les Battlefields.",
    category: 'keyword'
  },
  {
    term: 'Assault X',
    definition: "Capacité give +X Might supplémentaires pendant qu'unité est attaquante.",
    category: 'keyword'
  },
  {
    term: 'Accelerate',
    definition: "Capacité permettant de payer un coût supplémentaire pour que l'unité entre prête (non exhaussée).",
    category: 'keyword'
  },
  {
    term: 'Legion',
    definition: "Capacité se déclenchant si vous avez joué une autre carte ce tour.",
    category: 'keyword'
  },
  {
    term: 'Hidden',
    definition: "Carte cachée qui peut être révélée plus tard pour un effet spécial. Coute une rune Arc-en-ciel à cacher.",
    category: 'keyword'
  },
  {
    term: 'Buff',
    definition: "Augmentation temporaire des statistiques d'une unité pour le tour. +1 Might, peut conférir des capacités.",
    category: 'keyword'
  },
  {
    term: 'Stun / Étourdir',
    definition: "État empêche une unité d'infliger des dégâts de combat ce tour.",
    category: 'keyword'
  },
  {
    term: 'Mulligan',
    definition: "Phase unique en début de partie pour échanger jusqu'à 2 cartes de sa main. Les cartes échangées vont sous le deck.",
    category: 'mechanic'
  },
  {
    term: 'Victory Score',
    definition: "Score nécessaire pour gagner la partie. Par défaut 8 points.",
    category: 'mechanic'
  },
  {
    term: 'Trash / Défausse',
    definition: "Pile de cartes détruites ou utilisées. Face visible pour consultation.",
    category: 'zone'
  },
  {
    term: 'Banishment / Exil',
    definition: "Pile de cartes retirées définitivement du jeu. Face visible.",
    category: 'zone'
  },
  {
    term: 'Recall / Rappeler',
    definition: "Action de déplacer une unité de la zone de combat vers la Base. N'est pas un déplacement.",
    category: 'mechanic'
  },
  {
    term: 'Arc-en-ciel',
    definition: "Symbole de rune universel. Peut payer n'importe quel coût de domaine.",
    category: 'resource'
  },
  {
    term: 'Champion',
    definition: "Type d'unité spécial. Chaque deck peut inclure jusqu'à 3 copies du même champion.",
    category: 'keyword'
  },
  {
    term: 'Gear / Équipement',
    definition: "Type de carte qui s'équipe sur une unité pour lui conférer des bonus.",
    category: 'keyword'
  },
  {
    term: 'Spell / Sort',
    definition: "Type de carte à usage unique avec un effet immédiat.",
    category: 'keyword'
  },
  {
    term: 'Legend / Légende',
    definition: "Votre avatar dans la partie. Définit vos couleurs de domaine et possède une capacité passive.",
    category: 'ability'
  },
  {
    term: 'Domain / Domaine',
    definition: "Famille de cartes (Fury, Calm, Order, etc.) avec ses propres runes et stratégies.",
    category: 'keyword'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'Tout' },
  { id: 'keyword', label: 'Mots-clés' },
  { id: 'ability', label: 'Capacités' },
  { id: 'resource', label: 'Ressources' },
  { id: 'mechanic', label: 'Mécaniques' },
  { id: 'zone', label: 'Zones' },
];

export default function GlossaryPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'keyword': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ability': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'resource': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'mechanic': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'zone': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-rift-dark py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Lexique"
          title="Glossaire"
          titleAccent="Riftbound"
          description="Tous les termes, mots-clés et mécanismes du jeu expliqués simplement."
          className="mb-16"
          eyebrowClassName="bg-rift-blue/10 border-rift-blue/20"
          accentClassName="text-rift-blue italic"
        />

        <div className="mb-12 space-y-6">
          <input
            type="text"
            placeholder="Rechercher un terme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 font-medium focus:border-rift-blue focus:outline-none"
          />
          
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-white text-black shadow-lg' 
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredTerms.map((term, index) => (
            <CardPanel
              key={index}
              className="p-6 hover:border-rift-blue/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{term.term}</h3>
                <Badge className={`text-[8px] ${getCategoryColor(term.category)}`}>
                  {term.category}
                </Badge>
              </div>
              <p className="text-gray-400 font-medium leading-relaxed">
                {term.definition}
              </p>
            </CardPanel>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <EmptyState message="Aucun terme ne correspond à votre recherche." />
        )}

        <div className="mt-16 p-8 rounded-[32px] bg-gradient-to-br from-rift-gold/10 to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm">
          <div className="text-center md:text-left">
            <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Vous maîtrisez le vocabulaire ?</h4>
            <p className="text-gray-500 font-medium">Consultez les règles complètes ou construisez votre deck.</p>
          </div>
          <div className="flex gap-4">
            <Button href="/learn" variant="secondary" size="lg">
              APPRENDRE À JOUER
            </Button>
            <Button href="/deckbuilder" variant="purple" size="lg">
              DECK BUILDER
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

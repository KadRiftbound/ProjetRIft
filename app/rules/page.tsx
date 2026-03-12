'use client';

import { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { generateFAQJSON_LD } from '../lib/json-ld';

const FAQ_SCHEMA = generateFAQJSON_LD([
  {
    question: "Comment gagner une partie de Riftbound ?",
    answer: "La partie se termine dès qu'un joueur atteint 8 points de victoire. Ces points s'acquièrent principalement par le contrôle stratégique des Battlefields au début de votre tour."
  },
  {
    question: "Qu'est-ce que le contrôle d'un Battlefield ?",
    answer: "Contrôler un Battlefield signifie avoir plus de puissance que votre adversaire sur ce lieu au début de votre tour. Le contrôle rapporte 1 point de victoire par tour."
  },
  {
    question: "Comment fonctionnent les domaines dans Riftbound ?",
    answer: "Chaque carte et légende appartient à un domaine (Fury, Calm, Mind, Body, Chaos, Order). Les domaines déterminent les synergies et les capacités spéciales de vos cartes."
  },
  {
    question: "Quelle est la différence entre unité et champion ?",
    answer: "Les unités sont des cartes standard de votre deck, tandis que votre Champion est une unité spéciale qui définit vos couleurs de domaine et possède une capacité unique."
  },
  {
    question: "Comment fonctionne le mulligan ?",
    answer: "Après la drawn initial de 5 cartes, vous pouvez défausser et redessiner autant de fois que vous le souhaitez, mais vous ne pouvez pas garder plus de 2 cartes de votre main initiale."
  }
]);

interface RuleSection {
  id: string;
  title: string;
  icon: string;
  subsections: {
    subtitle?: string;
    text?: string;
    points?: string[];
    important?: string;
  }[];
}

const SECTIONS: RuleSection[] = [
  {
    id: 'overview',
    title: 'Vue d\'ensemble',
    icon: '🌍',
    subsections: [
      {
        text: "Riftbound est un jeu de cartes à collectionner stratégique situé dans l'univers de Runeterra. Deux joueurs s'affrontent pour le contrôle de Battlefields (Champs de Bataille). Contrairement aux jeux de cartes classiques où vous attaquez les points de vie de l'adversaire, ici vous devez accumuler des points de victoire en dominant le terrain."
      },
      {
        subtitle: "L'Objectif de Victoire",
        text: "La partie se termine immédiatement dès qu'un joueur atteint 8 points de victoire. Ces points s'acquièrent principalement par le contrôle stratégique des Battlefields au début de votre tour ou par des actions d'éclat pendant votre phase d'action."
      },
      {
        subtitle: "Ce que chaque joueur apporte",
        points: [
          "1 Légende : Votre avatar, qui définit vos couleurs de domaine et possède une capacité unique.",
          "1 Champion : Une unité surpuissante qui commence dans la Zone Champion (hors plateau).",
          "Deck Principal (40 cartes) : Composé d'unités, de sorts et d'équipements.",
          "Deck de Runes (12 cartes) : Votre moteur de ressources pour l'énergie et la puissance.",
          "3 Battlefields : Des lieux uniques avec des effets qui modifient les règles locales."
        ]
      }
    ]
  },
  {
    id: 'setup',
    title: 'Mise en place & Mulligan',
    icon: '🃏',
    subsections: [
      {
        subtitle: "Préparation",
        text: "Mélangez vos deux decks séparément. Chaque joueur choisit secrètement 1 Battlefield parmi ses 3. Votre Champion est placé face visible dans la Zone Champion (hors plateau). Les deux joueurs commencent avec 0 point de victoire."
      },
      {
        subtitle: "Main de départ",
        text: "Chaque joueur pioche 4 cartes de son Deck Principal."
      },
      {
        subtitle: "La Phase de Mulligan",
        text: "Une seule fois par partie, vous pouvez optimiser votre main :",
        points: [
          " Piochez d'abord 4 cartes.",
          "Sélectionnez jusqu'à 2 cartes de votre main actuelle et mettez-les de côté.",
          "Piochez le même nombre de cartes de votre deck.",
          "Placez les cartes écartées sous votre deck (Recyclage).",
          "Important : On ne remélange jamais le deck après un mulligan."
        ]
      }
    ]
  },
  {
    id: 'zones',
    title: 'Zones de Jeu',
    icon: '🗺️',
    subsections: [
      {
        subtitle: "Zones du Plateau (Visibles)",
        points: [
          "Base : La zone arrière sécurisée. C'est ici que vos unités entrent en jeu normalement. Elles ne peuvent pas bloquer depuis la base (sauf capacité spéciale).",
          "Battlefield : La zone de conflit. C'est ici que le score est calculé et que les combats pour le contrôle ont lieu."
        ]
      },
      {
        subtitle: "Zones Hors-Plateau",
        points: [
          "Main : Limite de 10 cartes. Si vous devez piocher au-delà, la carte est envoyée directement au Trash.",
          "Rune Pool : Vos runes actives qui génèrent vos ressources chaque tour.",
          "Trash (Défausse) : Pile face visible des cartes détruites ou sorts utilisés.",
          "Banishment (Exil) : Pile face visible des cartes retirées définitivement du jeu."
        ]
      }
    ]
  },
  {
    id: 'resources',
    title: 'Énergie & Puissance',
    icon: '🔮',
    subsections: [
      {
        text: "Dans Riftbound, les ressources ne sont pas automatiques. Elles dépendent des runes que vous choisissez de 'canaliser' depuis votre deck de runes."
      },
      {
        subtitle: "Énergie (Le coût bleu)",
        text: "Situé en haut à gauche de chaque carte. Pour payer :",
        points: [
          "Exhaustez (inclinez à 90°) n'importe quelle rune de votre pool.",
          "Chaque rune ainsi inclinée génère 1 Énergie générique.",
          "L'énergie non utilisée est perdue à la fin de la phase de pioche (au début de votre tour)."
        ]
      },
      {
        subtitle: "Puissance (Le coût de domaine)",
        text: "Situé sous le coût d'énergie. Représenté par des icônes de runes colorées. Pour payer :",
        points: [
          "Recyclez une rune du domaine correspondant (placez-la sous votre deck de runes).",
          "Cela génère 1 Puissance de ce domaine spécifique.",
          "Recycler une rune est un coût définitif pour le cycle actuel de votre deck de runes."
        ],
        important: "Exemple : Pour un sort coûtant 2 Énergie et 1 Puissance Fury, vous devez incliner 2 runes (quelles qu'elles soient) et en mettre 1 de couleur Fury sous votre deck."
      }
    ]
  },
  {
    id: 'phases',
    title: 'Structure du Tour',
    icon: '⏳',
    subsections: [
      {
        subtitle: "1. Éveil (Awaken)",
        text: "Redressez toutes vos unités et runes. Vos unités 'guérissent' de leurs dégâts (sauf mention contraire)."
      },
      {
        subtitle: "2. Début (Beginning)",
        text: "C'est ici que le 'Hold' est vérifié. Si vous contrôlez un Battlefield, gagnez 1 point immédiatement."
      },
      {
        subtitle: "3. Canalisation (Channel)",
        text: "Prenez les 2 premières runes de votre deck de runes et placez-les dans votre pool. (Le joueur 2 en prend 3 lors de son tout premier tour)."
      },
      {
        subtitle: "4. Pioche (Draw)",
        text: "Piochez une carte. L'énergie non utilisée est perdue à la fin de cette phase."
      },
      {
        subtitle: "5. Action (Phase Principale)",
        text: "La phase où tout se joue. Vous pouvez :",
        points: [
          "Jouer des unités, sorts ou équipements.",
          "Déplacer une unité prête de votre Base vers le Battlefield (Action Gratuite).",
          "Déclarer une attaque avec une unité sur le Battlefield.",
          "Utiliser des capacités de cartes ou de Légende."
        ]
      },
      {
        subtitle: "6. Fin (End)",
        text: "Les effets de fin de tour se résolvent. Le tour passe à l'adversaire."
      }
    ]
  },
  {
    id: 'combat',
    title: 'Combat & Showdown',
    icon: '⚔️',
    subsections: [
      {
        subtitle: "Déclarer une Attaque",
        text: "Pour attaquer, votre unité doit être sur le Battlefield et prête (non inclinée). Une fois l'attaque déclarée, l'unité devient 'Exhausted'."
      },
      {
        subtitle: "Le Showdown",
        text: "Si l'adversaire possède des unités sur le même Battlefield, il peut choisir de bloquer. Les unités s'infligent mutuellement des dégâts égaux à leur 'Might' (Attaque). L'ATTAQUANT frappe en premier, puis le DÉFENSEUR réplique.",
        points: [
          "Si la Might reçue égale ou dépasse la Power (Défense) de l'unité, elle est envoyée au Trash.",
          "Si l'attaque n'est pas bloquée, vous conquérez le Battlefield.",
          "Les unités survivantes heal de leurs dégâts après le combat."
        ]
      },
      {
        subtitle: "Conquête (Conquer)",
        text: "Réussir une attaque sur un Battlefield que vous ne contrôliez pas vous donne 1 point de victoire."
      }
    ]
  },
  {
    id: 'scoring',
    title: 'Règle du Point Final',
    icon: '🏆',
    subsections: [
      {
        text: "Riftbound possède une règle anti-rush très importante appelée la règle du Point Final pour éviter que les parties ne se terminent trop brusquement sur une simple attaque."
      },
      {
        subtitle: "Victoire Immédiate",
        text: "Vous gagnez instantanément si votre 8ème point vient de :",
        points: [
          "Un 'Hold' (début de tour).",
          "Un effet direct de carte ou de Légende."
        ]
      },
      {
        subtitle: "L'Exception du Conquer",
        text: "Si vous devriez gagner votre 8ème point par une attaque (Conquer) :",
        points: [
          "Vous devez contrôler TOUS les Battlefields actifs ce tour-là pour gagner.",
          "Sinon, vous ne gagnez pas de point. À la place, vous piochez une carte.",
          "Cela force les joueurs à stabiliser leur avance plutôt que de simplement 'sacrifier' une unité pour le dernier point."
        ]
      }
    ]
  },
  {
    id: 'glossary',
    title: 'Glossaire',
    icon: '📖',
    subsections: [
      {
        subtitle: "Termes Essentiels",
        points: [
          "Might (Might) — La valeur d'attaque d'une unité.",
          "Power — La valeur de défense d'une unité. Si les dégâts reçus >= Power, elle est détruite.",
          "Energy — Ressource générique générée en exhaussant des runes.",
          "Puissance — Coût spécifique à un domaine, payé en recyclant une rune du domaine correspondant.",
          "Exhauster — Incliner une carte à 90°, marquant qu'elle a été utilisée.",
          "Redresser — Remettre une carte en position verticale, permettant d'attaquer à nouveau.",
          "Channel/Canaliser — Déplacer des runes du deck vers la pool.",
          "Recycle — Placer une rune sous le deck de runes pour payer un coût de domaine.",
          "Battlefield — Zone de conflit où les combats ont lieu.",
          "Base — Zone arrière sécurisée où les unités entrent en jeu.",
          "Hold — État d'un Battlefield contrôlé au début de votre tour (donne 1 point).",
          "Conquer/Conquête — Attaquer un Battlefield non contrôlé (1 point de victoire).",
          "Showdown — Phase de combat entre unités sur le même Battlefield.",
          "Mulligan — Phase unique pour échanger jusqu'à 2 cartes en début de partie.",
          "Victory Score — Score nécessaire pour gagner (par défaut 8 points)."
        ]
      },
      {
        subtitle: "Mots-clés (Keywords)",
        points: [
          "Overwhelm — Les dégâts excessifs passent comme dégâts directs au joueur.",
          "Deflect — Coût supplémentaire pour être ciblé par l'adversaire.",
          "Shield — +1 Might supplémentaire en défense.",
          "Tank — Reçoit les dégâts de combat en premier.",
          "Ganking — Peut se déplacer entre les Battlefields.",
          "Assault X — +X Might supplémentaire pendant l'attaque.",
          "Accelerate — Entrer prêt (non-exhaussé) en payant un coût supplémentaire.",
          "Legion — Se déclenche si vous avez joué une carte ce tour.",
          "Hidden — Carte cachée avec un effet spécial à la révélation.",
          "Buff — Augmentation temporaire des statistiques."
        ]
      },
      {
        subtitle: "Types de Cartes",
        points: [
          "Champion — Unité spéciale, jusqu'à 3 copies par deck.",
          "Gear/Équipement — S'équipe sur une unité pour des bonus.",
          "Spell/Sort — Effet immédiat à usage unique.",
          "Legend/Légende — Avatar du joueur avec capacité passive.",
          "Rune — Génère Energy ou Puissance.",
          "Battlefield — Lieu avec effets spéciaux."
        ]
      }
    ]
  }
];

export default function RulesPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const activeSection = SECTIONS.find(s => s.id === activeTab);

  return (
    <div className="min-h-screen bg-rift-dark py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Manuel de Combat"
          title="Règles"
          titleAccent="Officielles"
          description="Maîtrisez les fondements de Riftbound TCG. Ce guide détaille chaque aspect du jeu, de la gestion des runes à la stratégie du point final."
          className="mb-16"
          eyebrowClassName="bg-rift-gold/10 border-rift-gold/20"
        />

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="sticky top-32 space-y-2">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] text-left font-black text-xs tracking-widest uppercase transition-all duration-300 border ${
                    activeTab === section.id
                      ? 'bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.1)] translate-x-2'
                      : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-rift-dark-secondary rounded-[40px] p-10 md:p-16 border border-white/5 shadow-2xl min-h-[600px] relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-rift-gold/5 rounded-full blur-[80px]" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rift-blue/5 rounded-full blur-[80px]" />

              {activeSection && (
                <div key={activeSection.id} className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-3xl border border-white/10 shadow-inner">
                      {activeSection.icon}
                    </div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{activeSection.title}</h2>
                  </div>
                  
                  <div className="space-y-12">
                    {activeSection.subsections.map((sub, idx) => (
                      <div key={idx} className="group">
                        {sub.subtitle && (
                          <h3 className="text-xs font-black text-rift-gold uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                            <span className="w-8 h-px bg-rift-gold opacity-30 group-hover:w-12 transition-all duration-500" />
                            {sub.subtitle}
                          </h3>
                        )}
                        
                        <p className="text-gray-300 text-lg leading-relaxed font-medium mb-6">
                          {sub.text}
                        </p>

                        {sub.points && (
                          <ul className="space-y-4 ml-2">
                            {sub.points.map((point, pIdx) => (
                              <li key={pIdx} className="flex gap-4 text-gray-400 font-medium leading-relaxed">
                                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-rift-blue mt-2.5 shadow-[0_0_8px_rgba(10,200,255,0.5)]" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {sub.important && (
                          <div className="mt-8 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start italic">
                            <span className="text-rift-blue font-bold">ℹ️</span>
                            <p className="text-sm text-blue-300/80 font-medium leading-relaxed">
                              {sub.important}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Footer */}
            <div className="mt-12 p-8 rounded-[32px] bg-gradient-to-br from-rift-purple/10 to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm">
              <div className="text-center md:text-left">
                <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Théorie apprise. Passez au Deck Builder !</h4>
                <p className="text-gray-500 font-medium">Construisez votre premier deck et testez vos connaissances.</p>
              </div>
              <div className="flex gap-4">
                <Button href="/deckbuilder" variant="secondary" size="lg">
                  DECK BUILDER
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
    </div>
  );
}

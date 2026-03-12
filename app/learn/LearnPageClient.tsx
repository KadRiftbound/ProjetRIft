'use client';

import { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { CardPanel } from '../components/ui/CardPanel';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { generateFAQJSON_LD } from '../lib/json-ld';

const FAQ_SCHEMA = generateFAQJSON_LD([
  {
    question: "Quelle est la taille minimum d'un deck ?",
    answer: "En jeu libre, le minimum est de 40 cartes. En tournoi construit, le Main Deck doit être exactement 40 cartes, avec 12 runes, 1 Légende et 3 Battlefields de noms différents."
  },
  {
    question: "Peut-on jouer plus de 3 copies d'une même carte ?",
    answer: "Non. Comme dans la plupart des TCG, la limite est de 3 copies par carte (sauf indication contraire sur la carte elle-même)."
  },
  {
    question: "Qu'est-ce que le Chosen Champion ?",
    answer: "Le Chosen Champion est la version de votre champion qui commence la partie déjà accessible sur la table, dans la Champion Zone."
  },
  {
    question: "Comment fonctionne le Hidden ?",
    answer: "Une carte Hidden peut être placée face cachée sur un Battlefield que vous contrôlez en payant 1 rune Arc-en-ciel."
  },
  {
    question: "Comment gagne-t-on des points ?",
    answer: "Vous gagnez 1 point quand vous conquérez un Battlefield. Au début de chaque tour, vous gagnez 1 point par Battlefield contrôlé (Hold)."
  },
  {
    question: "Quelle est la différence entre Énergie et Puissance ?",
    answer: "L'Énergie se paie en épuisant des runes. La Puissance se paie en recyclant des runes du Domaine correspondant sous votre deck."
  },
  {
    question: "Comment fonctionne le mulligan ?",
    answer: "Une seule fois par partie, avant le début, vous pouvez échanger jusqu'à 2 cartes de votre main."
  },
  {
    question: "Que se passe-t-il en cas d'égalité dans un combat ?",
    answer: "Après l'attribution des dégâts, si les deux camps ont encore des unités, le combat est une égalité."
  },
  {
    question: "Comment jouer en équipe (2v2) ?",
    answer: "En 2v2, la victoire est à 11 points d'équipe. Les alliés ne partagent pas leurs cartes ni leurs ressources."
  },
  {
    question: "Qu'est-ce que le 'Hold' ?",
    answer: "Le Hold est un point que vous gagnez au début de votre tour pour chaque Battlefield que vous contrôlez."
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
    title: "Vue d'ensemble",
    icon: '🌍',
    subsections: [
      {
        text: "Riftbound est un jeu de cartes stratégique pour 2 à 4 joueurs. Le but n'est pas d'éliminer les points de vie adverses, mais de contrôler les Battlefields (zones de combat).",
      },
      {
        subtitle: "Comment gagner ?",
        text: "Chaque Battlefield contrôlé vous rapporte 1 point au début de votre tour. Le premier à 8 points l'emporte (11 en 2v2).",
      },
      {
        subtitle: "Composition d'un deck",
        important: "Deck de 40 cartes + 12 runes + 3 Battlefields. Votre Légende est sur le plateau. Votre Champion commence hors du plateau.",
        points: [
          "1 Légende : Votre avatar, définit vos Domaines.",
          "1 Champion : Une unité surpuissante qui commence dans la Zone Champion (hors plateau).",
          "40 cartes : Unités, sorts et équipements.",
          "12 runes : Votre réserve de ressources.",
          "3 Battlefields : Choisissez-en 1 secrètement au début."
        ]
      }
    ]
  },
  {
    id: 'setup',
    title: 'Mise en place',
    icon: '🃏',
    subsections: [
      {
        subtitle: "Préparation",
        text: "Placez votre Légende. Votre Champion reste hors plateau (face visible). Mélangez vos decks. Chaque joueur pioche 4 cartes, puis peut faire un mulligan de jusqu'à 2 cartes.",
      },
      {
        subtitle: "Début de partie",
        points: [
          "1 Battlefield par joueur est choisi SECRÈTEMENT.",
          "Le premier joueur est tiré au sort.",
          "Le joueur qui commence second prend 3 runes au premier tour."
        ]
      },
      {
        subtitle: "Le Mulligan",
        text: "Avant de jouer, vous pouvez échanger jusqu'à 2 cartes de votre main.",
        points: [
          "Placez les cartes sous votre deck (face cachée).",
          "Repiochez le même nombre.",
          "Vos adversaires savent quelles cartes sont sous votre deck."
        ]
      }
    ]
  },
  {
    id: 'zones',
    title: 'Zones du jeu',
    icon: '🗺️',
    subsections: [
      {
        subtitle: "Zones principales",
        points: [
          "Base : Zone arrière sécurisée. Les unités y entrent en jeu.",
          "Battlefields : Les zones de combat où vous gagnez des points.",
          "Rune Pool : Vos runes actives qui génèrent vos ressources.",
          "Legend Zone : Où se trouve votre Légende.",
          "Champion Zone : Où se trouve votre Champion de départ."
        ]
      },
      {
        subtitle: "Zones de défausse",
        points: [
          "Trash : Les cartes utilisées ou détruites (face visible).",
          "Banishment : Les cartes retirées définitivement (face visible)."
        ]
      },
      {
        subtitle: "Cartes cachées (Hidden)",
        important: "Vous pouvez cacher une carte sur un Battlefield que vous contrôlez en payant 1 rune Arc-en-ciel. Maximum 1 par Battlefield. Elle se révèle gratuitement comme Réaction.",
        points: [
          "Coût : 1 rune Arc-en-ciel pour cacher.",
          "Limite : 1 carte cachée par Battlefield.",
          "Révélation : gratuite en réponse à un effet."
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
        text: "Chaque carte a deux types de coût : l'Énergie (chiffre) et la Puissance (symboles de Domaine).",
      },
      {
        subtitle: "L'Énergie",
        text: "Payez avec vos runes épuisées. L'énergie non utilisée est perdue à la fin de la phase de pioche (au début de votre tour).",
        points: [
          "Épuisez une rune = 1 Énergie.",
          "Se perd si non utilisée."
        ]
      },
      {
        subtitle: "La Puissance",
        text: "Payez en recyclant des runes du Domaine correspondant sous votre deck.",
        points: [
          "Recyclez = placez la rune sous votre deck.",
          "Génère de la Puissance du même Domaine."
        ]
      },
      {
        subtitle: "Point clé : une rune = deux ressources",
        important: "Vous pouvez utiliser la même rune pour l'Énergie ET la Puissance ! Épuisez-la d'abord, puis recyclez-la ensuite. C'est un choix tactique majeur.",
        points: [
          "Une même rune peut servir aux deux.",
          "Ordre important : épuiser → puis recycler."
        ]
      },
      {
        subtitle: "Canalisation",
        text: "Au début de chaque tour, les 2 premières runes de votre deck vont dans votre pool, prêtes à être utilisées.",
        points: [
          "2 runes → Rune Pool au début de chaque tour.",
          "Progression naturelle : plus vous avancez, plus vous avez de runes."
        ]
      }
    ]
  },
  {
    id: 'phases',
    title: 'Déroulement du tour',
    icon: '⏳',
    subsections: [
      {
        subtitle: "1. Éveil",
        text: "Vos unités, Légende et runes s' redressent. Les unités thérapeut leurs dégâts."
      },
      {
        subtitle: "2. Début de tour",
        text: "Résolvez les effets 'début de tour'. Vous gagnez 1 point par Battlefield contrôlé (Hold)."
      },
      {
        subtitle: "3. Canalisation",
        text: "Les 2 premières runes de votre deck vont dans votre pool, prêtes."
      },
      {
        subtitle: "4. Pioche",
        text: "Piochez 1 carte. L'énergie non utilisée est perdue."
      },
      {
        subtitle: "5. Phase d'Action",
        text: "C'est ici que tout se passe :",
        points: [
          "Jouez des unités, sorts ou équipements.",
          "Déplacez une unité de la Base vers un Battlefield.",
          "Déclarez une attaque.",
          "Utilisez les capacités de vos cartes."
        ]
      },
      {
        subtitle: "6. Fin de tour",
        text: "Les effets 'fin de tour' se résolvent. Les unités thérapeut leurs dégâts. Le tour passe à l'adversaire."
      },
      {
        subtitle: "À retenir",
        important: "Riftbound est un jeu de contrôle de terrain, pas de damage racing. Pensez 'points' et 'tempo', pas 'pv' comme dans Magic ou Hearthstone."
      }
    ]
  },
  {
    id: 'combat',
    title: 'Combat',
    icon: '⚔️',
    subsections: [
      {
        subtitle: "Attaquer",
        text: "Déplacez une unité de votre Base vers un Battlefield adverse. Si des unités ennemies sont présentes, un Showdown se déclenche."
      },
      {
        subtitle: "Le Showdown",
        text: "Les deux camps échangent des dégâts simultanément. L'ATTAQUANT frappe en premier, puis le DÉFENSEUR réplique.",
        points: [
          "Ajoutez la Might de toutes vos unités.",
          "Attribuez ces dégâts aux unités adverses.",
          "Les unités avec Tank reçoivent les dégâts en premier.",
          "Toute unité avec ≥ dégâts que sa Power est détruite."
        ]
      },
      {
        subtitle: "Résultat",
        points: [
          "Si vous êtes le SEUL camp encore présent → vous conquérez et marquez 1 point.",
          "Si des deux camps ont des unités → égalité, personne ne marque.",
          "Si vous n'avez plus d'unités → retour à la Base."
        ]
      },
      {
        subtitle: "Action vs Réaction",
        important: "Les Actions se jouent pendant votre tour. Les Réactions se jouent en réponse à un effet, AVANT sa résolution. Elles passent avant tout le reste !",
        points: [
          "Action : pendant votre tour ou un Showdown.",
          "Réaction : en réponse à un effet adverse."
        ]
      }
    ]
  },
  {
    id: 'scoring',
    title: 'Comment marquer',
    icon: '🏆',
    subsections: [
      {
        text: "Vous gagnez des points de deux façons : la conquête et le hold.",
      },
      {
        subtitle: "La Conquête",
        text: "Gagnez 1 point en gagnant un Showdown sur un Battlefield adverse."
      },
      {
        subtitle: "Le Hold",
        text: "Au début de CHAQUE tour, gagnez 1 point par Battlefield que vous contrôlez. C'est votre income régulier !"
      },
      {
        subtitle: "La règle du 8e point",
        important: "Vous ne pouvez PAS gagner avec une seule conquête à 7 points. Vous devez soit avoir un Hold, soit conquérir TOUS les Battlefields d'un coup.",
        points: [
          "7 points + 1 Hold = WIN",
          "7 points + Conquer tous = WIN",
          "7 points + Conquer 1 seul = +1 carte (pas de win)"
        ]
      }
    ]
  },
  {
    id: 'multiplayer',
    title: 'Multijoueur',
    icon: '👥',
    subsections: [
      {
        subtitle: "À 3 joueurs (Skirmish)",
        points: [
          "3 Battlefields disponibles.",
          "Le premier joueur saute sa pioche du premier tour."
        ]
      },
      {
        subtitle: "À 4 joueurs (War)",
        points: [
          "Le premier joueur saute sa pioche.",
          "Son Battlefield de départ est retiré.",
          "La partie se joue sur 3 Battlefields."
        ]
      },
      {
        subtitle: "En équipe (2v2)",
        points: [
          "Victoire à 11 points d'équipe.",
          "Les alliés ne partagent PAS leurs cartes ni leurs ressources.",
          "Chaque joueur a son propre contrôle des Battlefields.",
          "Seul le joueur impliqué dans un combat peut y jouer."
        ]
      }
    ]
  }
];

const FAQ_ITEMS = [
  {
    question: "Quelle est la taille minimum d'un deck ?",
    answer: "En jeu libre, le minimum est de 40 cartes. En tournoi construit, le Main Deck doit être exactement 40 cartes, avec 12 runes, 1 Légende et 3 Battlefields de noms différents."
  },
  {
    question: "Peut-on jouer plus de 3 copies d'une même carte ?",
    answer: "Non. Comme dans la plupart des TCG, la limite est de 3 copies par carte (sauf indication contraire sur la carte elle-même)."
  },
  {
    question: "Qu'est-ce que le Chosen Champion ?",
    answer: "Le Chosen Champion est la version de votre champion qui commence la partie déjà accessible sur la table, dans la Champion Zone. Mais attention : le terme désigne aussi n'importe quelle carte Champion portant le même nom que celle qui a commencé dans la Champion Zone. Certains effets de cartes font référence à 'your Chosen Champion'."
  },
  {
    question: "Comment fonctionne le Hidden ?",
    answer: "Une carte Hidden peut être placée face cachée sur un Battlefield que vous contrôlez en payant 1 rune Arc-en-ciel. Il ne peut y avoir qu'une seule carte cachée par Battlefield. Elle peut ensuite être révélée comme une Réaction à coût 0, avec des restrictions liées au Battlefield où elle était cachée."
  },
  {
    question: "Comment gagne-t-on des points ?",
    answer: "Vous gagnez 1 point quand vous conquérez un Battlefield (attaque réussie où tous les défenseurs sont éliminés). Ensuite, au début de chacun de vos tours, vous gagnez 1 point par Battlefield que vous contrôlez (Hold). Le premier à 8 points gagne (11 en 2v2)."
  },
  {
    question: "Quelle est la différence entre Énergie et Puissance ?",
    answer: "L'Énergie (chiffre numérique) se paie en épuisant des runes. La Puissance (symboles de Domaine) se paie en recyclant des runes du Domaine correspondant sous votre deck. Une même rune peut servir aux deux : d'abord épuisée, puis recyclée."
  },
  {
    question: "Peut-on réagir aux capacités qui ajoutent de l'Énergie ou de la Puissance ?",
    answer: "Non. Ces capacités ne créent pas de fenêtre de réponse normale. Elles se produisent immédiatement et ne peuvent pas être 'réagies' comme un sort classique."
  },
  {
    question: "Comment fonctionne le mulligan ?",
    answer: "Une seule fois par partie, avant le début, vous pouvez échanger jusqu'à 2 cartes de votre main. Placez-les face cachée sous votre deck et repiochez le même nombre. Vos adversaires savent quelles cartes sont sous votre deck."
  },
  {
    question: "Que se passe-t-il en cas d'égalité dans un combat ?",
    answer: "Après l'attribution des dégâts, si les deux camps ont encore des unités (ou si aucun n'en a), le combat est une égalité. Pour vraiment gagner un combat, il faut être le SEUL camp encore présent. En cas d'égalité avec des deux côtés, les attaquants sont rappelés à leur Base."
  },
  {
    question: "Comment jouer en équipe (2v2) ?",
    answer: "En 2v2, la victoire est à 11 points d'équipe. Les alliés sont amicaux mais ne partagent pas leurs cartes, leurs ressources ni le contrôle des Battlefields. Seul le joueur directement impliqué dans un combat peut y jouer des cartes (sauf invitation explicite)."
  },
  {
    question: "Peut-on jouer plus de 3 copies d'un même champion ?",
    answer: "Non. Chaque deck peut inclure jusqu'à 3 copies du même champion (comme pour les autres cartes)."
  },
  {
    question: "Qu'est-ce que le 'Hold' ?",
    answer: "Le Hold est un point que vous gagnez au début de votre tour pour chaque Battlefield que vous contrôlez. C'est la principale source de points récurrente, contrairement à la conquête qui nécessite de gagner un combat."
  }
];

const GLOSSARY_TERMS = [
  { term: 'Might', definition: "La valeur d'attaque d'une unité. Détermine les dégâts infligés lors des combats.", category: 'keyword' as const },
  { term: 'Power', definition: "La valeur de défense d'une unité. Si les dégâts reçus >= Power, l'unité est détruite.", category: 'keyword' as const },
  { term: 'Energy', definition: "La ressource générique pour jouer des cartes. Générée en épuisant des runes. 1 rune épuisée = 1 Énergie.", category: 'resource' as const },
  { term: 'Puissance', definition: "Coût spécifique à un Domaine. Nécessite une rune du Domaine correspondant (recyclée sous le deck).", category: 'resource' as const },
  { term: 'Rune', definition: "Carte du Deck de Runes qui génère de l'Énergie ou de la Puissance. Deux types : générique (épuiser) ou Domaine (recycler).", category: 'resource' as const },
  { term: 'Channel', definition: "Action de déplacer les runes du Deck de Runes vers la pool. Génère des ressources pour le tour.", category: 'mechanic' as const },
  { term: 'Recycle', definition: "Action de placer une rune sous son Deck de Runes. Génère de la Puissance du Domaine correspondant.", category: 'mechanic' as const },
  { term: 'Exhaust', definition: "Incliner une carte ou une rune à 90°. Marque qu'elle a été utilisée. Les unités épuisées ne peuvent pas attacker.", category: 'mechanic' as const },
  { term: 'Ready', definition: "Remettre une carte ou une rune en position verticale. Permet à une unité d'attaquer à nouveau.", category: 'mechanic' as const },
  { term: 'Battlefield', definition: "Zone de conflit sur le plateau. C'est ici que les combats ont lieu et où les points sont marqués.", category: 'zone' as const },
  { term: 'Base', definition: "Zone arrière sécurisée. Les unités y entrent en jeu et retournent après un combat.", category: 'zone' as const },
  { term: 'Hold', definition: "État d'un Battlefield contrôlé au début de votre tour. Donne 1 point immédiat.", category: 'mechanic' as const },
  { term: 'Conquer', definition: "Réussir une attaque sur un Battlefield non contrôlé. Marque 1 point de victoire.", category: 'mechanic' as const },
  { term: 'Showdown', definition: "Phase de combat quand des unités des deux joueurs sont sur le même Battlefield. Échange de dégâts simultané.", category: 'mechanic' as const },
  { term: 'Overwhelm', definition: "Capacité permettant aux dégâts excessifs de passer au joueur adverse comme dégâts directs.", category: 'keyword' as const },
  { term: 'Deflect', definition: "Capacité nécessitant un coût supplémentaire pour être ciblée par des sorts ou capacités adverses.", category: 'keyword' as const },
  { term: 'Shield', definition: "Capacité donnant +1 Might supplémentaire quand l'unité défend.", category: 'keyword' as const },
  { term: 'Tank', definition: "Capacité forçant l'unité à recevoir les dégâts de combat en premier.", category: 'keyword' as const },
  { term: 'Ganking', definition: "Capacité permettant à l'unité de se déplacer entre les Battlefields.", category: 'keyword' as const },
  { term: 'Assault', definition: "Capacité donnant +X Might supplémentaires pendant que l'unité est attaquante.", category: 'keyword' as const },
  { term: 'Accelerate', definition: "Capacité permettant de payer un coût supplémentaire pour que l'unité entre prête.", category: 'keyword' as const },
  { term: 'Legion', definition: "Capacité se déclenchant si vous avez joué une autre carte ce tour.", category: 'keyword' as const },
  { term: 'Hidden', definition: "Carte cachée qui peut être révélée comme Réaction. Coûte 1 rune Arc-en-ciel.", category: 'keyword' as const },
  { term: 'Action', definition: "Carte qui peut être jouée pendant votre tour ou pendant un Showdown.", category: 'keyword' as const },
  { term: 'Reaction', definition: "Carte qui peut être jouée en réponse à un effet, avant sa résolution.", category: 'keyword' as const },
  { term: 'Champion', definition: "Type d'unité spécial. Chaque deck peut inclure jusqu'à 3 copies du même champion.", category: 'keyword' as const },
  { term: 'Chosen Champion', definition: "Version du champion qui commence la partie dans la Champion Zone.", category: 'keyword' as const },
  { term: 'Gear', definition: "Type de carte qui s'équipe sur une unité pour lui conférer des bonus.", category: 'keyword' as const },
  { term: 'Spell', definition: "Type de carte à usage unique avec un effet immédiat. Va à la Trash après résolution.", category: 'keyword' as const },
  { term: 'Legend', definition: "Votre avatar dans la partie. Définit vos Domaines et possède une capacité passive.", category: 'ability' as const },
  { term: 'Domain', definition: "Famille de cartes (Fury, Calm, Order, etc.) avec ses propres runes et stratégies.", category: 'keyword' as const },
  { term: 'Trash', definition: "Pile de cartes détruites ou utilisées. Face visible pour consultation.", category: 'zone' as const },
  { term: 'Banishment', definition: "Pile de cartes retirées définitivement du jeu. Face visible.", category: 'zone' as const },
  { term: 'Recall', definition: "Action de déplacer une unité de la zone de combat vers la Base.", category: 'mechanic' as const },
  { term: 'Arc-en-ciel', definition: "Symbole de rune universel. Peut payer n'importe quel coût de Domaine.", category: 'resource' as const },
];

const CATEGORIES = [
  { id: 'all', label: 'Tout' },
  { id: 'keyword', label: 'Mots-clés' },
  { id: 'ability', label: 'Capacités' },
  { id: 'resource', label: 'Ressources' },
  { id: 'mechanic', label: 'Mécaniques' },
  { id: 'zone', label: 'Zones' },
];

function RulesTab() {
  const [activeTab, setActiveTab] = useState('overview');
  const activeSection = SECTIONS.find(s => s.id === activeTab);

  return (
    <div className="grid lg:grid-cols-4 gap-12">
      <div className="lg:col-span-1">
        <nav className="sticky top-32 space-y-2">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] text-left font-black text-xs tracking-widest uppercase transition-all duration-300 border ${
                activeTab === section.id
                  ? 'bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.1)] translate-x-2'
                  : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      <div className="lg:col-span-3">
        <div className="bg-[var(--surface-3)] rounded-[var(--radius-2xl)] p-10 md:p-16 border border-[var(--border-subtle)] shadow-[var(--shadow-2xl)] min-h-[600px] relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-rift-gold/5 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rift-blue/5 rounded-full blur-[80px]" />

          {activeSection && (
            <div key={activeSection.id} className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-[var(--border-subtle)] flex items-center justify-center text-3xl border border-[var(--border-default)] shadow-inner">
                  {activeSection.icon}
                </div>
                <h2 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tighter">{activeSection.title}</h2>
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
                    {sub.text && (
                      <p className="text-[var(--text-secondary)] text-lg leading-relaxed font-medium mb-6">{sub.text}</p>
                    )}
                    {sub.points && (
                      <ul className="space-y-4 ml-2">
                        {sub.points.map((point, pIdx) => (
                          <li key={pIdx} className="flex gap-4 text-[var(--text-secondary)] font-medium leading-relaxed">
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-rift-blue mt-2.5 shadow-[0_0_8px_rgba(10,200,255,0.5)]" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {sub.important && (
                      <div className="mt-8 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start">
                        <span className="text-rift-blue font-bold">ℹ️</span>
                        <p className="text-sm text-blue-300/80 font-medium leading-relaxed">{sub.important}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FAQTab() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {FAQ_ITEMS.map((item, index) => (
        <div
          key={index}
          className="bg-[var(--surface-3)] rounded-[var(--radius-xl)] border border-[var(--border-subtle)] overflow-hidden transition-all duration-300"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <span className="font-black text-[var(--text-primary)] uppercase tracking-wide pr-4">{item.question}</span>
            <span className={`shrink-0 text-rift-gold text-xl transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
            <div className="px-6 pb-6 pt-0">
              <p className="text-[var(--text-secondary)] font-medium leading-relaxed">{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GlossaryTab() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'keyword': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ability': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'resource': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'mechanic': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'zone': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div>
      <div className="mb-12 space-y-6">
        <input
          type="text"
          placeholder="Rechercher un terme..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-4 bg-[var(--border-subtle)] border border-[var(--border-default)] rounded-2xl text-[var(--text-primary)] placeholder-[var(--text-disabled)] font-medium focus:border-rift-blue focus:outline-none"
        />
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-black shadow-[var(--shadow-md)]'
                  : 'bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-default)] border border-[var(--border-default)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredTerms.map((term, index) => (
          <CardPanel key={index} className="p-6 hover:border-rift-blue/30 transition-all duration-300">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">{term.term}</h3>
              <Badge className={`text-[8px] ${getCategoryColor(term.category)}`}>
                {term.category}
              </Badge>
            </div>
            <p className="text-[var(--text-secondary)] font-medium leading-relaxed">{term.definition}</p>
          </CardPanel>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <EmptyState message="Aucun terme ne correspond à votre recherche." />
      )}
    </div>
  );
}

type Tab = 'rules' | 'faq' | 'glossary';

export default function LearnPageClient() {
  const [activeTab, setActiveTab] = useState<Tab>('rules');

  return (
    <div className="min-h-screen bg-[var(--surface-2)] py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Académie Riftbound"
          title="Apprendre à"
          titleAccent="jouer"
          description="Maîtrisez les fondements de Riftbound TCG : règles officielles, réponses aux questions fréquentes et glossaire complet."
          className="mb-12"
          eyebrowClassName="bg-rift-gold/10 border-rift-gold/20"
        />

        <div className="flex gap-2 mb-12 p-1.5 bg-[var(--border-subtle)] rounded-2xl border border-[var(--border-default)] w-fit">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
              activeTab === 'rules'
                ? 'bg-white text-black shadow-[var(--shadow-md)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            ⚔️ Règles
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
              activeTab === 'faq'
                ? 'bg-white text-black shadow-[var(--shadow-md)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            ❓ FAQ
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
              activeTab === 'glossary'
                ? 'bg-white text-black shadow-[var(--shadow-md)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            📖 Glossaire
          </button>
        </div>

        <div className="animate-in fade-in duration-300">
          {activeTab === 'rules' && <RulesTab />}
          {activeTab === 'faq' && <FAQTab />}
          {activeTab === 'glossary' && <GlossaryTab />}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
    </div>
  );
}

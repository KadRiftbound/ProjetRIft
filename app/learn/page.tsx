'use client';

import { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { CardPanel } from '../components/ui/CardPanel';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

// ─── RÈGLES ────────────────────────────────────────────────────────────────────

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
        text: "Riftbound est un jeu de cartes à collectionner pour 2 à 4 joueurs. Le but n'est pas de 'vida les points de vie' d'un adversaire, mais de contrôler les Battlefields (Champs de Bataille)."
      },
      {
        subtitle: "Comment gagner ?",
        text: "Quand vous prenez un Battlefield, vous marquez 1 point. Puis, au début de chacun de vos tours, chaque Battlefield que vous contrôlez vous rapporte 1 point supplémentaire (Hold). En partie standard, le premier joueur à 8 points gagne. En 2v2, c'est la première équipe à 11 points."
      },
      {
        subtitle: "Composition d'un deck",
        important: "Pour un nouveau joueur : commencez avec 40 cartes de Main Deck, 12 runes et 3 Battlefields distincts. En tournoi construit, le Main Deck doit être exactement 40 cartes.",
        points: [
          "1 Légende : Votre avatar, qui définit vos Domaines et possède une capacité unique.",
          "1 Champion选择在 : La version de votre champion qui commence la partie sur la table.",
          "Deck Principal (40 cartes minimum) : Unités, sorts et équipements.",
          "Deck de Runes (12 cartes) : Votre réserve de ressources.",
          "3 Battlefields : Des lieux uniques avec des effets locaux."
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
        text: "Chaque joueur place sa Légende et son Champion choisi face visible, mélange son Main Deck et son Rune Deck, et prépare les zones : la Base, les Runes et la Trash. Les Battlefields sont mis de côté pour être choisis au début."
      },
      {
        subtitle: "Début de partie",
        points: [
          "Sélectionnez 1 Battlefield par joueur.",
          "Déterminez le premier joueur en tirant un Battlefield au hasard.",
          "Chaque joueur pioche 4 cartes.",
          "Le dernier joueur (qui commence second) joue une rune supplémentaire lors de son premier tour."
        ]
      },
      {
        subtitle: "Le Mulligan",
        text: "Avant le début de la partie, chaque joueur peut faire un seul mulligan :",
        points: [
          "Sélectionnez jusqu'à 2 cartes de votre main actuelle.",
          "Placez-les face cachée sous votre deck.",
          "Repiochez le même nombre de cartes.",
          "Vos adversaires savent quelles cartes sont sous votre deck."
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
        subtitle: "Zones principales",
        points: [
          "Legend Zone : Contient votre Légende.",
          "Champion Zone : Contient votre Champion choisi au début de la partie.",
          "Base : Zone arrière sécurisée. Les unités y entrent en jeu.",
          "Battlefields : Les objectifs que tout le monde se dispute.",
          "Rune Pool : Vos runes actives qui génèrent vos ressources."
        ]
      },
      {
        subtitle: "Zones de défausse",
        points: [
          "Trash : Les cartes défaussées, détruites ou sorts résolus (face visible).",
          "Banishment : Les cartes retirées définitivement du jeu (face visible)."
        ]
      },
      {
        subtitle: "Cartes cachées (Hidden)",
        important: "Une carte Hidden peut être placée face cachée sur un Battlefield que vous contrôlez. Il ne peut y en avoir qu'une par Battlefield. Elle peut être révélée comme une Réaction à coût 0, avec des restrictions liées au Battlefield où elle était cachée.",
        points: [
          "Coût : 1 rune Arc-en-ciel pour cacher.",
          "Limite : 1 carte cachée par Battlefield.",
          "Réaction : Révélable gratuitement en réponse à un effet."
        ]
      },
      {
        subtitle: "Taille de main",
        important: "Il n'y a pas de taille maximale de main dans Riftbound."
      }
    ]
  },
  {
    id: 'resources',
    title: 'Énergie & Puissance',
    icon: '🔮',
    subsections: [
      {
        text: "Chaque carte a un coût en deux parties : l'Énergie (chiffre numérique) et la Puissance (symboles de Domaine)."
      },
      {
        subtitle: "Énergie (coût numérique)",
        points: [
          "Payez en épuisant des runes de votre pool.",
          "1 rune épuisée = 1 Énergie.",
          "L'Énergie non utilisée est perdue en fin de phase de pioche ET en fin de tour."
        ]
      },
      {
        subtitle: "Puissance (coût de Domaine)",
        points: [
          "Payez en recyclant des runes du Domaine correspondant.",
          "Recyclage = placer la rune sous votre Rune Deck.",
          "Génère 1 Puissance du Domaine de la rune recyclée."
        ]
      },
      {
        subtitle: "Point clé : une rune peut servir aux deux",
        important: "Vous pouvez d'abord épuiser une rune pour payer de l'Énergie, puis la recycler ensuite pour payer de la Puissance. C'est un ressort tactique majeur : il faut gérer non seulement combien de runes vous avez, mais aussi quand accepter d'en renvoyer sous votre deck pour un effet plus puissant.",
        points: [
          "Une même rune peut servir pour l'Énergie ET la Puissance.",
          "L'ordre est important : épuiser d'abord, puis recycler."
        ]
      },
      {
        subtitle: "Canalisation",
        text: "Au début de chacun de vos tours, vous canalisez les 2 runes du dessus de votre Rune Deck. Elles arrivent prêtes sur le plateau. Votre économie progresse naturellement, mais la partie vous demande de faire des choix : garder vos runes pour plusieurs petites actions, ou en recycler certaines pour jouer une carte plus explosive.",
        points: [
          "2 runes du dessus → Rune Pool (prêtes) à chaque début de tour.",
          "Vos 2 Domains recommandés : 6 runes / 6 runes au départ."
        ]
      },
      {
        subtitle: "Fenêtres de réponse",
        important: "Les capacités qui ajoutent de l'Énergie ou de la Puissance ne créent pas de fenêtre de réponse normale. Elles se produisent immédiatement et ne peuvent pas être 'réagies' comme un sort classique."
      }
    ]
  },
  {
    id: 'phases',
    title: 'Structure du Tour',
    icon: '⏳',
    subsections: [
      {
        subtitle: "1. Éveil (Awaken Phase)",
        text: "Redressez vos unités, votre Légende et vos runes épuisées. Vos unités 'guérissent' de tous leurs dégâts (sauf mention contraire)."
      },
      {
        subtitle: "2. Début (Beginning Phase)",
        text: "Résolvez les effets 'début de tour'. Marquez vos points de Hold pour les Battlefields que vous contrôlez : 1 point par Battlefield contrôlé au début de votre tour."
      },
      {
        subtitle: "3. Canalisation (Channel Phase)",
        text: "Prenez les 2 premières runes de votre Rune Deck et placez-les prêtes dans votre pool. Le joueur qui commence en second prend 3 runes lors de son tout premier tour."
      },
      {
        subtitle: "4. Pioche (Draw Phase)",
        text: "Piochez 1 carte. L'Énergie accumulée précédemment mais non dépensée est dissipée."
      },
      {
        subtitle: "5. Action (Action Phase)",
        text: "Le cœur du tour. Vous pouvez :",
        points: [
          "Jouer des unités, sorts ou équipements.",
          "Déplacer une unité prête de votre Base vers un Battlefield.",
          "Déclarer une attaque avec une unité sur un Battlefield.",
          "Utiliser des capacités de cartes ou de Légende.",
          "Jouer votre Champion choisi depuis la Champion Zone (c'est une carte comme les autres)."
        ]
      },
      {
        subtitle: "6. Fin (End Phase)",
        text: "Les effets 'fin de tour' se résolvent. Toutes les unités soignent leurs dégâts. Le tour passe à l'adversaire."
      },
      {
        subtitle: "Points essentiels pour un débutant",
        important: "Riftbound n'est pas un jeu où les dégâts restent longtemps sur la table. Les combats se décider dans l'instant, et il faut raisonner en termes de prise de terrain et de tempo, pas de 'grignotage' de points de vie comme dans d'autres TCG."
      }
    ]
  },
  {
    id: 'combat',
    title: 'Combat & Showdown',
    icon: '⚔️',
    subsections: [
      {
        subtitle: "Déclarer une attaque",
        text: "Pour attaquer, déplacez une unité vers un Battlefield où se trouvent déjà des unités ennemies. Cela déclenche un Showdown."
      },
      {
        subtitle: "Le Showdown (Déroulement)",
        points: [
          "1. Résoudre les effets 'when I defend'.",
          "2. Résoudre les effets 'when I attack'.",
          "3. Les joueurs peuvent jouer des Actions, des Réactions et des cartes Hidden sur ce Battlefield."
        ]
      },
      {
        subtitle: "Action vs Réaction",
        important: "Par défaut, vous jouez vos cartes et activez vos capacités seulement pendant votre tour, quand rien d'autre ne se passe. Une carte Action vous autorise à intervenir pendant un Showdown. Une carte Réaction va plus loin : vous pouvez la jouer en réponse à un sort ou une capacité AVANT qu'elle ne se resolve.",
        points: [
          "Action : se joue pendant un Showdown.",
          "Réaction : se joue en réponse à un effet, passe avant celui-ci."
        ]
      },
      {
        subtitle: "Résolution du combat",
        points: [
          "Chaque joueur additionne la Might de ses unités présentes.",
          "Cette valeur devient les dégâts à répartir entre les unités adverses.",
          "Assignez des dégâts létaux à une unité avant d'en mettre sur une autre.",
          "Les unités avec Tank doivent être assignées en premier.",
          "Tous les dégâts sont infligés SIMULTANÉMENT.",
          "Toute unité ayant reçu des dégâts ≥ sa Might est tuée.",
          "Les dégâts sont ensuite retirés."
        ]
      },
      {
        subtitle: "Résultat du combat",
        points: [
          "Si seuls les attaquants survivent → ils conquièrent le Battlefield et marquent 1 point.",
          "Si au moins un défenseur survit → pas de conquête, les attaquants retournent à leur Base.",
          "Égalité : si les deux camps ont des unités OU si aucun camp n'en a."
        ]
      },
      {
        subtitle: "Règle importante : pour gagner un combat",
        important: "Après l'attribution des dégâts, si les deux camps ont encore des unités, ou si aucun camp n'en a, c'est une égalité. Pour vraiment 'gagner' un combat, il faut être le SEUL camp encore présent après la résolution des dégâts."
      }
    ]
  },
  {
    id: 'scoring',
    title: 'Règle du Point Final',
    icon: '🏆',
    subsections: [
      {
        text: "C'est la règle la plus contre-intuitive pour un nouveau joueur. Dans Riftbound, vous ne pouvez pas gagner simplement en prenant votre 8e point grâce à une seule conquête isolée."
      },
      {
        subtitle: "Pour marquer votre point final et gagner",
        points: [
          "Soit obtenir ce point grâce à un Hold (début de tour).",
          "Soit marquer TOUS les Battlefields sur le même tour."
        ]
      },
      {
        subtitle: "L'exception",
        important: "Si vous deviez marquer le point gagnant sans remplir l'une de ces deux conditions, vous piochez 1 carte À LA PLACE du point.",
        points: [
          "À 7 points + Conquer seul = vous ne gagnez pas, vous piochez 1 carte.",
          "À 7 points + Hold = vous gagnez.",
          "À 7 points + Conquer tous les BFs = vous gagnez."
        ]
      },
      {
        subtitle: "En résumé",
        text: "Cette règle vous force à stabiliser votre avance plutôt que de simplement 'sacrifier' une unité pour le dernier point. Riftbound récompense moins l'attaque frontale que la gestion du terrain."
      }
    ]
  },
  {
    id: 'multiplayer',
    title: 'Multijoueur',
    icon: '👥',
    subsections: [
      {
        subtitle: "Skirmish (3 joueurs)",
        points: [
          "3 Battlefields disponibles.",
          "Le premier joueur saute sa pioche du premier tour."
        ]
      },
      {
        subtitle: "War (4 joueurs)",
        points: [
          "Le premier joueur saute sa première pioche.",
          "Son Battlefield de départ est retiré.",
          "La partie se joue sur 3 Battlefields."
        ]
      },
      {
        subtitle: "2v2 (Équipe)",
        points: [
          "Victoire à 11 points d'équipe.",
          "Les alliés sont amicaux entre eux.",
          "Ils ne partagent NI leurs cartes, NI leurs ressources, NI le contrôle des Battlefields.",
          "Seuls deux joueurs peuvent avoir des unités dans un même combat.",
          "Par défaut, seuls ces deux joueurs peuvent y jouer des Actions et Réactions."
        ]
      }
    ]
  }
];

// ─── FAQ ────────────────────────────────────────────────────────────────────────

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
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

// ─── GLOSSAIRE ─────────────────────────────────────────────────────────────────

interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'ability' | 'keyword' | 'zone' | 'resource' | 'mechanic';
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: 'Might', definition: "La valeur d'attaque d'une unité. Détermine les dégâts infligés lors des combats.", category: 'keyword' },
  { term: 'Power', definition: "La valeur de défense d'une unité. Si les dégâts reçus >= Power, l'unité est détruite.", category: 'keyword' },
  { term: 'Energy', definition: "La ressource générique pour jouer des cartes. Générée en épuisant des runes. 1 rune épuisée = 1 Énergie.", category: 'resource' },
  { term: 'Puissance', definition: "Coût spécifique à un Domaine. Nécessite une rune du Domaine correspondant (recyclée sous le deck).", category: 'resource' },
  { term: 'Rune', definition: "Carte du Deck de Runes qui génère de l'Énergie ou de la Puissance. Deux types : générique (épuiser) ou Domaine (recycler).", category: 'resource' },
  { term: 'Channel', definition: "Action de déplacer les runes du Deck de Runes vers la pool. Génère des ressources pour le tour.", category: 'mechanic' },
  { term: 'Recycle', definition: "Action de placer une rune sous son Deck de Runes. Génère de la Puissance du Domaine correspondant.", category: 'mechanic' },
  { term: 'Exhaust', definition: "Incliner une carte ou une rune à 90°. Marque qu'elle a été utilisée. Les unités épuisées ne peuvent pas attaquer.", category: 'mechanic' },
  { term: 'Ready', definition: "Remettre une carte ou une rune en position verticale. Permet à une unité d'attaquer à nouveau.", category: 'mechanic' },
  { term: 'Battlefield', definition: "Zone de conflit sur le plateau. C'est ici que les combats ont lieu et où les points sont marqués.", category: 'zone' },
  { term: 'Base', definition: "Zone arrière sécurisée. Les unités y entrent en jeu et retournent après un combat.", category: 'zone' },
  { term: 'Hold', definition: "État d'un Battlefield contrôlé au début de votre tour. Donne 1 point immédiat.", category: 'mechanic' },
  { term: 'Conquer', definition: "Réussir une attaque sur un Battlefield non contrôlé. Marque 1 point de victoire.", category: 'mechanic' },
  { term: 'Showdown', definition: "Phase de combat quand des unités des deux joueurs sont sur le même Battlefield. Échange de dégâts simultané.", category: 'mechanic' },
  { term: 'Overwhelm', definition: "Capacité permettant aux dégâts excessifs de passer au joueur adverse comme dégâts directs.", category: 'keyword' },
  { term: 'Deflect', definition: "Capacité nécessitant un coût supplémentaire pour être ciblée par des sorts ou capacités adverses.", category: 'keyword' },
  { term: 'Shield', definition: "Capacité donnant +1 Might supplémentaire quand l'unité défend.", category: 'keyword' },
  { term: 'Tank', definition: "Capacité forçant l'unité à recevoir les dégâts de combat en premier.", category: 'keyword' },
  { term: 'Ganking', definition: "Capacité permettant à l'unité de se déplacer entre les Battlefields.", category: 'keyword' },
  { term: 'Assault', definition: "Capacité donnant +X Might supplémentaires pendant que l'unité est attaquante.", category: 'keyword' },
  { term: 'Accelerate', definition: "Capacité permettant de payer un coût supplémentaire pour que l'unité entre prête.", category: 'keyword' },
  { term: 'Legion', definition: "Capacité se déclenchant si vous avez joué une autre carte ce tour.", category: 'keyword' },
  { term: 'Hidden', definition: "Carte cachée qui peut être révélée plus tard comme Réaction. Coûte 1 rune Arc-en-ciel.", category: 'keyword' },
  { term: 'Action', definition: "Carte qui peut être jouée pendant votre tour ou pendant un Showdown.", category: 'keyword' },
  { term: 'Reaction', definition: "Carte qui peut être jouée en réponse à un effet, avant sa résolution.", category: 'keyword' },
  { term: 'Champion', definition: "Type d'unité spécial. Chaque deck peut inclure jusqu'à 3 copies du même champion.", category: 'keyword' },
  { term: 'Chosen Champion', definition: "Version du champion qui commence la partie dans la Champion Zone. Désigne aussi toute carte Champion du même nom.", category: 'keyword' },
  { term: 'Gear', definition: "Type de carte qui s'équipe sur une unité pour lui conférer des bonus.", category: 'keyword' },
  { term: 'Spell', definition: "Type de carte à usage unique avec un effet immédiat. Va à la Trash après résolution.", category: 'keyword' },
  { term: 'Legend', definition: "Votre avatar dans la partie. Définit vos Domaines et possède une capacité passive.", category: 'ability' },
  { term: 'Domain', definition: "Famille de cartes (Fury, Calm, Order, etc.) avec ses propres runes et stratégies.", category: 'keyword' },
  { term: 'Trash', definition: "Pile de cartes détruites ou utilisées. Face visible pour consultation.", category: 'zone' },
  { term: 'Banishment', definition: "Pile de cartes retirées définitivement du jeu. Face visible.", category: 'zone' },
  { term: 'Recall', definition: "Action de déplacer une unité de la zone de combat vers la Base. N'est pas un déplacement.", category: 'mechanic' },
  { term: 'Arc-en-ciel', definition: "Symbole de rune universel. Peut payer n'importe quel coût de Domaine.", category: 'resource' },
];

const CATEGORIES = [
  { id: 'all', label: 'Tout' },
  { id: 'keyword', label: 'Mots-clés' },
  { id: 'ability', label: 'Capacités' },
  { id: 'resource', label: 'Ressources' },
  { id: 'mechanic', label: 'Mécaniques' },
  { id: 'zone', label: 'Zones' },
];

// ─── COMPOSANT RÈGLES ──────────────────────────────────────────────────────────

function RulesTab() {
  const [activeTab, setActiveTab] = useState('overview');
  const activeSection = SECTIONS.find(s => s.id === activeTab);

  return (
    <div className="grid lg:grid-cols-4 gap-12">
      {/* Sidebar */}
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

      {/* Content */}
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

// ─── COMPOSANT FAQ ─────────────────────────────────────────────────────────────

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

// ─── COMPOSANT GLOSSAIRE ───────────────────────────────────────────────────────

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
      {/* Search & Filter */}
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

      {/* Terms Grid */}
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

// ─── PAGE PRINCIPALE ───────────────────────────────────────────────────────────

type Tab = 'rules' | 'faq' | 'glossary';

export default function LearnPage() {
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

        {/* Tab Switcher */}
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

        {/* Content */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'rules' && <RulesTab />}
          {activeTab === 'faq' && <FAQTab />}
          {activeTab === 'glossary' && <GlossaryTab />}
        </div>
      </div>
    </div>
  );
}

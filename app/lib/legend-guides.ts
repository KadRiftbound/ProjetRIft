export interface LegendGuide {
  legendId: string;
  isMeta: boolean;
  overview: string;
  ability: string;
  stats: {
    might: number;
    power: number;
    energy: number;
  };
  mulligan?: string;
  strategy?: {
    early: string;
    mid: string;
    late: string;
  };
  techniques?: string[];
  combos?: {
    cards: string[];
    effect: string;
  }[];
  decks: {
    name: string;
    description: string;
    coreCards: string[];
    strategy: string;
  }[];
  synergies: {
    cardName: string;
    synergy: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  matchups: {
    against: string;
    outcome: 'favorable' | 'neutral' | 'unfavorable';
    tips: string;
  }[];
  tips: string[];
  counters: string[];
}

export const LEGEND_GUIDES: Record<string, LegendGuide> = {
  // --- TIER S (META) ---
  
  'SFD-185': { // Draven - Glorious Executioner
    legendId: 'SFD-185',
    isMeta: true,
    overview: 'Draven (Glorious Executioner) est un pilier de la méta Spiritforged. C\'est un deck midrange/tempo dominant avec une excellente capacité à convertir les combats gagnés en avantage de cartes. Ses couleurs offrent à la fois stats, tempo, bounce et burst de combat.',
    ability: 'Glorious Executioner: Quand vous gagnez un combat, piochez 1. (Vous gagnez si seules vos unités restent après le combat.)',
    stats: { might: 4, power: 4, energy: 5 },
    mulligan: 'Gardez Spinning Axe et Noxus Hopeful. Contre un deck lent, cherchez Overzealous Fan pour la pression tour 1. Vous voulez une courbe de menaces efficaces qui forcent des combats favorables.',
    strategy: {
      early: 'Développez un board large. Utilisez vos haches pour éliminer les bloqueurs gênants tout en cyclant. Laissez 2 énergie ouverte est souvent plus fort que développer à vide.',
      mid: 'Utilisez l\'interaction à 2 énergie pour protéger vos unités ou casser le tempo adverse. Transformez chaque combat en point, carte ou énorme swing de tempo.',
      late: 'Snowball via l\'avantage de cartes de Draven. Finissez avec des unités Overwhelm. Si la partie dépasse le tour 8, vos chances diminuent.'
    },
    decks: [
      { 
        name: 'Midrange Draven', 
        description: 'Version de référence / la plus stable.',
        coreCards: ['Spinning Axe', 'Noxus Hopeful', 'Overzealous Fan', 'Fight or Flight', 'Rebuke', 'Battering Ram'],
        strategy: 'Jouez une courbe de menaces efficaces, forcez des combats favorables, puis snowball via l\'avantage de cartes.'
      },
      { 
        name: 'Miracle Draven', 
        description: 'Version plus explosive mais plus polarisée.',
        coreCards: ['Spinning Axe', 'Ezreal, Prodigy', 'Called Shot', 'Rhasa the Sunderer', 'Battering Ram', 'Treasure Hunter'],
        strategy: 'Abusez des moteurs violets pour des tours de burst massifs. Plus haute variance et plus technique.'
      }
    ],
    synergies: [
      { cardName: 'Spinning Axe', synergy: 'Moteur de pioche et buff - reste la carte la plus importante', priority: 'high' },
      { cardName: 'Fight or Flight', synergy: 'Permet de forcer les points ou protéger vos attaques', priority: 'high' },
      { cardName: 'Rebuke', synergy: 'Réponse clave pour punir les attaques adverses', priority: 'high' },
      { cardName: 'Battering Ram', synergy: 'Excellent pour les tours explosifs', priority: 'medium' }
    ],
    matchups: [
      { against: 'Kai\'Sa', outcome: 'favorable', tips: 'Vous pouvez Outtempo Kai\'Sa control. Gardez la pression constante.' },
      { against: 'Irelia', outcome: 'favorable', tips: 'Tuez ses moteurs de combo vite. Votre wide board bat sa protection.' },
      { against: 'Annie', outcome: 'unfavorable', tips: 'Annie peut prendre l\'avance de score très vite. Jouez autour de ses réponses.' },
      { against: 'Ezreal', outcome: 'neutral', tips: 'Matchup de value. Développez plus vite mais attention à leur late game.' },
      { against: 'Viktor', outcome: 'favorable', tips: 'Vous êtes plus agressif. Ne le laissez pas contrôler le rythme.' }
    ],
    tips: [
      'Ne pas entrer dans un combat "juste parce que possible" - l\'objectif est de transformer chaque combat en point, carte ou swing.',
      'Laisser 2 énergie ouverte est souvent plus fort que développer à vide - l\'adversaire doit respecter vos réponses.',
      'Draven aime les boards larges et les échanges asymétriques.',
      'Les haches sont des ressources, n\'ayez pas peur de les utiliser pour piocher même sans combat.'
    ],
    counters: ['Kai\'Sa Control', 'Frostbite', 'Wide Board Control']
  },

  'SFD-195': { // Irelia
    legendId: 'SFD-195',
    isMeta: true,
    overview: 'Irelia (Blade Dancer) définit le style Combo. Elle utilise une multitude de sorts à bas coût pour redresser ses unités et attaquer à répétition, submergeant la défense adverse.',
    ability: 'Blade Dancer: Quand vous choisissez une unité alliée, vous pouvez exhauster Irelia et payer 1 Rune Arc-en-ciel pour la redresser. Quand vous conquérez, redressez Irelia.',
    stats: { might: 4, power: 3, energy: 4 },
    mulligan: 'Blade Rush et Greenglade Caretaker sont essentiels. Contre Draven, gardez Homecoming.',
    strategy: {
      early: 'Préparez vos unités de soutien. Ne gaspillez pas vos sorts de redressement pour de petits dégâts.',
      mid: 'Enchaînez les sorts pour attaquer 3 ou 4 fois avec vos meilleures unités dans le même tour.',
      late: 'Utilisez Irelia pour achever l\'adversaire grâce à sa capacité de redressement infatigable.'
    },
    decks: [{ name: 'Blade Combo', description: 'Inondation de lames.', coreCards: ['Blade Rush', 'Homecoming'], strategy: 'Spam de sorts.' }],
    synergies: [{ cardName: 'Homecoming', synergy: 'Protection et réactivation.', priority: 'high' }],
    matchups: [{ against: 'Ezreal', outcome: 'favorable', tips: 'Vous avez trop de cibles pour lui.' }],
    tips: ['L\'ordre de résolution de vos sorts est la clé de la victoire.'],
    counters: ['Mass Removal', 'Defender decks']
  },

  'SFD-064': { // Ezreal (Assume ID based on metadata)
    legendId: 'SFD-064',
    isMeta: true,
    overview: 'Ezreal est le roi du contrôle réactif. Il punit chaque tentative de développement adverse par des sorts de poke incessants avant de terminer la partie par un déluge de Mana Bolts.',
    ability: 'Arcane Shift: Quand Ezreal attaque, crée un Mana Bolt qui inflige 1 dégât.',
    stats: { might: 3, power: 3, energy: 3 },
    mulligan: 'Mystic Shot et Ezreal sont vos priorités. Cherchez Deep Meditation pour ne jamais manquer de ressources.',
    strategy: {
      early: 'Ne jouez que pour la survie. Gardez vos sorts pour les unités clés adverses.',
      mid: 'Piochez massivement. Ne posez Ezreal que si vous pouvez le protéger avec un sort en réaction.',
      late: 'Le tour de burst. Lancez 5+ sorts pour générer des Mana Bolts et gagner sur un seul tour.'
    },
    decks: [{ name: 'Ezreal Control', description: 'Le mur réactif.', coreCards: ['Mystic Shot', 'Deep Meditation'], strategy: 'Survivez et piochez.' }],
    synergies: [{ cardName: 'Deep Meditation', synergy: 'Maintient la pression de sorts.', priority: 'high' }],
    matchups: [{ against: 'Draven', outcome: 'favorable', tips: 'Gérez Draven et gagnez la partie.' }],
    tips: ['Calculez toujours vos runes pour garder un "Deny" ou un "Protection" ouvert.'],
    counters: ['Wide Boards', 'Aggro Rush']
  },

  // --- TIER A (COMPÉTITIF) ---

  'SFD-132': { // Kai'Sa
    legendId: 'SFD-132',
    isMeta: true,
    overview: 'Kai\'Sa Control est le meilleur contre à la méta Draven. Basé sur le domaine Void, ce deck utilise des removals massifs et des unités à haute défense.',
    ability: 'Void Seeker: Vos cartes Void coûtent 1 de moins. Quand Kai\'Sa tue une unité, piochez 1.',
    stats: { might: 4, power: 3, energy: 4 },
    mulligan: 'Removals de zone et unités à haute Power pour bloquer.',
    strategy: {
      early: 'Stabilisez. Laissez l\'adversaire s\'épuiser sur vos bloqueurs.',
      mid: 'Nettoyez le board avec vos sorts Void à coût réduit.',
      late: 'Utilisez Kai\'Sa pour refaire votre main et écraser l\'adversaire sous la valeur.'
    },
    decks: [{ name: 'Void Control', description: 'Anti-méta absolu.', coreCards: ['Consume', 'Void Seeker'], strategy: 'Destruction de board.' }],
    synergies: [{ cardName: 'Consume', synergy: 'Removal vital.', priority: 'high' }],
    matchups: [{ against: 'Draven', outcome: 'favorable', tips: 'Gardez vos sorts pour Draven.' }],
    tips: ['Ne soyez pas trop agressif, Kai\'Sa gagne naturellement sur le long terme.'],
    counters: ['Ezreal', 'Burn Decks']
  },

  'SFD-203': { // Sivir
    legendId: 'SFD-203',
    isMeta: true,
    overview: 'Sivir Battle Mistress utilise les équipements Or pour créer une armée impossible à déloger au combat.',
    ability: 'Battle Mistress: Quand vous recyclez une rune, jouez un jeton Or. Quand un ennemi meurt, redressez Sivir.',
    stats: { might: 4, power: 3, energy: 4 },
    mulligan: 'Cherchez Blade of the Exile et des unités avec Overwhelm.',
    strategy: {
      early: 'Posez des porteurs d\'équipements. Accumulez les jetons Or.',
      mid: 'Équipez Sivir. Ses attaques Ricochet vont nettoyer le board adverse.',
      late: 'Utilisez l\'Overwhelm boosté par vos équipements pour finir.'
    },
    decks: [{ name: 'Golden Midrange', description: 'Puissance brute.', coreCards: ['Sivir', 'Blade of the Exile'], strategy: 'Équipements massifs.' }],
    synergies: [{ cardName: 'Trinity Force', synergy: 'Stat stick énorme.', priority: 'high' }],
    matchups: [{ against: 'Azir', outcome: 'favorable', tips: 'Vos Ricochets tuent ses soldats.' }],
    tips: ['Utilisez l\'Or pour payer vos sorts en réaction pendant le tour adverse.'],
    counters: ['Weapon Destruction', 'Freeze']
  },

  // --- HORS-MÉTA (GUIDES TECHNIQUES) ---

  'OGN-255': { // Ahri
    legendId: 'OGN-255',
    isMeta: false,
    overview: 'Ahri Nine-Tailed Fox est une légende de contrôle tactique basée sur l\'affaiblissement des attaquants.',
    ability: 'Nine-Tailed Fox: Les ennemis attaquant vos Battlefields gagnent -1 Might ce tour.',
    stats: { might: 3, power: 3, energy: 4 },
    techniques: [
      'Ghost Blocking: Rappelez un bloqueur après déclaration pour annuler l\'attaque adverse.',
      'Might Stacking: Utilisez des sorts de malus pour réduire la Might adverse à 0.',
      'Domain Control: Forcez les combats sur vos Battlefields pour profiter du passif.'
    ],
    combos: [
      { cards: ['Ahri', 'Charm', 'Mystic Shot'], effect: 'Force une unité faible à bloquer ou déplace une menace pour un kill facile.' }
    ],
    decks: [{ name: 'Cunning Control', description: 'Manipulation de board.', coreCards: ['Ahri', 'Retreat'], strategy: 'Rappels et malus.' }],
    synergies: [{ cardName: 'Deny', synergy: 'Protection board.', priority: 'high' }],
    matchups: [{ against: 'Draven', outcome: 'unfavorable', tips: 'Trop rapide pour vos setups.' }],
    tips: ['Soyez patient, votre but est d\'épuiser les ressources adverses.'],
    counters: ['Aggro Rush', 'Untargetable']
  },

  'OGN-259': { // Yasuo
    legendId: 'OGN-259',
    isMeta: false,
    overview: 'Yasuo (Unforgiven) est le maître du mouvement fluide entre les zones.',
    ability: 'Unforgiven: 2 Énergie + Exhaust : Déplacez une unité de ou vers votre base.',
    stats: { might: 3, power: 3, energy: 4 },
    techniques: [
      'Reactive Defense: Amenez un bloqueur depuis la base pendant la phase d\'action adverse.',
      'Hit & Run: Attaquez avec une unité, puis utilisez Yasuo pour la ramener en sécurité à la base.',
      'Combat Reset: Redéployez vos unités blessées pour qu\'elles soignent en tournant.'
    ],
    combos: [
      { cards: ['Yasuo', 'Steel Tempest'], effect: 'Stunnez un ennemi, frappez avec Yasuo, puis retirez-vous.' }
    ],
    decks: [{ name: 'Wind Walker', description: 'Mouvement perpétuel.', coreCards: ['Yasuo', 'Wind Wall'], strategy: 'Attaques surprises.' }],
    synergies: [{ cardName: 'Steel Tempest', synergy: 'Défense parfaite.', priority: 'high' }],
    matchups: [{ against: 'Sivir', outcome: 'neutral', tips: 'Bataille de positionnement.' }],
    tips: ['Gardez toujours 2 Énergie en réserve pour votre capacité de Légende.'],
    counters: ['Direct Damage', 'Removal']
  },

  'OGN-269': { // Sett / The Boss
    legendId: 'OGN-269',
    isMeta: false,
    overview: 'Sett (The Boss) est basé sur la résilience de ses unités et les effets de redressement sur conquête.',
    ability: 'The Boss: Payez 1 et exhaustez Sett pour rappeler une unité mourante à la base.',
    stats: { might: 3, power: 3, energy: 4 },
    techniques: [
      'Death Denial: Sauvez vos unités clés avec la capacité de Sett pour les rejouer le tour suivant.',
      'Conquer Chain: Utilisez le redressement de Sett pour utiliser sa capacité plusieurs fois par tour.',
      'Showdown Baiting: Forcez des combats risqués sachant que vous pouvez sauver votre unité.'
    ],
    combos: [
      { cards: ['Sett', 'Overzealous Fan'], effect: 'Sacrifiez le fan pour bloquer, puis sauvez-le avec Sett pour recommencer.' }
    ],
    decks: [{ name: 'The Arena Boss', description: 'Board persistant.', coreCards: ['Sett', 'Pit Rookie'], strategy: 'Unités immortelles.' }],
    synergies: [{ cardName: 'Arena Bar', synergy: 'Buff constant.', priority: 'medium' }],
    matchups: [{ against: 'Draven', outcome: 'unfavorable', tips: 'Il tue vos unités plus vite que vous ne les sauvez.' }],
    tips: ['Sett brille dans les parties qui durent plus de 10 tours.'],
    counters: ['Banishment', 'Transform effects']
  },

  // --- SPIRITFORGED LEGENDS ---

  'SFD-197': { // Azir - Emperor of the Sands
    legendId: 'SFD-197',
    isMeta: true,
    overview: 'Azir est un deck swarm basé sur les Sand Soldiers. Excellente synergie avec les équipements et strong late game.',
    ability: 'Emperor of the Sands: Vos Sand Soldiers ont Weaponmaster. 1 Énergie + Exhauster: Jouer un jeton Sand Soldier 2 Might sur votre base.',
    stats: { might: 3, power: 4, energy: 4 },
    mulligan: 'Sand Soldier et Horazi Reawakening sont essentiels.',
    strategy: {
      early: 'Spawnpez des Sand Soldiers avec vos sorts et capacités.',
      mid: 'Accumulez des soldats et utilisez Azir pour les buff.',
      late: 'Overwhelm massif avec vos soldats buffés.'
    },
    decks: [{ name: 'Azir Swarm', description: 'Army of soldiers.', coreCards: ['Azir', 'Sand Soldier'], strategy: 'Spawn & buff.' }],
    synergies: [{ cardName: 'Horazi Reawakening', synergy: 'Resurrection massive.', priority: 'high' }],
    matchups: [{ against: 'Draven', outcome: 'neutral', tips: 'Vos soldats peuvent bloquer.' }],
    tips: ['Azir gagne en puissance avec chaque soldat joué.'],
    counters: ['Mass Removal', 'Frostbite']
  },

  'SFD-201': { // Viktor - Chem-Baroness
    legendId: 'SFD-201',
    isMeta: false,
    overview: 'Chem-Baroness utilise des jetons Gold pour générer de la value et de l\'energy.',
    ability: 'Chem-Baroness: Quand vous hold, exhaustez-moi pour jouer un jeton Gold. Vos jetons Gold ajoutent +1 Energy.',
    stats: { might: 3, power: 3, energy: 4 },
    techniques: [
      'Gold Generation: Accumulez des jetons Gold pour générer de l\'energy.',
      'Hold Power: Utilisez le hold pour trigger la capacité de Chem-Baroness.',
      'Late Game Value: Les jetons Gold proporcionan value enorme late game.'
    ],
    combos: [
      { cards: ['Chem-Baroness', 'Gold Card'], effect: 'Double Gold génération.' }
    ],
    decks: [{ name: 'Gold Midrange', description: 'Value deck.', coreCards: ['Chem-Baroness', 'Gold Card'], strategy: 'Gold spam.' }],
    synergies: [{ cardName: 'Gold Card', synergy: 'Gold generation.', priority: 'high' }],
    matchups: [{ against: 'Irelia', outcome: 'unfavorable', tips: 'Trop rapide pour votre génératon.' }],
    tips: ['Gardez des jetons pour les tours adverses.'],
    counters: ['Aggro', 'Fast decks']
  },

  'SFD-204': { // Lucian - Purifier
    legendId: 'SFD-204',
    isMeta: true,
    overview: 'Lucian Purifier est un deck aggro basé sur la lumière et les attaques rapides.',
    ability: 'Purifier: Quand une unité alliée meurt, Lucian est redressé. Quand vous jouez un sort Light, piochez 1.',
    stats: { might: 3, power: 3, energy: 3 },
    mulligan: 'Cherchez Lucian et vos sorts Lights early.',
    strategy: {
      early: 'Attaquez avec Lucian et vos unités Light.',
      mid: 'Utilisez des sorts Light pour draw et damage.',
      late: 'Finish avec Lucian attacks répétés.'
    },
    decks: [{ name: 'Lucian Aggro', description: 'Light aggro.', coreCards: ['Lucian', 'Piercing Light'], strategy: 'Attaques rapides.' }],
    synergies: [{ cardName: 'Piercing Light', synergy: 'Damage + draw.', priority: 'high' }],
    matchups: [{ against: 'Ezreal', outcome: 'favorable', tips: 'Plus rapide que lui.' }],
    tips: ['Lucian est toujours prêt après une mort alliée.'],
    counters: ['Control', 'Removal']
  },

  'SFD-205': { // Fiora - Grand Duelist
    legendId: 'SFD-205',
    isMeta: false,
    overview: 'Fiora Grand Duelist gagne en puissance en tuant des unités adverses lors de duels.',
    ability: 'Grand Duelist: Fiora gagne +1 Might et +1 Power chaque fois qu\'elle tue une unité.',
    stats: { might: 2, power: 2, energy: 3 },
    techniques: [
      'Duel Setup: Positionnez Fiora pour des duels favorables.',
      'Stack Power: Chaque kill rend Fiora plus forte.',
      'Protection: Gardez des sorts pour protéger Fiora.'
    ],
    combos: [
      { cards: ['Fiora', 'Riposte'], effect: 'Kill sécurisé en duel.' }
    ],
    decks: [{ name: 'Fiora Duelist', description: 'Sword master.', coreCards: ['Fiora', 'Riposte'], strategy: 'Duel & kill.' }],
    synergies: [{ cardName: 'Duel', synergy: 'Force duels.', priority: 'high' }],
    matchups: [{ against: 'Master Yi', outcome: 'neutral', tips: 'Équilibre.' }],
    tips: ['Fiora scale indéfiniment.'],
    counters: ['Mass Removal', 'Tank']
  },

  'SFD-206': { // Jax - Grandmaster at Arms
    legendId: 'SFD-206',
    isMeta: true,
    overview: 'Jax Grandmaster est un deck counter qui excelle contre les decks aggressifs.',
    ability: 'Grandmaster at Arms: Jax a Counter (Répond à chaque attack adverse).',
    stats: { might: 4, power: 4, energy: 4 },
    mulligan: 'Gardez Counter Strike et Grandmasters Plan.',
    strategy: {
      early: 'Survivez avec des counters.',
      mid: 'Build Jax avec des équipements.',
      late: 'Utilisez les counters pour contrôler le board.'
    },
    decks: [{ name: 'Jax Counter', description: 'Anti-aggro.', coreCards: ['Jax', 'Counter Strike'], strategy: 'Counters & survival.' }],
    synergies: [{ cardName: 'Counter Strike', synergy: 'Blocage parfait.', priority: 'high' }],
    matchups: [{ against: 'Draven', outcome: 'favorable', tips: 'Comptez ses attaques.' }],
    tips: ['Jax peut répondre à tout.'],
    counters: ['Control', 'Combo']
  },

  'SFD-207': { // Ornn - Fire Below the Mountain
    legendId: 'SFD-207',
    isMeta: false,
    overview: 'Ornn utilise des sorts Fire et des Masterworks pour contrôler le board.',
    ability: 'Fire Below the Mountain: Vos sorts Fire coûtent 1 de moins. Ornn peut créer des Masterworks.',
    stats: { might: 3, power: 4, energy: 4 },
    techniques: [
      'Fire Control: Utilisez des sorts Fire pour control.',
      'Masterwork Value: Ornn crée des équipements puissants.',
      'Late Game Power: Les Masterworks gagnent la partie.'
    ],
    combos: [
      { cards: ['Ornn', 'Into the Fire'], effect: 'Removal + discount.' }
    ],
    decks: [{ name: 'Ornn Control', description: 'Fire control.', coreCards: ['Ornn', 'Into the Fire'], strategy: 'Fire & value.' }],
    synergies: [{ cardName: 'Wildfire', synergy: 'Board clear.', priority: 'high' }],
    matchups: [{ against: 'Kai\'Sa', outcome: 'neutral', tips: 'Bon matchup.' }],
    tips: ['Les Masterworks sont clés.'],
    counters: ['Aggro', 'Fast']
  },

  'SFD-208': { // Ezreal - Prodigal Explorer (already have SFD-064)
    legendId: 'SFD-208',
    isMeta: true,
    overview: 'Ezreal Prodigal Explorer est le roi du contrôle réactif avec poke et card draw.',
    ability: 'Prodigal Explorer: Quand Ezreal attaque, créez un Mana Bolt (1 damage).',
    stats: { might: 3, power: 3, energy: 3 },
    mulligan: 'Mystic Shot et Ezreal sont vos priorités.',
    strategy: {
      early: 'Survie et poke.',
      mid: 'Piochez大量 avec Deep Meditation.',
      late: 'Burst damage avec Mana Bolts.'
    },
    decks: [{ name: 'Ezreal Control', description: 'Poke & draw.', coreCards: ['Ezreal', 'Mystic Shot'], strategy: 'Ragtag & draw.' }],
    synergies: [{ cardName: 'Deep Meditation', synergy: 'Card advantage.', priority: 'high' }],
    matchups: [{ against: 'Draven', outcome: 'favorable', tips: 'Poke & survive.' }],
    tips: ['Calculez vos runes.'],
    counters: ['Aggro', 'Wide Board']
  },

  'OGS-17': { // Annie - Dark Child
    legendId: 'OGS-17',
    isMeta: true,
    overview: 'Annie (Dark Child) est une légende Fury/Chaos ultra-dominante. Elle permet de jouer proactivement tout en restant reactive - une des meilleures capacités de conversion de ressources du jeu. En mars 2026, elle existe sous plusieurs formes: le shell classique tempo-combo (Vi + Ride the Wind), le shell Spiritforged pressure/value, et le shell Seal + Called Shot miracle.',
    ability: 'Dark Child: À la fin de votre tour, ready 2 runes. Vous pouvez dépenser vos runes de façon très agressive sur votre tour, puis représenter des réactions après le ready de deux runes.',
    stats: { might: 0, power: 0, energy: 0 },
    mulligan: 'Gardez une unite early qui marque, un tempo spell utile, et Stacked Deck si la main a déjà le début. Pas de main full late. Dans le shell classique, gardez Vi ou Ride the Wind seulement si le reste de la main est déjà fonctionnel.',
    strategy: {
      early: 'Prenez vite l\'avantage de score. Utilisez vos petites unités et spells de tempo pour scorer avant que l\'adversaire ne se développe.',
      mid: 'C\'est votre moment de victoire. Utilisez Annie pour forcer l\'adversaire à attaquer dans vos deux runes ready, puis punissez avec des réactions. Le shell classique veut monter à 6 puis fermer avec Vi + Ride the Wind.',
      late: 'Si la partie traîne, utilisez votre avantage de ressources et vos réactions pour gagner sur la durée. Le shell miracle est plus constant en late game.'
    },
    decks: [
      { 
        name: 'Classic Tempo-Combo Annie', 
        description: 'Le shell iconique: scorez vite puis fermez avec Vi + Ride the Wind.',
        coreCards: ['Annie, Stubborn', 'Vi, Destructive', 'Ride the Wind', 'Fight or Flight', 'Flash', 'Gust', 'Rebuke', 'Stacked Deck'],
        strategy: 'Cheese to 6 puis close avec Vi + RTW.'
      },
      { 
        name: 'Spiritforged Board-Pressure', 
        description: 'Version plus board-pressure/value avec des corps comme Darius et Kai\'Sa.',
        coreCards: ['Annie, Stubborn', 'Darius, Trifarian', 'Fight or Flight', 'Kai\'Sa, Survivor', 'Ride the Wind', 'Stacked Deck'],
        strategy: 'Jouez la table sur la durée avec plus de vraies unités.'
      },
      { 
        name: 'Seal/Called Shot Miracle', 
        description: 'Version moderne la plus constante avec le package purple miracle.',
        coreCards: ['Annie, Stubborn', 'Called Shot', 'Ezreal, Prodigy', 'Seal of Discord', 'Rhasa the Sunderer', 'Ride the Wind', 'Stacked Deck'],
        strategy: 'Exploitez votre supériorité de cartes et de consistance.'
      }
    ],
    synergies: [
      { cardName: 'Vi, Destructive', synergy: 'Finisher classique du shell 6-to-8', priority: 'high' },
      { cardName: 'Ride the Wind', synergy: 'Carte de close structurelle depuis Origins', priority: 'high' },
      { cardName: 'Fight or Flight', synergy: 'Permet de forcer les points ou conserver un front', priority: 'high' },
      { cardName: 'Called Shot', synergy: 'Meilleur marqueur de la transition miracle', priority: 'high' },
      { cardName: 'Stacked Deck', synergy: 'Aide à combler la faiblesse historique en flux de cartes', priority: 'medium' }
    ],
    matchups: [
      { against: 'Kai\'Sa', outcome: 'neutral', tips: 'Matchup le plus discuté. Prenez l\'avance de score tôt et forcez Kai\'Sa à se développer sous pression. Ne vous faites pas aspirer dans la guerre de removal.' },
      { against: 'Draven Midrange', outcome: 'favorable', tips: 'Annie est ressentie forte et consistante. Cheese to 6 quand la main le permet, gardez vos bounce et tempo spells pour les vrais turns de score.' },
      { against: 'Draven Miracle', outcome: 'unfavorable', tips: 'Le matchup se complique si leur tour explosif arrive à temps. Prenez le score très vite et forcez-les à dévier de leur meilleur timing.' },
      { against: 'Viktor', outcome: 'favorable', tips: 'Annie est souvent citée comme un deck qui \'crushes\' Viktor. Prenez le score avant que l\'attrition ne soit installée.' },
      { against: 'Sett', outcome: 'favorable', tips: 'Gagnez avant que Sett n\'obtienne une position confortable. Utilisez les bounce effects pour nier les meilleurs buffs.' },
      { against: 'Ezreal', outcome: 'neutral', tips: 'Duel équilibré. Forcez Ezreal à réagir tôt, ne lui laissez pas une partie complètement lente.' },
      { against: 'Irelia', outcome: 'neutral', tips: 'Scorez tôt pour forcer Irelia à attaquer. Acceptez une game où les deux joueurs marquent rapidement.' }
    ],
    tips: [
      'Annie est un deck de score d\'abord, pas un deck de removal d\'abord.',
      'Dépensez proactivement car votre légende vous remboursera la réactivité.',
      'Le shell Houston et le shell Vegas ne sont pas le même deck - ils se mulliganent et se sideboardent différemment.',
      'Jouer depuis devant est votre territoire natif.',
      'Vi + Ride the Wind est un finisher, pas une philosophie de vie.',
      'La version Seal + Called Shot doit exploiter sa supériorité de cartes.'
    ],
    counters: ['Kai\'Sa Control', 'Decks combo miracle', 'Matchups où le late game est supérieur']
  },

  'SFD-210': { // Rek'Sai - Void Burrower
    legendId: 'SFD-210',
    isMeta: false,
    overview: 'Rek\'Sai utilise la mécanique Burrow/Unburrow pour des attaques surprises.',
    ability: 'Void Burrower: Vos unités peuvent Burrow (se cacher) et Unburrow (ressortir) pour des attaques.',
    stats: { might: 4, power: 3, energy: 4 },
    techniques: [
      'Burrow Defense: Cachez vos unités pour éviter les attaques.',
      'Unburrow Attack: Ressortez pour surprise damage.',
      'Buried Value: Les unités cachées sont safety.'
    ],
    combos: [
      { cards: ['Rek\'Sai', 'Burrow'], effect: 'Hide & strike.' }
    ],
    decks: [{ name: 'Rek\'Sai Tunnel', description: 'Burrow mechanics.', coreCards: ['Rek\'Sai', 'Burrow'], strategy: 'Hide & strike.' }],
    synergies: [{ cardName: 'Unburrow', synergy: 'Surprise attack.', priority: 'high' }],
    matchups: [{ against: 'Draven', outcome: 'unfavorable', tips: 'Trop aggressif.' }],
    tips: ['Burrow est votre défense.'],
    counters: ['Reveal', 'Aggro']
  },

  // --- ADDITIONAL LEGENDS ---

  'OGN-001': { // Ahri - Nine-Tailed
    legendId: 'OGN-255',
    isMeta: false,
    overview: 'Ahri Nine-Tailed Fox est une légende de contrôle tactique basée sur l\'affaiblissement.',
    ability: 'Nine-Tailed Fox: Les ennemis attaquant vos Battlefields gagnent -1 Might ce tour.',
    stats: { might: 3, power: 3, energy: 4 },
    techniques: [
      'Ghost Blocking: Rappelez un bloqueur après déclaration pour annuler.',
      'Might Stacking: Utilisez des sorts de malus.',
      'Domain Control: Forcez les combats sur vos BFs.'
    ],
    combos: [
      { cards: ['Ahri', 'Charm', 'Mystic Shot'], effect: 'Force weak blocker or kill threat.' }
    ],
    decks: [{ name: 'Cunning Control', description: 'Board manipulation.', coreCards: ['Ahri', 'Retreat'], strategy: 'Recall & debuff.' }],
    synergies: [{ cardName: 'Deny', synergy: 'Board protection.', priority: 'high' }],
    matchups: [{ against: 'Draven', outcome: 'unfavorable', tips: 'Trop rapide.' }],
    tips: ['Soyez patient, épuisez les ressources adverses.'],
    counters: ['Aggro Rush', 'Untargetable']
  },

  'OGN-257': { // Lee Sin - Blind Monk
    legendId: 'OGN-257',
    isMeta: false,
    overview: 'Blind Monk (Lee Sin) est une légende de buff et de mouvement.',
    ability: 'Blind Monk: 1 Énergie + Exhauster: Buff une unité alliée (+1 Might).',
    stats: { might: 3, power: 3, energy: 4 },
    techniques: [
      'Buff Stacking: Accumulez des buffs sur une unité.',
      'Defensive Buff: Buff vos bloqueurs.',
      'Offensive Push: Buff pour finish.'
    ],
    combos: [
      { cards: ['Blind Monk', 'Dragon\'s Rage'], effect: 'Buff & finish.' }
    ],
    decks: [{ name: 'Lee Sin Buff', description: 'Buff master.', coreCards: ['Blind Monk', 'Wuju Style'], strategy: 'Buff & attack.' }],
    synergies: [{ cardName: 'Wuju Style', synergy: 'Massive buff.', priority: 'high' }],
    matchups: [{ against: 'Sivir', outcome: 'neutral', tips: 'Équilibre.' }],
    tips: ['Stackez les buffs sur une unité.'],
    counters: ['Removal', 'Board Clear']
  },

  'OGN-261': { // Leona - Radiant Dawn
    legendId: 'OGN-261',
    isMeta: false,
    overview: 'Radiant Dawn (Leona) buff vos unités quand les ennemis sont étourdis.',
    ability: 'Radiant Dawn: Quand un ennemi est étourdi, buff une unité alliée (+1 Might).',
    stats: { might: 3, power: 4, energy: 4 },
    techniques: [
      'Stun Lock: Utilisez des sorts qui stun pour trigger les buffs.',
      'Defensive Setup: Stall jusqu\'au stun.',
      'Stun Chain: Multiples stun = multiples buffs.'
    ],
    combos: [
      { cards: ['Radiant Dawn', 'Zenith Blade'], effect: 'Stun + buff.' }
    ],
    decks: [{ name: 'Leona Stun', description: 'Stun & buff.', coreCards: ['Radiant Dawn', 'Frostbite'], strategy: 'Stun for buffs.' }],
    synergies: [{ cardName: 'Frostbite', synergy: 'Stun trigger.', priority: 'high' }],
    matchups: [{ against: 'Annie', outcome: 'neutral', tips: 'Bon matchup.' }],
    tips: ['Cherchez des stun pour maximize les buffs.'],
    counters: ['No Stun Decks', 'Aggro']
  },

  'OGN-263': { // Teemo - Swift Scout
    legendId: 'OGN-263',
    isMeta: false,
    overview: 'Teemo Swift Scout utilise des mushrooms et des cartes Hidden.',
    ability: 'Swift Scout: Vous pouvez payer 1 Énergie au lieu d\'une rune Arc-en-ciel pour cacher une carte. 1 Énergie + Exhauster: Mettez un Teemo de votre zone champion ou du board dans votre main.',
    stats: { might: 2, power: 2, energy: 3 },
    techniques: [
      'Mushroom Control: Placez des mushrooms stratégiques.',
      'Hidden Value: Cachez des cartes importantes.',
      'Teemo Recall: Récupérez Teemo pour reuse.'
    ],
    combos: [
      { cards: ['Swift Scout', 'Mushroom'], effect: 'Mushroom control.' }
    ],
    decks: [{ name: 'Teemo Mushroom', description: 'Hidden & mushrooms.', coreCards: ['Swift Scout', 'Mushroom'], strategy: 'Hidden mechanics.' }],
    synergies: [{ cardName: 'Guerrilla', synergy: 'Mushroom reveal.', priority: 'high' }],
    matchups: [{ against: 'Azir', outcome: 'neutral', tips: 'Équilibre.' }],
    tips: ['Les mushrooms controllent le movement.'],
    counters: ['Reveal', 'Board Clear']
  },

  'OGN-265': { // Viktor - Herald of the Arcane
    legendId: 'OGN-265',
    isMeta: false,
    overview: 'Viktor Herald of the Arcane génère des jetons Recruit et de la value.',
    ability: 'Herald of the Arcane: 1 Énergie + Exhauster: Jouez un jeton Recruit 1 Might.',
    stats: { might: 3, power: 3, energy: 4 },
    techniques: [
      'Token Generation: Spammez des jetons Recruit.',
      'Value Over Time: Accumulez de la value.',
      'Board Flooding: Inondez le board de jetons.'
    ],
    combos: [
      { cards: ['Herald of the Arcane', 'Flash of Insight'], effect: 'Token + draw.' }
    ],
    decks: [{ name: 'Viktor Tokens', description: 'Token swarm.', coreCards: ['Herald of the Arcane', 'Recruit'], strategy: 'Token spam.' }],
    synergies: [{ cardName: 'Research', synergy: 'Card draw.', priority: 'high' }],
    matchups: [{ against: 'Jax', outcome: 'unfavorable', tips: 'Counter vs tokens.' }],
    tips: ['Les jetons provides value.'],
    counters: ['Mass Removal', 'Board Wipe']
  },

  'OGN-267': { // Kayn - Bounty Hunter
    legendId: 'OGN-267',
    isMeta: false,
    overview: 'Bounty Hunter (Kayn) donne Ganking à vos unités pour des attaques cross-board.',
    ability: 'Bounty Hunter: Exhauster: Donnez Ganking à une unité ce tour (peut move entre BFs).',
    stats: { might: 3, power: 3, energy: 4 },
    techniques: [
      'Cross-BF Attacks: Utilisez Ganking pour attack sur plusieurs BFs.',
      'Positioning: Bougez vos unités entre zones.',
      'Hit & Run: Attack puis retreat.'
    ],
    combos: [
      { cards: ['Bounty Hunter', 'Steel Tempest'], effect: 'Ganking strike.' }
    ],
    decks: [{ name: 'Kayn Gank', description: 'Ganking deck.', coreCards: ['Bounty Hunter', 'Blade Rush'], strategy: 'Move & strike.' }],
    synergies: [{ cardName: 'Shunpo', synergy: 'Movement.', priority: 'high' }],
    matchups: [{ against: 'Sivir', outcome: 'neutral', tips: 'Positioning battle.' }],
    tips: ['Ganking permet des attaques surprised.'],
    counters: ['Position Lock', 'Tank']
  },

  'OGN-247': { // Kai'Sa - Daughter of the Void
    legendId: 'OGN-247',
    isMeta: true,
    overview: 'Kai\'Sa (Daughter of the Void) est un deck de spell-control/tempo-control dominates. Elle rend les removals à Power très supérieurs à leur coût apparent grâce à sa légende. Le shell de référence actuel est un Kai\'Sa Fury/Mind de contrôle par les sorts.',
    ability: 'Daughter of the Void: Exhauster: [Reaction] — Ajoutez 1 Rune Arc-en-ciel. Utilisez uniquement pour jouer des sorts. (Les capacités qui ajoutent des ressources ne peuvent pas être réagies.)',
    stats: { might: 0, power: 0, energy: 0 },
    mulligan: 'Gardez vos removals et vos petites unités fonctionnelles. Vous voulez une main qui peut répondre tôt tout en développant vers votre late game.',
    strategy: {
      early: 'Nettoyez les pièces adverses via des sorts très efficaces. Utilisez de petites unités fonctionnelles pour gratter les points nécessaires.',
      mid: 'Conservez vos runes plus longtemps que l\'adversaire. Utilisez Time Warp pour retourner les situations. Ne gaspillez pas vos meilleurs removals.',
      late: 'Refermez la partie via des swings de battlefield ou Time Warp. Votre late game est votre plus grand atout.'
    },
    decks: [
      { 
        name: 'Spell-Control Kai\'Sa', 
        description: 'Shell de référence - contrôle par les sorts.',
        coreCards: ['Kai\'Sa, Survivor', 'Falling Star', 'Void Seeker', 'Time Warp', 'Noxus Hopeful', 'Scrapheap'],
        strategy: 'Contrôlez la table sans devoir remporter un grand nombre de combats classiques.'
      },
      { 
        name: 'Void Aggro', 
        description: 'Version plus agressive avec des menaces early.',
        coreCards: ['Kai\'Sa, Survivor', 'Kai\'Sa, Evolutionary', 'Falling Star', 'Void Seeker', 'Rebuke'],
        strategy: 'Mélangez pressure et contrôle.'
      }
    ],
    synergies: [
      { cardName: 'Time Warp', synergy: 'Votre meilleur finisher - retourne les situations', priority: 'high' },
      { cardName: 'Falling Star', synergy: 'Removal pas cher et efficace', priority: 'high' },
      { cardName: 'Void Seeker', synergy: 'Card draw et late game', priority: 'high' },
      { cardName: 'Kai\'Sa, Evolutionary', synergy: 'Grosse menace late game', priority: 'medium' }
    ],
    matchups: [
      { against: 'Draven', outcome: 'unfavorable', tips: 'Draven peut développer plus vite que vous ne pouvez répondre. Cherchez les turns explosifs.' },
      { against: 'Irelia', outcome: 'unfavorable', tips: 'Irelia est votre pire matchup - elle rend vos seuils de removal mal alignés.' },
      { against: 'Annie', outcome: 'favorable', tips: 'Vous pouvez gagner la guerre de removal. Laissez Annie épuiser ses réponses.' },
      { against: 'Ezreal', outcome: 'neutral', tips: 'Matchup de contrôle vs contrôle. Votre late game est supérieur.' },
      { against: 'Viktor', outcome: 'favorable', tips: 'Vous avez plus de réponses que lui. Patience.' }
    ],
    tips: [
      'La légende rend les removals à Power très supérieurs à leur coût apparent.',
      'Il faut savoir quelles menaces tuer, lesquelles ignorer, et quand commencer à jouer vers Time Warp.',
      'Les mauvaises mains ou les keep greed sont lourdement punis.',
      'Le deck sideboarde beaucoup selon le matchup concret.'
    ],
    counters: ['Irelia', 'Draven Aggro', 'Wide Board']
  },

  'OGN-251': { // Jinx - Loose Cannon
    legendId: 'OGN-251',
    isMeta: false,
    overview: 'Jinx (Loose Cannon) est une légende Fury/Chaos qui pioche quand vous avez 1 carte ou moins en main. Elle excellait dans les formats plus anciens mais struggles en Spiritforged actuel.',
    ability: 'Loose Cannon: Au début de votre phase de début, piochez 1 si vous avez une carte ou moins en main.',
    stats: { might: 0, power: 0, energy: 0 },
    mulligan: 'Cherchez vos menaces early et vos cartes de pioche. Vous voulez aller low en main pour trigger votre capacité.',
    strategy: {
      early: 'Jouez vos cartes pour vider votre main et trigger la pioche. Développez vos menaces.',
      mid: 'Utilisez votre avantage de cartes pour dominer les échanges. Gardez votre main basse pour trigger la capacité.',
      late: 'Finish avec vos grosses menaces. Votre capacité de pioche vous donne un avantage en late game.'
    },
    decks: [
      { 
        name: 'Jinx Aggro', 
        description: 'Version agressive avec cartes low-cost.',
        coreCards: ['Jinx, Rebel', 'Jinx, Demolitionist', 'Spinning Axe', 'Pouty Poro'],
        strategy: 'Videz votre main et tapez.'
      },
      { 
        name: 'Jinx Midrange', 
        description: 'Version balance avec plus de late game.',
        coreCards: ['Jinx, Rebel', 'Jinx, Demolitionist', 'Get Excited!', 'Super Mega Death Rocket!'],
        strategy: 'Mélangez early pressure et late game.'
      }
    ],
    synergies: [
      { cardName: 'Get Excited!', synergy: 'Card draw et damage', priority: 'high' },
      { cardName: 'Super Mega Death Rocket!', synergy: 'Finisher signature', priority: 'high' },
      { cardName: 'Spinning Axe', synergy: 'Pioche et buff', priority: 'medium' }
    ],
    matchups: [
      { against: 'Draven', outcome: 'unfavorable', tips: 'Trop rapide pour vous.' },
      { against: 'Kai\'Sa', outcome: 'unfavorable', tips: 'Elle contrôle mieux que vous.' },
      { against: 'Annie', outcome: 'unfavorable', tips: 'Elle vous beat en tempo.' }
    ],
    tips: [
      'Gardez votre main basse pour trigger la capacité.',
      'Utilisez les cartes qui piochent en même temps qu\'elles font autre chose.',
      'Le deck struggles en méta actuelle.'
    ],
    counters: ['Tier 1 decks', 'Control']
  },

  'OGN-253': { // Darius - Hand of Noxus
    legendId: 'OGN-253',
    isMeta: false,
    overview: 'Darius (Hand of Noxus) est une légende Fury qui génère de l\'énergie en expirant des unités alliées. Il excellait dans les formats anciens avec le package Whirling Death.',
    ability: 'Hand of Noxus: Exhauster: [Reaction], [Légion] — Ajoutez 1 Énergie. (Obtenez l\'effet si vous avez joué une carte ce tour.)',
    stats: { might: 0, power: 0, energy: 0 },
    mulligan: 'Gardez vos unités early et vos cartes qui génèrent de la valeur en expirant.',
    strategy: {
      early: 'Développez vos unités et générez de l\'énergie en les sacrifiant.',
      mid: 'Utilisez l\'avantage d\'énergie pour jouer plus de sorts et d\'unités que l\'adversaire.',
      late: 'Finish avec des grosses unités ou des combos d\'énergie.'
    },
    decks: [
      { 
        name: 'Darius Burn', 
        description: 'Version burn avec sacrifices.',
        coreCards: ['Darius, Trifarian', 'Culling Strike', 'Decimate', 'Whirling Death'],
        strategy: 'Sacrifiez vos unités pour de la value.'
      },
      { 
        name: 'Darius Midrange', 
        description: 'Version balance.',
        coreCards: ['Darius, Trifarian', 'Whirling Death', 'Culling Strike', 'Noxus Hopeful'],
        strategy: 'Équilibre entre sacrifice et développement.'
      }
    ],
    synergies: [
      { cardName: 'Whirling Death', synergy: 'Sacréfice et damage', priority: 'high' },
      { cardName: 'Culling Strike', synergy: 'Removal + énergie', priority: 'high' },
      { cardName: 'Decimate', synergy: 'Damage de masse', priority: 'medium' }
    ],
    matchups: [
      { against: 'Draven', outcome: 'unfavorable', tips: 'Trop agressif.' },
      { against: 'Kai\'Sa', outcome: 'neutral', tips: 'Dépend de votre build.' }
    ],
    tips: [
      'Optimisez le sacrifice de vos unités.',
      'Légion se trigger en jouant une carte ce tour.',
      'Le deck est moins fort en Spiritforged.'
    ],
    counters: ['Control', 'Tier 1 decks']
  },

  'OGS-23': { // Garen - Might of Demacia
    legendId: 'OGS-23',
    isMeta: false,
    overview: 'Garen (Might of Demacia) est une légende Body/Order qui buff ses unités en fonction de leur position de defendeur. Il offre une défense solide et des buffs de taille.',
    ability: 'Might of Demacia: Vos unités defenders gagnent +2 Might par unité alliée qui défend.',
    stats: { might: 0, power: 0, energy: 0 },
    mulligan: 'Gardez vos defenders et vos cartes de buff. Vous voulez établir une défense solide tôt.',
    strategy: {
      early: 'Placez des defenders et buildtez vos buffs. Chaque defender ajoute du might aux autres.',
      mid: 'Stackez les buffs sur vos defenders. Un defender bien buffé peut gagner des combats seul.',
      late: 'Votre défense doit être impénétrable. Contre-attaquez avec vos unités buffées.'
    },
    decks: [
      { 
        name: 'Garen Defense', 
        description: 'Version contrôle défense.',
        coreCards: ['Garen, Commander', 'Garen, Rugged', 'Radiant Reflction', 'Unbreakable Will'],
        strategy: 'Défendez et counter-attack.'
      },
      { 
        name: 'Garen Aggro', 
        description: 'Version plus offensive.',
        coreCards: ['Garen, Commander', 'Garen, Rugged', 'Strike', 'Veteran\'s Decree'],
        strategy: 'Combinez défense et aggression.'
      }
    ],
    synergies: [
      { cardName: 'Radiant Reflection', synergy: 'Buff massif', priority: 'high' },
      { cardName: 'Unbreakable Will', synergy: 'Protection extreme', priority: 'high' }
    ],
    matchups: [
      { against: 'Draven', outcome: 'neutral', tips: 'Votre défense peut tenir.' },
      { against: 'Irelia', outcome: 'unfavorable', tips: 'Elle est trop rapide.' }
    ],
    tips: [
      'Stackez vos defenders ensemble pour des buffs maximaux.',
      'Un seul defender peut devenir très dangereux.',
      'Contre-attaquez quand vous avez l\'avantage.'
    ],
    counters: ['Wide Board', 'Overwhelm']
  },

  'OGS-21': { // Lux - Lady of Luminosity
    legendId: 'OGS-21',
    isMeta: false,
    overview: 'Lux (Lady of Luminosity) est une légende Mind/Order qui génère des Mana Bolts et buff ses unités. Elle offre un bon mélange de contrôle et de late game.',
    ability: 'Lady of Luminosity: Quand vous gagnez un combat, créez un Mana Bolt (inflige 1 dégât).',
    stats: { might: 0, power: 0, energy: 0 },
    mulligan: 'Gardez vos removals et vos cartes de value. Cherchez Lux et vos sorts clés.',
    strategy: {
      early: 'Développez et supprimez les menaces adverses avec vos sorts.',
      mid: 'Accumulez des Mana Bolts et construisez votre board.',
      late: 'Utilisez votre avantage de value et vos finisher pour fermer la partie.'
    },
    decks: [
      { 
        name: 'Lux Control', 
        description: 'Version contrôle.',
        coreCards: ['Lux, Crownguard', 'Lux, Illuminated', 'Prismatic Barrier', 'Final Spark'],
        strategy: 'Contrôlez et buildtez vers le late game.'
      },
      { 
        name: 'Lux Aggro', 
        description: 'Version agressive.',
        coreCards: ['Lux, Crownguard', 'Lux, Illuminated', 'Light Binding', 'Illumination'],
        strategy: 'Pression constante.'
      }
    ],
    synergies: [
      { cardName: 'Final Spark', synergy: 'Finisher massif', priority: 'high' },
      { cardName: 'Prismatic Barrier', synergy: 'Protection', priority: 'high' }
    ],
    matchups: [
      { against: 'Draven', outcome: 'unfavorable', tips: 'Trop rapide.' },
      { against: 'Kai\'Sa', outcome: 'neutral', tips: 'Dépend du build.' }
    ],
    tips: [
      'Les Mana Bolts font beaucoup de damage cumulés.',
      'Lux est un bon deck de valeur.',
      'Final Spark est un finisher excellent.'
    ],
    counters: ['Aggro', 'Fast decks']
  },

  'OGS-19': { // Master Yi - Wuju Bladesman
    legendId: 'OGS-19',
    isMeta: false,
    overview: 'Master Yi (Wuju Bladesman) est une légende Calm/Body axée sur les buffs et les attaques rapides. Il stacke les buffs sur une unité pour des damage explosifs.',
    ability: 'Wuju Bladesman: Tant qu\'une unité alliée attaque seule, elle gagne +2 Might.',
    stats: { might: 0, power: 0, energy: 0 },
    mulligan: 'Gardez vos cartes de buff et votre win condition. Vous voulez buildter vers votre gros buff.',
    strategy: {
      early: 'Préparez votre unité clave en la buffant progressivement.',
      mid: 'Accumulez les buffs sur une seule unité - votre win condition.',
      late: 'Finissez avec votre unité surbuffée.'
    },
    decks: [
      { 
        name: 'Yi Buff', 
        description: 'Version buffs massifs.',
        coreCards: ['Yi, Meditative', 'Yi, Honed', 'Wuju Style', 'Inner Dragon'],
        strategy: 'Stackez les buffs.'
      },
      { 
        name: 'Yi Strike', 
        description: 'Version plus agressive.',
        coreCards: ['Yi, Meditative', 'Yi, Honed', 'Strike', 'Double Strike'],
        strategy: 'Attaquez rapidement.'
      }
    ],
    synergies: [
      { cardName: 'Wuju Style', synergy: 'Buff massif', priority: 'high' },
      { cardName: 'Inner Dragon', synergy: 'Stack de buffs', priority: 'high' }
    ],
    matchups: [
      { against: 'Draven', outcome: 'unfavorable', tips: 'Trop rapide pour vous.' },
      { against: 'Control', outcome: 'favorable', tips: 'Vous avez le time de builder.' }
    ],
    tips: [
      'Une unité bien buffée peut finir le jeu seule.',
      'Protégez votre unité de win.',
      'Yi fonctionne mieux en contrôlant le rythme.'
    ],
    counters: ['Removal', 'Board Clear']
  },

  'OGN-249': { // Volibear - Relentless Storm
    legendId: 'OGN-249',
    isMeta: false,
    overview: 'Volibear (Relentless Storm) est une légende Fury/Body avec des mécaniques de stun et de damage accru. Il excelle dans les stratégies agressives.',
    ability: 'Relentless Storm: Vos attaques et défenses stunnent les défenseurs (ils ne peuvent pas attaquer ce tour).',
    stats: { might: 0, power: 0, energy: 0 },
    mulligan: 'Gardez vos threats early et vos stun effects.',
    strategy: {
      early: 'Jouez vos unités et stunnez les défenseurs adverses.',
      mid: 'Accumulez les stun effects pour contrôler le board.',
      late: 'Finish avec vos grosses unités et vos stun persistants.'
    },
    decks: [
      { 
        name: 'Volibear Aggro', 
        description: 'Version agressive.',
        coreCards: ['Volibear, Furious', 'Volibear, Imposing', 'Thunderclap', 'Stormbringer'],
        strategy: 'Stun et damage.'
      },
      { 
        name: 'Volibear Control', 
        description: 'Version contrôle.',
        coreCards: ['Volibear, Furious', 'Volibear, Imposing', 'Flash', 'Frostbite'],
        strategy: 'Contrôlez via stun.'
      }
    ],
    synergies: [
      { cardName: 'Thunderclap', synergy: 'Stun et damage', priority: 'high' },
      { cardName: 'Stormbringer', synergy: 'Damage augmenté', priority: 'medium' }
    ],
    matchups: [
      { against: 'Control', outcome: 'favorable', tips: 'Vous stunnez leurs defenses.' },
      { against: 'Aggro', outcome: 'neutral', tips: 'Dépend du rythme.' }
    ],
    tips: [
      'Le stun sur défense est très puissant.',
      'Volibear fonctionne bien en agresif.',
      'Buildtez votre board pour maximiser les stun.'
    ],
    counters: ['Stun Immunity', 'Big defenders']
  },

  'SFD-209': { // Ornn - Fire Below the Mountain
    legendId: 'SFD-209',
    isMeta: false,
    overview: 'Ornn (Fire Below the Mountain) est une légende Calm/Mind qui excelle dans le contrôle et le late game. Il offre des outils de stabilisation et de value.',
    ability: 'Fire Below the Mountain: Vos sorts coûtent 1 de moins (minimum 1).',
    stats: { might: 0, power: 0, energy: 0 },
    mulligan: 'Gardez vos sorts clés et vos cartes de value. Vous voulez établir un contrôle précoce.',
    strategy: {
      early: 'Contrôlez le board avec vos sorts à bas coût.',
      mid: 'Accumulez de la value et stabilisez.',
      late: 'Votre discount sur les sorts vous donne un avantage massife en late game.'
    },
    decks: [
      { 
        name: 'Ornn Control', 
        description: 'Version contrôle.',
        coreCards: ['Ornn, Forge God', 'Ornn, Blacksmith', 'Brittle', 'Make it Rain'],
        strategy: 'Contrôlez tout le game.'
      },
      { 
        name: 'Ornn Value', 
        description: 'Version value.',
        coreCards: ['Ornn, Forge God', 'Ornn, Blacksmith', 'Living Forge', 'Molten Breath'],
        strategy: 'Value et late game.'
      }
    ],
    synergies: [
      { cardName: 'Brittle', synergy: 'Stun et control', priority: 'high' },
      { cardName: 'Living Forge', synergy: 'Card generation', priority: 'medium' }
    ],
    matchups: [
      { against: 'Aggro', outcome: 'favorable', tips: 'Vous contrôlez facilement.' },
      { against: 'Control', outcome: 'neutral', tips: 'Late game battle.' }
    ],
    tips: [
      'Le discount sur sorts est très puissant.',
      'Ornn est excellent en late game.',
      'Accumulez la value.'
    ],
    counters: ['Aggro', 'Fast decks']
  }
};

export function getLegendGuide(legendId: string): LegendGuide | null {
  const id = legendId.toUpperCase();
  // Check exact ID or OGN equivalent if applicable
  const found = LEGEND_GUIDES[id];
  if (found) return found;
  
  // Fallback for different sets of same legend if necessary
  return null;
}

export function getAllLegendGuides(): LegendGuide[] {
  return Object.values(LEGEND_GUIDES);
}

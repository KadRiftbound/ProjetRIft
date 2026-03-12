'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { DeckCard, Deck, calculateDeckStats, exportDeckToText, MAX_CARDS_IN_DECK, MAX_SAME_CARD, MIN_DECK_SIZE } from '../types';
import { getLocalDecks, saveLocalDeck } from '../../lib/local-storage';
import { encodeDeckForShare, decodeDeckFromShare, parseDeckListText } from '../../lib/deck-share';
import { LEGEND_TO_CHAMPION_NAME, CHAMPION_TO_UNIT_IDS } from '../../lib/legend-index';
import { analyzeDeck } from '../../lib/theorycraft';
import { PageHeader } from '../../components/ui/PageHeader';
import { CardPanel } from '../../components/ui/CardPanel';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardRail } from '../../components/ui/CardRail';
import { domainBadgeClasses } from '../../lib/cards';

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

// Domain styles are centralized in lib/cards (domainBadgeClasses)


function CardListItem({ card, onRemove }: { card: DeckCard; onRemove: () => void }) {
  return (
    <div
      className="group flex items-center justify-between p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 cursor-pointer active:scale-[0.99]"
      onClick={onRemove}
      title="Cliquer pour retirer 1 exemplaire"
    >
      <div className="flex items-center gap-3">
        {card.imageUrl ? (
          <div className="w-8 h-10 rounded-lg overflow-hidden bg-black/40 shrink-0">
            <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-8 h-10 rounded-lg bg-black/40 shrink-0 flex items-center justify-center">
            <span className="text-[8px] opacity-30">🃏</span>
          </div>
        )}
        <div className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center text-[10px] font-black text-rift-blue border border-white/10 shrink-0">
          {card.count}
        </div>
        <span className="text-xs font-bold text-gray-300 truncate max-w-[100px] uppercase tracking-tight">{card.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <Badge className={`px-2 py-0.5 bg-black/40 border-white/5 ${domainBadgeClasses(card.domain)}`}>
          {card.domain.slice(0, 3)}
        </Badge>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-6 h-6 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-xs hover:bg-red-500/20 transition-colors"
          >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function DeckBuilderClient({
  allCards,
  initialDeckId,
  initialDeckCode,
}: {
  allCards: any[];
  initialDeckId?: string;
  initialDeckCode?: string;
}) {
  type Toast = { id: number; text: string; variant?: 'info'|'success'|'error' };
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (text: string, variant: Toast['variant'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, text, variant }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2000);
  };
  const [deckName, setDeckName] = useState('Nouveau Deck');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [minEnergy, setMinEnergy] = useState('');
  const [maxEnergy, setMaxEnergy] = useState('');
  const [exactEnergy, setExactEnergy] = useState('');
  const [minMight, setMinMight] = useState('');
  const [maxMight, setMaxMight] = useState('');
  const [minPower, setMinPower] = useState('');
  const [maxPower, setMaxPower] = useState('');
  const [rulesQuery, setRulesQuery] = useState('');
  const [selectedSet, setSelectedSet] = useState('All');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [keywordMode, setKeywordMode] = useState<'AND' | 'OR'>('AND');
  const [includeTypes, setIncludeTypes] = useState<string[]>([]);
  const [excludeTypes, setExcludeTypes] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);
  const [localDecks, setLocalDecks] = useState<Deck[]>([]);
  const [selectedSavedDeck, setSelectedSavedDeck] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [step, setStep] = useState<'legend' | 'champion' | 'build' | 'battlefield'>('legend');
  const [selectedLegend, setSelectedLegend] = useState<any | null>(null);
  const [chosenChampion, setChosenChampion] = useState<DeckCard | null>(null);
  const [selectedBattlefields, setSelectedBattlefields] = useState<DeckCard[]>([]);

  const legends = useMemo(() => {
    // Deduplicate by ID — showcases share the same ID as the regular variant
    const seen = new Set<string>();
    return allCards.filter(c => {
      if (c.type !== 'Legend') return false;
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [allCards]);

  const availableBattlefields = useMemo(() => {
    return allCards.filter(c => c.type === 'Battlefield' && c.domain === 'Colorless');
  }, [allCards]);

  const availableChampions = useMemo(() => {
    if (!selectedLegend) return [];
    const championName = LEGEND_TO_CHAMPION_NAME[selectedLegend.id];
    if (!championName) return [];
    // Get the confirmed unit IDs for this champion from legend-index
    const unitIds = CHAMPION_TO_UNIT_IDS[championName] || [];
    if (unitIds.length > 0) {
      // Return units matching the confirmed IDs (deduplicated by id)
      const seen = new Set<string>();
      return allCards.filter(c => {
        if (c.type !== 'Unit') return false;
        if (!unitIds.includes(c.id)) return false;
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
    }
    // Fallback: match by champion name prefix (e.g. "Draven" matches "Draven, Vanquisher")
    return allCards.filter(c =>
      c.type === 'Unit' && c.name.startsWith(championName)
    );
  }, [selectedLegend, allCards]);

  const handleLegendSelect = (legend: any) => {
    setSelectedLegend(legend);
    
    const legendCard: DeckCard = {
      id: legend.id,
      name: legend.name,
      type: 'Legend',
      domain: legend.domain,
      rarity: legend.rarity,
      energy: 0,
      might: 0,
      power: 0,
      rules: legend.rules || '',
      count: 1,
      imageUrl: legend.variants?.[0]?.imageUrl,
    };
    
    const championName = LEGEND_TO_CHAMPION_NAME[legend.id];
    if (championName) {
      const unitIds = CHAMPION_TO_UNIT_IDS[championName] || [];
      // Deduplicate by ID
      const seen = new Set<string>();
      const champions = allCards.filter(c => {
        if (c.type !== 'Unit') return false;
        if (!unitIds.includes(c.id)) return false;
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
      // If only one champion unit exists, skip the selection step
      if (champions.length === 1) {
        const champion = champions[0];
        const champCard: DeckCard = {
          id: champion.id,
          name: champion.name,
          type: 'Champion',
          domain: champion.domain,
          rarity: champion.rarity,
          energy: champion.energy || 0,
          might: champion.might || 0,
          power: champion.power || 0,
          rules: champion.rules || '',
          count: 1,
          imageUrl: champion.variants?.[0]?.imageUrl,
        };
        setChosenChampion(champCard);
        setDeckCards(prev => [...prev.filter(c => c.type !== 'Legend' && c.type !== 'Champion'), legendCard, champCard]);
        setStep('battlefield');
        return;
      }
    }
    // Multiple champions or none found → go to champion selection step
    setDeckCards(prev => [...prev.filter(c => c.type !== 'Legend'), legendCard]);
    setStep('champion');
  };

  const handleChampionSelect = (champion: any) => {
    const champCard: DeckCard = {
      id: champion.id,
      name: champion.name,
      type: 'Champion',
      domain: champion.domain,
      rarity: champion.rarity,
      energy: champion.energy || 0,
      might: champion.might || 0,
      power: champion.power || 0,
      rules: champion.rules || '',
      count: 1,
      imageUrl: champion.variants?.[0]?.imageUrl,
    };
    setChosenChampion(champCard);
    
    const legendCard: DeckCard = {
      id: selectedLegend.id,
      name: selectedLegend.name,
      type: 'Legend',
      domain: selectedLegend.domain,
      rarity: selectedLegend.rarity,
      energy: 0,
      might: 0,
      power: 0,
      rules: selectedLegend.rules || '',
      count: 1,
      imageUrl: selectedLegend.variants?.[0]?.imageUrl,
    };
    
    setDeckCards(prev => {
      const filtered = prev.filter(c => c.type !== 'Legend' && c.type !== 'Champion');
      return [...filtered, legendCard, champCard];
    });
    
    setStep('battlefield');
  };

  useEffect(() => {
    setLocalDecks(getLocalDecks());
  }, []);

  useEffect(() => {
    if (initialDeckId) {
      const decks = getLocalDecks();
      const deck = decks.find(d => d.id === initialDeckId);
      if (deck) {
        const champ = deck.chosenChampion || deck.cards.find(c => c.type === 'Champion') || null;
        setDeckName(deck.name);
        setSelectedDomain(deck.domain);
        setDeckCards(deck.cards);
        setSelectedBattlefields(deck.battlefields || []);
        setChosenChampion(champ ? { ...champ, count: 1 } : null);
        setCurrentDeckId(deck.id);
        
        const legendCard = deck.cards.find(c => c.type === 'Legend');
        if (legendCard) {
          const legend = allCards.find(c => c.id === legendCard.id);
          setSelectedLegend(legend || null);
        }
        setStep('build');
      }
    }
  }, [initialDeckId, allCards]);

  useEffect(() => {
    if (!initialDeckCode) return;
    try {
      const decoded = decodeDeckFromShare(initialDeckCode);
      const nextCards: DeckCard[] = decoded.cards
        .map(entry => {
          const card = allCards.find(c => c.id === entry.id);
          if (!card) return null;
          return {
            id: card.id,
            name: card.name,
            type: card.type,
            domain: card.domain,
            rarity: card.rarity,
            energy: card.energy || 0,
            might: card.might || 0,
            power: card.power || 0,
            rules: card.rules || '',
            count: entry.count,
            imageUrl: card.images?.[0]?.medium,
          } as DeckCard;
        })
        .filter(Boolean) as DeckCard[];

      if (decoded.chosenChampionId) {
        const champCard = allCards.find(c => c.id === decoded.chosenChampionId);
        if (champCard) {
          setChosenChampion({
            id: champCard.id,
            name: champCard.name,
            type: champCard.type,
            domain: champCard.domain,
            rarity: champCard.rarity,
            energy: champCard.energy || 0,
            might: champCard.might || 0,
            power: champCard.power || 0,
            rules: champCard.rules || '',
            count: 1,
            imageUrl: champCard.images?.[0]?.medium,
          });
        }
      }

      if (nextCards.length > 0) {
        setDeckName(decoded.name || 'Deck Partage');
        setSelectedDomain(decoded.domain || 'All');
        setDeckCards(nextCards);
        
        if (decoded.battlefields) {
          const nextBattlefields: DeckCard[] = decoded.battlefields
            .map(entry => {
              const card = allCards.find(c => c.id === entry.id);
              if (!card) return null;
              return {
                id: card.id,
                name: card.name,
                type: 'Battlefield',
                domain: card.domain,
                rarity: card.rarity,
                energy: card.energy || 0,
                might: card.might || 0,
                power: card.power || 0,
                rules: card.rules || '',
                count: entry.count,
                imageUrl: card.images?.[0]?.medium,
              } as DeckCard;
            })
            .filter(Boolean) as DeckCard[];
          setSelectedBattlefields(nextBattlefields);
        }
        
        const champFromCards = nextCards.find(c => c.type === 'Champion') || null;
        if (!chosenChampion && champFromCards) {
          setChosenChampion({ ...champFromCards, count: 1 });
        }
        setCurrentDeckId(null);
        setStep('build');
      }
    } catch (err) {
      setImportError('Lien de deck invalide ou corrompu.');
    }
  }, [initialDeckCode, allCards]);

  const saveDeck = () => {
    const deck: Deck = {
      id: currentDeckId || Date.now().toString(),
      name: deckName,
      domain: selectedDomain === 'All' ? 'Mixed' : selectedDomain,
      cards: deckCards,
      battlefields: selectedBattlefields,
      chosenChampion,
      createdAt: currentDeckId ? new Date() : new Date(),
      updatedAt: new Date(),
    };
    
    saveLocalDeck(deck);
    setCurrentDeckId(deck.id);
    setLocalDecks(getLocalDecks());
    showToast('Deck sauvegardé', 'success');
  };

  const newDeck = () => {
    if (deckCards.length > 0 && !confirm('Voulez-vous vraiment effacer le deck actuel ?')) return;
    setDeckName('Nouveau Deck');
    setSelectedDomain('All');
    setDeckCards([]);
    setSelectedBattlefields([]);
    setCurrentDeckId(null);
    setShareUrl('');
    setChosenChampion(null);
    setStep('legend');
    setSelectedLegend(null);
  };

  const loadSavedDeck = (deckId: string) => {
    const decks = getLocalDecks();
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;
    const champ = deck.chosenChampion || deck.cards.find(c => c.type === 'Champion') || null;
    setDeckName(deck.name);
    setSelectedDomain(deck.domain);
    setDeckCards(deck.cards);
    setSelectedBattlefields(deck.battlefields || []);
    setChosenChampion(champ ? { ...champ, count: 1 } : null);
    setCurrentDeckId(deck.id);
    setShareUrl('');
    
    const legendCard = deck.cards.find(c => c.type === 'Legend');
    if (legendCard) {
      const legend = allCards.find(c => c.id === legendCard.id);
      setSelectedLegend(legend || null);
    }
    setStep('build');
  };

  const domains = useMemo(() => {
    const domainSet = new Set(allCards.map(c => c.domain).filter(Boolean));
    return ['All', ...Array.from(domainSet).sort()];
  }, [allCards]);

  const types = useMemo(() => {
    const typeSet = new Set(allCards.map(c => c.type).filter(Boolean));
    return ['All', ...Array.from(typeSet).sort()];
  }, [allCards]);

  const rarities = useMemo(() => {
    const raritySet = new Set(allCards.map(c => c.rarity).filter(Boolean));
    return ['All', ...Array.from(raritySet).sort()];
  }, [allCards]);

  const sets = useMemo(() => {
    const setSet = new Set(allCards.map(c => c.expansion?.id).filter(Boolean));
    return ['All', ...Array.from(setSet).sort()];
  }, [allCards]);

  const keywordOptions = useMemo(() => ([
    'Overwhelm',
    'Deflect',
    'Shield',
    'Tank',
    'Ganking',
    'Assault',
    'Accelerate',
    'Legion',
    'Hidden',
    'Stun',
    'Weaponmaster',
    'Mighty',
    'Showdown',
  ]), []);

  const filteredCards = useMemo(() => {
    const minE = minEnergy === '' ? null : Number(minEnergy);
    const maxE = maxEnergy === '' ? null : Number(maxEnergy);
    const exactE = exactEnergy === '' ? null : Number(exactEnergy);
    const minM = minMight === '' ? null : Number(minMight);
    const maxM = maxMight === '' ? null : Number(maxMight);
    const minP = minPower === '' ? null : Number(minPower);
    const maxP = maxPower === '' ? null : Number(maxPower);
    const rulesQ = rulesQuery.trim().toLowerCase();

    const result = allCards.filter(card => {
      const matchesSearch = searchQuery === '' ||
        card.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDomain = selectedDomain === 'All' || card.domain === selectedDomain;
      const matchesType = selectedType === 'All' || card.type === selectedType;
      const matchesRarity = selectedRarity === 'All' || card.rarity === selectedRarity;
      const matchesExact = exactE === null || (card.energy || 0) === exactE;
      const matchesMin = exactE !== null ? true : minE === null || (card.energy || 0) >= minE;
      const matchesMax = exactE !== null ? true : maxE === null || (card.energy || 0) <= maxE;
      const matchesMightMin = minM === null || (card.might || 0) >= minM;
      const matchesMightMax = maxM === null || (card.might || 0) <= maxM;
      const matchesPowerMin = minP === null || (card.power || 0) >= minP;
      const matchesPowerMax = maxP === null || (card.power || 0) <= maxP;
      const matchesRules = rulesQ === '' || (card.rules || '').toLowerCase().includes(rulesQ);
      const matchesSet = selectedSet === 'All' || card.expansion?.id === selectedSet;
      const matchesKeywords = selectedKeywords.length === 0
        || (keywordMode === 'AND'
          ? selectedKeywords.every(k => (card.rules || '').toLowerCase().includes(k.toLowerCase()))
          : selectedKeywords.some(k => (card.rules || '').toLowerCase().includes(k.toLowerCase())));
      const matchesInclude = includeTypes.length === 0 || includeTypes.includes(card.type);
      const matchesExclude = excludeTypes.length === 0 || !excludeTypes.includes(card.type);
      return matchesSearch && matchesDomain && matchesType && matchesRarity && matchesExact && matchesMin && matchesMax && matchesMightMin && matchesMightMax && matchesPowerMin && matchesPowerMax && matchesRules && matchesSet && matchesKeywords && matchesInclude && matchesExclude;
    });

    if (sortBy === 'energy') {
      return result.sort((a, b) => (a.energy || 0) - (b.energy || 0));
    }
    if (sortBy === 'name') {
      return result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [allCards, searchQuery, selectedDomain, selectedType, selectedRarity, minEnergy, maxEnergy, exactEnergy, minMight, maxMight, minPower, maxPower, rulesQuery, selectedSet, selectedKeywords, keywordMode, includeTypes, excludeTypes, sortBy]);

  const stats = useMemo(() => calculateDeckStats(deckCards, selectedBattlefields), [deckCards, selectedBattlefields]);
  const legendCount = useMemo(() => deckCards.filter(c => c.type === 'Legend').reduce((s, c) => s + c.count, 0), [deckCards]);
  const championCount = useMemo(() => deckCards.filter(c => c.type === 'Champion').reduce((s, c) => s + c.count, 0), [deckCards]);
  const mainCount = useMemo(() => deckCards.filter(c => c.type === 'Unit' || c.type === 'Spell' || c.type === 'Gear').reduce((s, c) => s + c.count, 0), [deckCards]);
  const battlefieldCount = useMemo(() => selectedBattlefields.reduce((s, c) => s + c.count, 0), [selectedBattlefields]);
  const requiredLegend = 1;
  const requiredChampion = 1;
  const requiredMain = 39;
  const requiredBattlefields = 3;
  const requiredTotal = requiredLegend + requiredChampion + requiredMain;
  const legendCard = useMemo(() => deckCards.find(c => c.type === 'Legend'), [deckCards]);
  const chosenChampionCard = useMemo(() => chosenChampion || deckCards.find(c => c.type === 'Champion') || null, [chosenChampion, deckCards]);
  const expectedChampionName = legendCard ? LEGEND_TO_CHAMPION_NAME[legendCard.id] : undefined;
  const normalized = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const championNameMatches = !expectedChampionName || !chosenChampionCard
    ? true
    : normalized(chosenChampionCard.name).includes(normalized(expectedChampionName));
  const deckIsValid = legendCount === requiredLegend && championCount === requiredChampion && mainCount === requiredMain && stats.totalCards === requiredTotal && championNameMatches && battlefieldCount === requiredBattlefields;

  const theorycraft = useMemo(() => analyzeDeck({
    deckCards,
    legendId: legendCard?.id,
    chosenChampionName: chosenChampionCard?.name,
  }), [deckCards, legendCard?.id, chosenChampionCard?.name]);

  const scoreColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-rift-red';
  };

  const canChooseChampion = (card: any) => {
    if (card.type !== 'Champion') return true;
    if (!legendCard || !expectedChampionName) return false;
    return normalized(card.name).includes(normalized(expectedChampionName));
  };

  const addToDeck = (card: any) => {
    if (card.type !== 'Champion' && stats.totalCards >= requiredTotal) return;

    const existingCard = deckCards.find(c => c.id === card.id);
    if (existingCard && existingCard.count >= MAX_SAME_CARD) return;

    if (card.type === 'Legend') {
      const withoutLegend = deckCards.filter(c => c.type !== 'Legend');
      setDeckCards([...withoutLegend, {
        id: card.id,
        name: card.name,
        type: card.type,
        domain: card.domain,
        rarity: card.rarity,
        energy: card.energy || 0,
        might: card.might || 0,
        power: card.power || 0,
        rules: card.rules || '',
        count: 1,
        imageUrl: card.images?.[0]?.medium,
      }]);
      showToast(`Légende: ${card.name}`, 'success');
      return;
    }

    if (card.type === 'Champion') {
      if (!canChooseChampion(card)) return;
      const withoutChampion = deckCards.filter(c => c.type !== 'Champion');
      const nextChampion: DeckCard = {
        id: card.id,
        name: card.name,
        type: card.type,
        domain: card.domain,
        rarity: card.rarity,
        energy: card.energy || 0,
        might: card.might || 0,
        power: card.power || 0,
        rules: card.rules || '',
        count: 1,
        imageUrl: card.images?.[0]?.medium,
      };
      setChosenChampion(nextChampion);
      setDeckCards([...withoutChampion, nextChampion]);
      showToast(`Champion: ${card.name}`, 'success');
      return;
    }

    if (existingCard) {
      setDeckCards(deckCards.map(c => 
        c.id === card.id ? { ...c, count: c.count + 1 } : c
      ));
      showToast(`+ ${card.name}`, 'success');
    } else {
      setDeckCards([...deckCards, {
        id: card.id,
        name: card.name,
        type: card.type,
        domain: card.domain,
        rarity: card.rarity,
        energy: card.energy || 0,
        might: card.might || 0,
        power: card.power || 0,
        rules: card.rules || '',
        count: 1,
        imageUrl: card.images?.[0]?.medium,
      }]);
      showToast(`+ ${card.name}`, 'success');
    }
  };

  const removeFromDeck = (cardId: string) => {
    const card = deckCards.find(c => c.id === cardId);
    if (!card) return;

    if (card.count > 1) {
      setDeckCards(deckCards.map(c => 
        c.id === cardId ? { ...c, count: c.count - 1 } : c
      ));
    } else {
      setDeckCards(deckCards.filter(c => c.id !== cardId));
    }

    if (card.type === 'Champion') {
      setChosenChampion(null);
    }
    showToast(`- ${card.name}`, 'info');
  };

  const addBattlefield = (card: any) => {
    if (selectedBattlefields.length >= 3) return;
    const existing = selectedBattlefields.find(b => b.id === card.id);
    if (existing) {
      setSelectedBattlefields(selectedBattlefields.map(b => 
        b.id === card.id ? { ...b, count: b.count + 1 } : b
      ));
    } else {
      setSelectedBattlefields([...selectedBattlefields, {
        id: card.id,
        name: card.name,
        type: 'Battlefield',
        domain: card.domain,
        rarity: card.rarity,
        energy: card.energy || 0,
        might: card.might || 0,
        power: card.power || 0,
        rules: card.rules || '',
        count: 1,
        imageUrl: card.images?.[0]?.medium,
      }]);
    }
    showToast(`+ Battlefield: ${card.name}`, 'success');
  };

  const removeBattlefield = (cardId: string) => {
    const card = selectedBattlefields.find(b => b.id === cardId);
    if (!card) return;
    if (card.count > 1) {
      setSelectedBattlefields(selectedBattlefields.map(b => 
        b.id === cardId ? { ...b, count: b.count - 1 } : b
      ));
    } else {
      setSelectedBattlefields(selectedBattlefields.filter(b => b.id !== cardId));
    }
    showToast(`- Battlefield`, 'info');
  };

  const exportDeck = () => {
    const deck: Deck = {
      id: currentDeckId || 'temp',
      name: deckName,
      domain: selectedDomain,
      cards: deckCards,
      battlefields: selectedBattlefields,
      chosenChampion,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const text = exportDeckToText(deck);
    navigator.clipboard.writeText(text);
    alert('Decklist copiée !');
  };

  const importDeck = () => {
    setImportError('');
    try {
      const parsed = parseDeckListText(importText);
      if (!parsed.cards.length) {
        setImportError('Aucune carte detectee. Utilisez le format "2x Nom".');
        return;
      }

      const nextCards: DeckCard[] = parsed.cards.map(entry => {
        const card = allCards.find(c => c.name.toLowerCase() === entry.name.toLowerCase());
        if (!card) return null;
        return {
          id: card.id,
          name: card.name,
          type: card.type,
          domain: card.domain,
          rarity: card.rarity,
          energy: card.energy || 0,
          might: card.might || 0,
          power: card.power || 0,
          rules: card.rules || '',
          count: entry.count,
          imageUrl: card.images?.[0]?.medium,
        } as DeckCard;
      }).filter(Boolean) as DeckCard[];

      const champFromList = nextCards.find(c => c.type === 'Champion');
      if (champFromList) {
        setChosenChampion({ ...champFromList, count: 1 });
      }

      if (!nextCards.length) {
        setImportError('Impossible de trouver les cartes. Verifiez les noms.');
        return;
      }

      setDeckName(parsed.deckName || 'Deck importe');
      setSelectedDomain(parsed.deckDomain || 'All');
      setDeckCards(nextCards);
      setSelectedBattlefields([]);
      setCurrentDeckId(null);
      setShowImport(false);
    } catch (err) {
      setImportError('Import invalide.');
    }
  };

  const shareDeck = () => {
    if (deckCards.length === 0) return;
    const minimal = {
      name: deckName,
      domain: selectedDomain,
      cards: deckCards.map(c => ({ id: c.id, count: c.count })),
      battlefields: selectedBattlefields.map(b => ({ id: b.id, count: b.count })),
      chosenChampionId: chosenChampion?.id,
    };
    const code = encodeDeckForShare(minimal);
    const url = `${window.location.origin}/deckbuilder?deck=${code}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
    showToast('Lien de deck copié', 'success');
  };

  const clearFilters = () => {
    setSelectedDomain('All');
    setSelectedType('All');
    setSelectedRarity('All');
    setMinEnergy('');
    setMaxEnergy('');
    setExactEnergy('');
    setMinMight('');
    setMaxMight('');
    setMinPower('');
    setMaxPower('');
    setRulesQuery('');
    setSelectedSet('All');
    setSelectedKeywords([]);
    setKeywordMode('AND');
    setIncludeTypes([]);
    setExcludeTypes([]);
    setSearchQuery('');
    setSortBy('name');
  };

  if (step === 'legend') {
    return (
      <div className="min-h-screen bg-background py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            eyebrow="Étape 1/4"
            title="Choisis ta"
            titleAccent="Légende"
            description="Sélectionne la légende qui guidera ton deck. Cette légende définit le domaine et le champion associé."
            className="mb-12"
          />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {legends.map((legend: any) => (
              <button
                key={legend.id}
                onClick={() => handleLegendSelect(legend)}
                className="group relative transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <div className="aspect-[3/4.2] rounded-2xl overflow-hidden bg-rift-dark-secondary border-2 border-rift-gold/30 group-hover:border-rift-gold transition-all duration-500 shadow-xl">
                  <img
                    src={legend.images?.[0]?.medium || '/placeholder.png'}
                    alt={legend.name}
                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'champion') {
    return (
      <div className="min-h-screen bg-background py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setStep('legend')}
            className="mb-8 text-rift-blue hover:underline text-sm font-bold"
          >
            ← Retour à la sélection de légende
          </button>
          
          <PageHeader
            eyebrow="Étape 2/4"
            title="Choisis ton"
            titleAccent="Champion"
            description={`Ton champion doit être une unit portant le même nom que ta légende (${selectedLegend?.name}). Sélectionne le bon champion pour continuer.`}
            className="mb-12"
          />
          
          {availableChampions.length === 0 ? (
            <CardPanel className="p-8 text-center">
              <p className="text-gray-400 mb-4">Aucun champion trouvé pour cette légende dans la base de données.</p>
              <p className="text-gray-500 text-sm">Le champion n'a pas pu être trouvé automatiquement. Tu pourras ajouter manuellement les cartes après.</p>
              <button
                onClick={() => setStep('battlefield')}
                className="mt-6 px-8 py-4 bg-rift-gold text-black font-black rounded-xl uppercase tracking-widest hover:scale-105 transition-all"
              >
                Passer cette étape
              </button>
            </CardPanel>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {availableChampions.map((champion: any) => (
                <button
                  key={champion.id}
                  onClick={() => handleChampionSelect(champion)}
                  className="group relative transition-transform duration-300 hover:scale-105 active:scale-95"
                >
                   <div className="aspect-[3/4.2] rounded-2xl overflow-hidden bg-rift-dark-secondary border-2 border-rift-purple/30 group-hover:border-rift-purple transition-all duration-500 shadow-xl">
                     <img
                      src={champion.variants?.[0]?.imageUrl || '/placeholder.png'}
                      alt={champion.name}
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'battlefield') {
    return (
      <div className="min-h-screen bg-background py-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header compact */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-1">Étape 4/4</div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                Choisis tes <span className="text-rift-gold">Battlefields</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">Sélectionne exactement 3 battlefields — terrains activés pendant la partie.</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Sélectionnés en mini */}
              <div className="flex items-center gap-2">
                {[0, 1, 2].map(i => {
                  const bf = selectedBattlefields[i];
                  return bf ? (
                    <div key={bf.id} className="relative group">
                      <div className="w-16 h-10 rounded-lg overflow-hidden border border-rift-gold/50">
                        <img src={bf.imageUrl || '/placeholder.png'} alt={bf.name} className="w-full h-full object-cover" />
                      </div>
                      <button
                        onClick={() => removeBattlefield(bf.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black border border-white/20 text-[8px] text-gray-400 hover:text-rift-red flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >✕</button>
                    </div>
                  ) : (
                    <div key={i} className="w-16 h-10 rounded-lg border border-dashed border-white/10 bg-white/2 flex items-center justify-center">
                      <span className="text-[8px] text-gray-700 font-black">{i + 1}</span>
                    </div>
                  );
                })}
              </div>
              <span className={`text-xs font-black tabular-nums ${selectedBattlefields.length === 3 ? 'text-green-400' : 'text-gray-500'}`}>
                {selectedBattlefields.length}/3
              </span>
              <button
                onClick={() => setStep('build')}
                disabled={selectedBattlefields.length !== 3}
                className="px-6 py-2.5 bg-rift-gold text-black text-xs font-black rounded-xl uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100"
              >
                Continuer →
              </button>
            </div>
          </div>

          {/* Grille de battlefields — cartes horizontales */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {availableBattlefields.map((bf: any) => {
              const inDeck = selectedBattlefields.find(b => b.id === bf.id)?.count || 0;
              const isSelected = inDeck > 0;
              return (
                <button
                  key={bf.id}
                  onClick={() => addBattlefield(bf)}
                  className={`group relative p-3 rounded-xl border transition-all duration-200 text-left
                    ${isSelected
                      ? 'bg-rift-gold/10 border-rift-gold/60 shadow-[0_0_12px_rgba(var(--color-rift-gold),0.15)]'
                      : 'bg-white/3 border-white/8 hover:border-rift-gold/40 hover:bg-white/6'
                    }`}
                >
                  {/* Image en format paysage */}
                  <div className="w-full aspect-[3/2] rounded-lg overflow-hidden bg-black/40">
                    <img
                      src={bf.images?.[0]?.medium || '/placeholder.png'}
                      alt={bf.name}
                      className={`w-full h-full object-cover transition-all duration-500 ${isSelected ? 'grayscale-0' : 'grayscale-[0.4] group-hover:grayscale-0'}`}
                    />
                  </div>
                  {/* Badge sélectionné */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-rift-gold text-black flex items-center justify-center font-black text-xs">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Retour */}
          <div className="mt-6">
            <button onClick={() => setStep('build')} className="text-xs text-gray-600 hover:text-white transition-colors uppercase tracking-widest font-black">
              ← Retour au deck
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      {/* Subtle Background Card Rails */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
        <div className="absolute -top-20 left-0 right-0">
          <CardRail
            cards={BEAUTIFUL_CARDS.slice(0, 6)}
            cardClassName="w-32 md:w-48 rounded-xl"
            className="opacity-30"
          />
        </div>
        <div className="absolute -bottom-20 left-0 right-0">
          <CardRail
            cards={BEAUTIFUL_CARDS.slice(4, 10)}
            cardClassName="w-32 md:w-48 rounded-xl"
            className="opacity-30"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Toasts */}
        {toasts.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50 space-y-2">
            {toasts.map(t => (
              <div
                key={t.id}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border backdrop-blur-md ${
                  t.variant === 'success'
                    ? 'bg-green-500/10 text-green-300 border-green-500/30'
                    : t.variant === 'error'
                      ? 'bg-red-500/10 text-red-300 border-red-500/30'
                      : 'bg-white/10 text-white border-white/20'
                }`}
              >
                {t.text}
              </div>
            ))}
          </div>
        )}
        {/* ── ACTIONS BAR (au-dessus) ── */}
        <div className="mb-2 flex items-center justify-between gap-3">
          {/* Gauche : charger un deck */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSavedDeck}
              onChange={(e) => setSelectedSavedDeck(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest appearance-none max-w-[130px]"
            >
              <option value="" className="bg-rift-dark">Charger un deck…</option>
              {localDecks.map(d => (
                <option key={d.id} value={d.id} className="bg-rift-dark">{d.name}</option>
              ))}
            </select>
            {selectedSavedDeck && (
              <button onClick={() => loadSavedDeck(selectedSavedDeck)} className="px-3 py-2 bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-white/20 transition-all">
                OK
              </button>
            )}
          </div>
          {/* Droite : actions principales */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImport(!showImport)}
              className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${showImport ? 'bg-rift-blue text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}`}
            >
              Importer
            </button>
            <button
              onClick={exportDeck}
              disabled={stats.totalCards === 0}
              className="px-4 py-2 rounded-lg bg-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all disabled:opacity-30"
            >
              Exporter
            </button>
            <button
              onClick={shareDeck}
              disabled={!deckIsValid}
              className="px-4 py-2 rounded-lg bg-rift-purple/80 text-white text-[9px] font-black uppercase tracking-widest hover:bg-rift-purple transition-all disabled:opacity-30"
            >
              Partager
            </button>
            <button
              onClick={saveDeck}
              disabled={!deckIsValid}
              className="px-4 py-2 rounded-lg bg-rift-gold text-black text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-30 shadow-lg"
            >
              Sauvegarder
            </button>
          </div>
        </div>

        {/* ── INFO BAR ── */}
        <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl flex items-stretch gap-0 w-full overflow-hidden">

          {/* Images Légende + Champion — w-28 chacune, toute la hauteur */}
          <div className="flex shrink-0">
            {selectedLegend && (
              <div className="w-28 overflow-hidden border-r border-white/10">
                <img
                  src={selectedLegend.images?.[0]?.medium || '/placeholder.png'}
                  alt={selectedLegend.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            )}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData('text/plain');
                const card = allCards.find(c => c.id === id);
                if (card && card.type === 'Champion' && canChooseChampion(card)) addToDeck(card);
              }}
              className="w-28 border-r border-white/10 relative group"
            >
              {chosenChampionCard?.imageUrl ? (
                <>
                  <img src={chosenChampionCard.imageUrl} alt={chosenChampionCard.name} className="w-full h-full object-cover object-top" />
                  {chosenChampion && (
                    <button
                      onClick={() => setChosenChampion(null)}
                      className="absolute top-1 right-1 w-4 h-4 rounded bg-black/70 text-[8px] text-gray-300 hover:text-rift-red flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >✕</button>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-rift-purple/5 flex items-center justify-center border-l border-dashed border-rift-purple/20">
                  <span className="text-[8px] text-gray-700 uppercase font-black leading-none text-center">drop</span>
                </div>
              )}
            </div>
          </div>

          {/* Contenu principal — occupe tout l'espace restant */}
          <div className="flex items-center gap-5 flex-1 px-5 py-6 min-w-0">

            {/* Nom + progression + compteurs L/C */}
            <div className="flex flex-col gap-1 w-72 shrink-0">
              <input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="px-0 py-0 bg-transparent border-none text-sm font-black text-white focus:ring-0 placeholder-gray-700 uppercase tracking-tighter w-full"
                placeholder="NOM DU DECK"
              />
              <div className="w-full bg-white/5 h-[2px] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 rounded-full ${mainCount >= requiredMain ? 'bg-green-500' : 'bg-rift-gold'}`}
                  style={{ width: `${Math.min(100, (mainCount / requiredMain) * 100)}%` }}
                />
              </div>
              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest">
                <span className={legendCount === 1 ? 'text-green-400' : 'text-rift-red'}>Légende {legendCount}/1</span>
                <span className="text-gray-700">·</span>
                <span className={championCount === 1 ? 'text-green-400' : 'text-rift-red'}>Champion {championCount}/1</span>
              </div>
            </div>

            <div className="w-px h-10 bg-white/10 shrink-0" />

            {/* Stats — réparties sur tout l'espace disponible */}
            <div className="flex items-center justify-around flex-1 min-w-0">
              {[
                { label: 'Énergie moy.', value: stats.averageEnergy },
                { label: 'Unités', value: stats.units },
                { label: 'Sorts', value: stats.spells },
                { label: 'Équip.', value: stats.gear },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <span className="text-sm font-black text-white tabular-nums leading-none">{value}</span>
                  <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{label}</span>
                </div>
              ))}

              <div className="w-px h-10 bg-white/10 shrink-0" />

              {/* Battlefields */}
              <div className="flex flex-col gap-0.5 items-center">
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Battlefields</span>
                <span className={`text-lg font-black tabular-nums leading-none ${battlefieldCount === 3 ? 'text-green-400' : 'text-gray-400'}`}>
                  {battlefieldCount}<span className="text-gray-700 text-xs">/3</span>
                </span>
                <button
                  onClick={() => setStep('battlefield')}
                  className="text-[8px] font-black text-rift-blue hover:text-white uppercase tracking-widest transition-colors"
                >
                  Modifier →
                </button>
              </div>

              <div className="w-px h-10 bg-white/10 shrink-0" />

              {/* Statut */}
              <div className="flex flex-col gap-0.5 items-center">
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Statut</span>
                <span className={`text-xs font-black uppercase ${deckIsValid ? 'text-green-400' : 'text-rift-red'}`}>
                  {deckIsValid ? '✓ Légal' : '✗ Incomplet'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Import panel */}
        {showImport && (
          <div className="mb-6 p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3 backdrop-blur-xl">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Importer une decklist</div>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Collez une decklist exportée ici (ex: 2x Nom de Carte)..."
              className="w-full h-24 p-3 bg-black/40 border border-white/10 rounded-2xl text-xs text-gray-300 resize-none focus:border-rift-blue focus:outline-none"
            />
            {importError && <div className="text-xs text-rift-red font-bold">{importError}</div>}
            <div className="flex gap-3">
              <button onClick={importDeck} className="px-6 py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                Importer la liste
              </button>
              <button onClick={() => { setShowImport(false); setImportText(''); setImportError(''); }} className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-white/10 transition-all">
                Annuler
              </button>
            </div>
          </div>
        )}

        {shareUrl && (
          <div className="mb-6 p-4 bg-rift-purple/10 border border-rift-purple/30 rounded-2xl flex items-center justify-between gap-4">
            <div className="text-[10px] text-gray-300 break-all flex-1">{shareUrl}</div>
            <button onClick={() => navigator.clipboard.writeText(shareUrl)} className="shrink-0 px-4 py-2 rounded-xl bg-rift-purple text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
              Copier
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Interface */}
          <div className="lg:col-span-8 space-y-8">
            {/* Control Bar — pleine largeur */}
            <CardPanel className="px-4 py-3 bg-white/5 border-white/10 backdrop-blur-xl">
              <div className="flex items-end gap-3 w-full">

                {/* Recherche — flex-1 prend tout l'espace disponible */}
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Rechercher</div>
                  <input
                    type="text"
                    placeholder="Nom de la carte..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs font-bold text-white placeholder-gray-600 focus:border-rift-blue focus:outline-none"
                  />
                  {/* Reset + Filtres sous le champ */}
                  <div className="flex gap-2 mt-1.5">
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[8px] font-black text-gray-500 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className={`flex-1 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${showAdvanced ? 'bg-rift-blue text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                      + Filtres
                    </button>
                  </div>
                </div>

                {/* Domaine */}
                <div className="shrink-0">
                  <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Domaine</div>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[9px] font-black text-gray-300 focus:ring-0 uppercase tracking-widest appearance-none cursor-pointer"
                  >
                    {domains.map(d => (
                      <option key={d} value={d} className="bg-rift-dark">{d === 'All' ? 'Tous' : d}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div className="shrink-0">
                  <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Type</div>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[9px] font-black text-gray-300 focus:ring-0 uppercase tracking-widest appearance-none cursor-pointer"
                  >
                    {types.map(t => (
                      <option key={t} value={t} className="bg-rift-dark">{t === 'All' ? 'Tous' : t}</option>
                    ))}
                  </select>
                </div>

                {/* Rareté */}
                <div className="shrink-0">
                  <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Rareté</div>
                  <select
                    value={selectedRarity}
                    onChange={(e) => setSelectedRarity(e.target.value)}
                    className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[9px] font-black text-gray-300 focus:ring-0 uppercase tracking-widest appearance-none cursor-pointer"
                  >
                    {rarities.map(r => (
                      <option key={r} value={r} className="bg-rift-dark">{r === 'All' ? 'Toutes' : r}</option>
                    ))}
                  </select>
                </div>

                {/* Énergie */}
                <div className="shrink-0">
                  <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Énergie</div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minEnergy}
                      onChange={(e) => setMinEnergy(e.target.value)}
                      className="w-12 px-2 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[9px] font-black text-gray-300 focus:ring-0"
                    />
                    <span className="text-gray-600 text-[9px]">–</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxEnergy}
                      onChange={(e) => setMaxEnergy(e.target.value)}
                      className="w-12 px-2 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[9px] font-black text-gray-300 focus:ring-0"
                    />
                  </div>
                </div>

                {/* Tri */}
                <div className="shrink-0">
                  <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Tri</div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[9px] font-black text-gray-300 focus:ring-0 uppercase tracking-widest appearance-none cursor-pointer"
                  >
                    <option value="name" className="bg-rift-dark">Nom</option>
                    <option value="energy" className="bg-rift-dark">Énergie</option>
                  </select>
                </div>

              </div>
            </CardPanel>

            {showAdvanced && (
              <CardPanel className="p-6 bg-black/30 border-white/10 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Recherche dans les regles</label>
                    <input
                      type="text"
                      placeholder="ex: draw, ready, stun..."
                      value={rulesQuery}
                      onChange={(e) => setRulesQuery(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Set / Expansion</label>
                    <select
                      value={selectedSet}
                      onChange={(e) => setSelectedSet(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest appearance-none"
                    >
                      {sets.map(s => (
                        <option key={s} value={s} className="bg-rift-dark">{s === 'All' ? 'TOUS' : s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Might</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minMight}
                        onChange={(e) => setMinMight(e.target.value)}
                        className="w-full px-3 py-3 bg-black/40 border border-white/10 rounded-2xl text-[10px] text-gray-300"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxMight}
                        onChange={(e) => setMaxMight(e.target.value)}
                        className="w-full px-3 py-3 bg-black/40 border border-white/10 rounded-2xl text-[10px] text-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Power</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPower}
                        onChange={(e) => setMinPower(e.target.value)}
                        className="w-full px-3 py-3 bg-black/40 border border-white/10 rounded-2xl text-[10px] text-gray-300"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPower}
                        onChange={(e) => setMaxPower(e.target.value)}
                        className="w-full px-3 py-3 bg-black/40 border border-white/10 rounded-2xl text-[10px] text-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Types avances</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Inclure</div>
                        <div className="flex flex-wrap gap-2">
                          {types.filter(t => t !== 'All').map(t => (
                            <button
                              key={`inc-${t}`}
                              onClick={() => setIncludeTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                              className="p-0"
                            >
                              <Badge className={includeTypes.includes(t)
                                ? 'bg-white text-black border-white text-[9px]'
                                : 'bg-white/5 text-gray-400 border-white/10 text-[9px]'}
                              >
                                {t}
                              </Badge>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Exclure</div>
                        <div className="flex flex-wrap gap-2">
                          {types.filter(t => t !== 'All').map(t => (
                            <button
                              key={`exc-${t}`}
                              onClick={() => setExcludeTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                              className="p-0"
                            >
                              <Badge className={excludeTypes.includes(t)
                                ? 'bg-rift-red/20 text-rift-red border-rift-red/30 text-[9px]'
                                : 'bg-white/5 text-gray-400 border-white/10 text-[9px]'}
                              >
                                {t}
                              </Badge>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Energie exacte</label>
                    <input
                      type="number"
                      placeholder="ex: 3"
                      value={exactEnergy}
                      onChange={(e) => setExactEnergy(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-[10px] text-gray-300"
                    />
                    <div className="text-[9px] text-gray-600 mt-2">Si rempli, ignore E min/max.</div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Mode mots-cles</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setKeywordMode('AND')}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest ${keywordMode === 'AND' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                      >
                        AND
                      </button>
                      <button
                        onClick={() => setKeywordMode('OR')}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest ${keywordMode === 'OR' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                      >
                        OR
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Mots-cles</label>
                  <div className="flex flex-wrap gap-2">
                    {keywordOptions.map(k => (
                      <button
                        key={k}
                        onClick={() => setSelectedKeywords(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k])}
                        className="p-0"
                      >
                        <Badge className={selectedKeywords.includes(k)
                          ? 'bg-rift-gold text-black border-rift-gold text-[9px]'
                          : 'bg-white/5 text-gray-400 border-white/10 text-[9px]'}
                        >
                          {k}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              </CardPanel>
            )}

            {/* Selection Grid */}
            {filteredCards.length === 0 ? (
              <EmptyState message="Aucune carte ne correspond aux filtres." className="py-20" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[800px] overflow-y-auto no-scrollbar pr-2">
                {filteredCards.map((card: any) => {
                  const inDeck = deckCards.find(c => c.id === card.id)?.count || 0;
                  return (
                    <button
                      key={card.id}
                      onClick={(e) => {
                        if (e.altKey) {
                          removeFromDeck(card.id);
                        } else {
                          addToDeck(card);
                        }
                      }}
                      onContextMenu={(e) => {
                        if (card.type !== 'Champion') return;
                        e.preventDefault();
                        addToDeck(card);
                      }}
                      draggable={card.type === 'Champion'}
                      onDragStart={(e) => {
                        if (card.type !== 'Champion') return;
                        if (!canChooseChampion(card)) return;
                        e.dataTransfer.setData('text/plain', card.id);
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                      className={`group relative bg-rift-dark-secondary rounded-[24px] border border-white/5 hover:border-rift-gold/50 transition-all duration-500 overflow-hidden text-left shadow-xl ${card.type === 'Champion' && !canChooseChampion(card) ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img
                          src={card.images?.[0]?.medium || '/placeholder.png'}
                          alt={card.name}
                          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        
                        {/* Count badge */}
                        {inDeck > 0 && (
                          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-rift-gold text-black flex items-center justify-center font-black text-xs shadow-2xl animate-in zoom-in-50 duration-300">
                            {inDeck}
                          </div>
                        )}
                        
                        <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-black text-white">
                          ⚡{card.energy || 0}
                        </div>
                      </div>
                    <div className="p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge className={`bg-black/60 border-white/10 ${domainBadgeClasses(card.domain)}`}>
                          {card.domain}
                        </Badge>
                        <Badge className="bg-white/5 text-gray-300 border-white/10">
                          {card.type}
                        </Badge>
                        {card.type === 'Champion' && (
                          <Badge
                            className={`${canChooseChampion(card)
                              ? 'bg-rift-gold/10 text-rift-gold border-rift-gold/30'
                              : 'bg-rift-red/10 text-rift-red border-rift-red/30'}`}
                          >
                            Champion
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs font-black text-white truncate uppercase tracking-tight">{card.name}</p>
                    </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar — TheoryCraft + liste uniquement */}
          <div className="lg:col-span-4 space-y-6">

            {/* Theorycraft Panel — redesigned */}
            <CardPanel className="overflow-hidden bg-black/40 border-white/10">
              {/* Header with global score */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">TheoryCraft</h3>
                  {/* Compteur 1/40 : légende + champion choisi + cartes principales */}
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">
                    <span className={`font-black ${stats.totalCards + (chosenChampionCard && !deckCards.find(c => c.id === chosenChampionCard.id) ? 1 : 0) >= 40 ? 'text-green-400' : 'text-gray-400'}`}>
                      {stats.totalCards + (chosenChampionCard && !deckCards.find(c => c.id === chosenChampionCard.id) ? 1 : 0)}
                    </span>
                    <span className="text-gray-700">/40</span>
                    <span className="ml-1 text-gray-600">cartes</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-black leading-none ${scoreColor(theorycraft.score)}`}>{theorycraft.score}</div>
                  <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">/100</div>
                </div>
              </div>

              {/* Sub-scores as progress bars */}
              <div className="p-5 space-y-3 border-b border-white/5">
                {[
                  { label: 'Courbe', value: theorycraft.scores.curve },
                  { label: 'Consistance', value: theorycraft.scores.consistency },
                  { label: 'Interaction', value: theorycraft.scores.interaction },
                  { label: 'Synergie', value: theorycraft.scores.synergy },
                  { label: 'Wincon', value: theorycraft.scores.wincon },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
                      <span className={`text-[10px] font-black tabular-nums ${scoreColor(value)}`}>{value}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-rift-red'}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Warnings */}
              {theorycraft.warnings.length > 0 && (
                <div className="px-5 py-4 border-b border-white/5 space-y-2">
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Alertes</div>
                  {theorycraft.warnings.slice(0, 3).map((warning, index) => (
                    <div key={`${warning}-${index}`} className="flex items-start gap-2 text-[10px] text-rift-red font-bold">
                      <span className="shrink-0 mt-0.5">⚠</span>
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {theorycraft.suggestions.length > 0 && (
                <div className="px-5 py-4 border-b border-white/5 space-y-2">
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Suggestions</div>
                  {theorycraft.suggestions.slice(0, 5).map((suggestion, index) => (
                    <div key={`${suggestion.text}-${index}`} className="flex items-start gap-2 text-[10px] text-gray-300">
                      <span className="shrink-0 text-gray-500">•</span>
                      <span>{suggestion.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Key Cards */}
              {theorycraft.keyCards.length > 0 && (
                <div className="px-5 py-4">
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Cartes clés</div>
                  <div className="flex flex-wrap gap-1.5">
                    {theorycraft.keyCards.slice(0, 10).map(card => (
                      <span
                        key={card.name}
                        title={card.priority}
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wide border ${
                          card.present
                            ? 'bg-white/10 text-white border-white/20'
                            : 'bg-rift-red/10 text-rift-red border-rift-red/30'
                        }`}
                      >
                        {!card.present && <span className="mr-1 opacity-60">✗</span>}
                        {card.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardPanel>

            {/* Card List */}
            <CardPanel className="overflow-hidden flex flex-col max-h-[500px]">
              <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-center">
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Contenu du Deck</h3>
                <button onClick={() => setDeckCards([])} className="text-[9px] font-black text-gray-600 hover:text-rift-red transition-colors uppercase tracking-widest">Vider</button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                {deckCards.length === 0 ? (
                  <EmptyState message="Deck vide" className="py-20 border-0 bg-transparent" />
                ) : (
                  <>
                    {deckCards.filter(c => c.type === 'Legend').length > 0 && (
                      <div className="space-y-2">
                        <Badge className="bg-rift-gold/10 text-rift-gold border-rift-gold/30">Légende</Badge>
                        {deckCards.filter(c => c.type === 'Legend').sort((a, b) => a.energy - b.energy).map(card => (
                          <CardListItem key={card.id} card={card} onRemove={() => removeFromDeck(card.id)} />
                        ))}
                      </div>
                    )}
                    {deckCards.filter(c => c.type === 'Champion').length > 0 && (
                      <div className="space-y-2">
                        <Badge className="bg-rift-purple/10 text-rift-purple border-rift-purple/30">Champion</Badge>
                        {deckCards.filter(c => c.type === 'Champion').sort((a, b) => a.energy - b.energy).map(card => (
                          <CardListItem key={card.id} card={card} onRemove={() => removeFromDeck(card.id)} />
                        ))}
                      </div>
                    )}
                    {deckCards.filter(c => c.type === 'Unit').length > 0 && (
                      <div className="space-y-2">
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">Unités</Badge>
                        {deckCards.filter(c => c.type === 'Unit').sort((a, b) => a.energy - b.energy).map(card => (
                          <CardListItem key={card.id} card={card} onRemove={() => removeFromDeck(card.id)} />
                        ))}
                      </div>
                    )}
                    {deckCards.filter(c => c.type === 'Gear').length > 0 && (
                      <div className="space-y-2">
                        <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Équipements</Badge>
                        {deckCards.filter(c => c.type === 'Gear').sort((a, b) => a.energy - b.energy).map(card => (
                          <CardListItem key={card.id} card={card} onRemove={() => removeFromDeck(card.id)} />
                        ))}
                      </div>
                    )}
                    {deckCards.filter(c => c.type === 'Spell').length > 0 && (
                      <div className="space-y-2">
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Sorts</Badge>
                        {deckCards.filter(c => c.type === 'Spell').sort((a, b) => a.energy - b.energy).map(card => (
                          <CardListItem key={card.id} card={card} onRemove={() => removeFromDeck(card.id)} />
                        ))}
                      </div>
                    )}
                    {selectedBattlefields.length > 0 && (
                      <div className="space-y-2 pt-4 border-t border-white/5">
                        <Badge className="bg-rift-blue/10 text-rift-blue border-rift-blue/30">Battlefields</Badge>
                        {selectedBattlefields.map(card => (
                          <CardListItem key={card.id} card={card} onRemove={() => removeBattlefield(card.id)} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardPanel>

          </div>
        </div>
      </div>
    </div>
  );
}

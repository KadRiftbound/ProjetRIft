import type { DeckCard } from '../deckbuilder/types';
import { getLegendGuide } from './legend-guides';

export interface DeckAnalysisScores {
  curve: number;
  consistency: number;
  interaction: number;
  synergy: number;
  wincon: number;
}

export interface DeckAnalysisSuggestion {
  type: 'add' | 'cut' | 'adjust' | 'note';
  text: string;
}

export interface DeckAnalysis {
  score: number;
  scores: DeckAnalysisScores;
  notes: string[];
  warnings: string[];
  suggestions: DeckAnalysisSuggestion[];
  keyCards: { name: string; present: boolean; priority: 'high' | 'medium' | 'low' }[];
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const keywordBuckets = {
  draw: ['draw', 'pioche', 'look at', 'reveal', 'search', 'tutor', 'recycle'],
  removal: ['deal', 'kill', 'destroy', 'banish', 'exile', 'discard'],
  control: ['stun', 'exhaust', 'move', 'recall', 'return', 'freeze'],
  finisher: ['overwhelm', 'assault', 'mighty', 'showdown', 'double strike'],
};

function countByRules(cards: DeckCard[], keywords: string[]): number {
  return cards.reduce((sum, card) => {
    const rules = (card.rules || '').toLowerCase();
    const matches = keywords.some(keyword => rules.includes(keyword));
    return sum + (matches ? card.count : 0);
  }, 0);
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function scoreFromRange(value: number, target: number, tolerance: number, weight = 20) {
  const diff = Math.abs(value - target);
  const penalty = (diff / tolerance) * weight;
  return clamp(100 - penalty);
}

export function analyzeDeck(params: {
  deckCards: DeckCard[];
  legendId?: string;
  chosenChampionName?: string | null;
}): DeckAnalysis {
  const { deckCards, legendId } = params;
  const legendGuide = legendId ? getLegendGuide(legendId) : null;

  const mainCards = deckCards.filter(c => ['Unit', 'Spell', 'Gear'].includes(c.type));
  const totalMain = mainCards.reduce((sum, c) => sum + c.count, 0);
  const totalCards = deckCards.reduce((sum, c) => sum + c.count, 0);

  const totalEnergy = deckCards.reduce((sum, c) => sum + (c.energy || 0) * c.count, 0);
  const avgEnergy = totalCards ? totalEnergy / totalCards : 0;

  const lowCurve = mainCards.filter(c => (c.energy || 0) <= 2).reduce((s, c) => s + c.count, 0);
  const midCurve = mainCards.filter(c => (c.energy || 0) >= 3 && (c.energy || 0) <= 4).reduce((s, c) => s + c.count, 0);
  const highCurve = mainCards.filter(c => (c.energy || 0) >= 5).reduce((s, c) => s + c.count, 0);

  const drawCount = countByRules(deckCards, keywordBuckets.draw);
  const removalCount = countByRules(deckCards, keywordBuckets.removal);
  const controlCount = countByRules(deckCards, keywordBuckets.control);
  const finisherCount = countByRules(deckCards, keywordBuckets.finisher) + deckCards.filter(c => c.type === 'Unit' && (c.energy || 0) >= 6).reduce((s, c) => s + c.count, 0);

  const curveScore = clamp(
    scoreFromRange(avgEnergy, 3.2, 1.4, 30)
      - Math.max(0, 6 - lowCurve) * 4
      - Math.max(0, 10 - midCurve) * 2
      - Math.max(0, highCurve - 12) * 2
  );

  const consistencyScore = clamp(40 + drawCount * 6);
  const interactionScore = clamp(25 + removalCount * 5 + controlCount * 4);
  const winconScore = clamp(30 + finisherCount * 4);

  let synergyScore = 60;
  const keyCards: { name: string; present: boolean; priority: 'high' | 'medium' | 'low' }[] = [];
  if (legendGuide) {
    const priorities = legendGuide.synergies || [];
    priorities.forEach(item => {
      const present = deckCards.some(card => normalize(card.name) === normalize(item.cardName));
      keyCards.push({ name: item.cardName, present, priority: item.priority });
      const weight = item.priority === 'high' ? 12 : item.priority === 'medium' ? 7 : 4;
      synergyScore += present ? weight : -weight;
    });

    (legendGuide.decks || []).forEach(deck => {
      deck.coreCards.forEach(cardName => {
        if (keyCards.some(entry => normalize(entry.name) === normalize(cardName))) return;
        const present = deckCards.some(card => normalize(card.name) === normalize(cardName));
        keyCards.push({ name: cardName, present, priority: 'medium' });
        synergyScore += present ? 4 : -4;
      });
    });
  }

  synergyScore = clamp(synergyScore);

  const scores: DeckAnalysisScores = {
    curve: Math.round(curveScore),
    consistency: Math.round(consistencyScore),
    interaction: Math.round(interactionScore),
    synergy: Math.round(synergyScore),
    wincon: Math.round(winconScore),
  };

  const score = Math.round((scores.curve + scores.consistency + scores.interaction + scores.synergy + scores.wincon) / 5);

  const notes: string[] = [];
  const warnings: string[] = [];
  const suggestions: DeckAnalysisSuggestion[] = [];

  if (avgEnergy > 4.1) {
    warnings.push('Courbe d energie lourde. Risque de mains lentes.');
    suggestions.push({ type: 'adjust', text: 'Reduire les cartes a 5+ energie et ajouter 2-3 options a 1-2 energie.' });
  }

  if (drawCount < 5) {
    warnings.push('Peu de pioche/selection. Le deck peut manquer de consistence.');
    suggestions.push({ type: 'add', text: 'Ajouter 3-5 cartes de pioche ou selection.' });
  }

  if (removalCount + controlCount < 6) {
    warnings.push('Interaction faible. Difficile de repondre aux menaces.');
    suggestions.push({ type: 'add', text: 'Integrer plus de removal, stun ou effects de deplacement.' });
  }

  if (finisherCount < 6) {
    warnings.push('Peu de conditions de fin.');
    suggestions.push({ type: 'add', text: 'Ajouter des menaces lourdes ou des cartes avec Overwhelm/Assault.' });
  }

  if (legendGuide) {
    notes.push(`Guide detecte: ${legendGuide.legendId}.`);
    const missingHigh = keyCards.filter(k => k.priority === 'high' && !k.present).slice(0, 4);
    missingHigh.forEach(card => {
      suggestions.push({ type: 'add', text: `Carte cle manquante: ${card.name}.` });
    });
  } else if (legendId) {
    notes.push('Aucun guide lie a cette legende.');
  }

  if (totalMain > 0 && lowCurve < 6) {
    suggestions.push({ type: 'adjust', text: 'Vise 6-10 cartes a 1-2 energie pour stabiliser le debut de partie.' });
  }

  return { score, scores, notes, warnings, suggestions, keyCards };
}

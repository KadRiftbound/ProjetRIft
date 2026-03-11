'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ALL_CARDS } from '../../lib/cards';
import { decodeDeckFromShare } from '../../lib/deck-share';
import { getLocalDeckById } from '../../lib/local-storage';
import type { DeckCard, Deck } from '../../deckbuilder/types';

export default function DeckViewClient() {
  const params = useSearchParams();
  const deckId = params.get('deckId');
  const deckCode = params.get('deck');

  const [deckName, setDeckName] = useState('Deck');
  const [deckDomain, setDeckDomain] = useState('All');
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
  const [battlefields, setBattlefields] = useState<DeckCard[]>([]);
  const [chosenChampion, setChosenChampion] = useState<DeckCard | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (deckCode) {
        const decoded = decodeDeckFromShare(deckCode);
        const nextCards: DeckCard[] = decoded.cards
          .map(entry => {
            const card = ALL_CARDS.find(c => c.id === entry.id);
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
              imageUrl: card.variants?.[0]?.imageUrl,
            } as DeckCard;
          })
          .filter(Boolean) as DeckCard[];

        setDeckName(decoded.name || 'Deck Partage');
        setDeckDomain(decoded.domain || 'All');
        setDeckCards(nextCards);
        
        if (decoded.battlefields) {
          const nextBattlefields: DeckCard[] = decoded.battlefields
            .map(entry => {
              const card = ALL_CARDS.find(c => c.id === entry.id);
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
                imageUrl: card.variants?.[0]?.imageUrl,
              } as DeckCard;
            })
            .filter(Boolean) as DeckCard[];
          setBattlefields(nextBattlefields);
        }
        
        if (decoded.chosenChampionId) {
          const champCard = ALL_CARDS.find(c => c.id === decoded.chosenChampionId);
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
              imageUrl: champCard.variants?.[0]?.imageUrl,
            });
          }
        }
        return;
      }

      if (deckId) {
        const deck = getLocalDeckById(deckId) as Deck | undefined;
        if (!deck) {
          setError('Deck introuvable dans votre collection locale.');
          return;
        }
        setDeckName(deck.name);
        setDeckDomain(deck.domain);
        setDeckCards(deck.cards);
        setBattlefields(deck.battlefields || []);
        setChosenChampion(deck.chosenChampion || null);
      }
    } catch (err) {
      setError('Impossible de charger ce deck.');
    }
  }, [deckId, deckCode]);

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">{deckName}</h1>
            <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest">{deckDomain}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/deckbuilder" className="px-6 py-3 bg-white text-black font-black rounded-xl text-xs tracking-widest">
              EDITER
            </Link>
            <Link href="/decks" className="px-6 py-3 bg-white/5 border border-white/10 text-white font-black rounded-xl text-xs tracking-widest">
              RETOUR
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 font-bold">
            {error}
          </div>
        )}

        {!error && (
          <div className="space-y-6">
            <div className="bg-rift-dark-secondary rounded-[32px] border border-white/5 p-6">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Champion choisi</div>
              {chosenChampion ? (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                  {chosenChampion.imageUrl ? (
                    <div className="w-10 h-14 rounded-lg overflow-hidden bg-black/40">
                      <img src={chosenChampion.imageUrl} alt={chosenChampion.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-14 rounded-lg bg-black/40 flex items-center justify-center">
                      <span className="text-xs opacity-40">🃏</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 uppercase tracking-widest">{chosenChampion.domain}</div>
                    <div className="text-sm font-black text-white uppercase tracking-tight">{chosenChampion.name}</div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 uppercase tracking-widest">Aucun</div>
              )}
            </div>

            {battlefields.length > 0 && (
              <div className="bg-rift-dark-secondary rounded-[32px] border border-rift-blue/20 p-6">
                <div className="text-[10px] font-black text-rift-blue uppercase tracking-widest mb-4">Battlefields</div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {battlefields.map(card => (
                    <div key={card.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                      {card.imageUrl ? (
                        <div className="w-10 h-14 rounded-lg overflow-hidden bg-black/40">
                          <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-14 rounded-lg bg-black/40 flex items-center justify-center">
                          <span className="text-xs opacity-40">🃏</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 uppercase tracking-widest">{card.domain}</div>
                        <div className="text-sm font-black text-white uppercase tracking-tight">{card.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-rift-dark-secondary rounded-[32px] border border-white/5 p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {deckCards.map(card => (
                  <div key={card.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                    {card.imageUrl ? (
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-black/40">
                        <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-14 rounded-lg bg-black/40 flex items-center justify-center">
                        <span className="text-xs opacity-40">🃏</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 uppercase tracking-widest">{card.domain}</div>
                      <div className="text-sm font-black text-white uppercase tracking-tight">{card.name}</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-black/40 text-white font-black text-xs flex items-center justify-center">
                      {card.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

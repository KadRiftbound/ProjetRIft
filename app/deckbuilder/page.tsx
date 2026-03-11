import { searchCards, transformCardToView } from "../lib/riftcodex";
import DeckBuilderClient from "./components/DeckBuilderClient";

interface PageProps {
  searchParams: Promise<{ deckId?: string; deck?: string }>;
}

export default async function DeckBuilderPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const allCards = await searchCards({ limit: 600 });
  const transformedCards = allCards.map(transformCardToView);

  return (
    <DeckBuilderClient
      allCards={transformedCards}
      initialDeckId={params?.deckId}
      initialDeckCode={params?.deck}
    />
  );
}

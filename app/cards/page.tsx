import { searchCards, transformCardToView } from "../lib/riftcodex";
import CardsClient from "./components/CardsClient";

export default async function CardsPage() {
  const allCards = await searchCards({ limit: 500 });
  const transformedCards = allCards.map(transformCardToView);

  return <CardsClient initialCards={transformedCards} />;
}

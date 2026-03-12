import { Metadata } from "next";
import { searchCards, transformCardToView } from "../lib/riftcodex";
import CardsClient from "./components/CardsClient";
import { generatePageSEO } from "../lib/seo-config";

export const metadata: Metadata = generatePageSEO({
  title: "Base de données cartes",
  description: "Explorez toutes les cartes Riftbound : Origins, Spiritforged. Filtrez par domaine, rareté, type. Trouvez les meilleures cartes pour vos decks.",
  path: "/cards",
});

export default async function CardsPage() {
  const allCards = await searchCards({ limit: 500 });
  const transformedCards = allCards.map(transformCardToView);

  return <CardsClient initialCards={transformedCards} />;
}

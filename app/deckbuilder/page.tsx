import { Metadata } from "next";
import { searchCards, transformCardToView } from "../lib/riftcodex";
import DeckBuilderClient from "./components/DeckBuilderClient";
import { generatePageSEO } from "../lib/seo-config";
import { generateHowToJSON_LD } from "../lib/json-ld";

export const metadata: Metadata = generatePageSEO({
  title: "Deck Builder",
  description: "Construisez et partagez vos decks Riftbound. Outil professionnel de construction de decks avec analyse de courbe et synergies.",
  path: "/deckbuilder",
});

const HOWTO_SCHEMA = generateHowToJSON_LD(
  "Comment construire un deck Riftbound",
  "Guide étape par étape pour créer un deck compétitif dans Riftbound TGC",
  [
    { name: "Choisir une légende", text: "Sélectionnez une légende qui définit vos couleurs de domaine et votre stratégie de jeu." },
    { name: "Constituer votre deck", text: "Ajoutez 40 cartes en respectant les limites de copies et en vous concentrant sur les synergies de domaine." },
    { name: "Optimiser la courbe de mana", text: "Assurez-vous d'avoir un bon équilibre entre cartes à faible et fort coût." },
    { name: "Tester et ajuster", text: "Jouez des parties 测试 et affinez votre deck selon vos résultats." },
  ]
);

interface PageProps {
  searchParams: Promise<{ deckId?: string; deck?: string }>;
}

export default async function DeckBuilderPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const allCards = await searchCards({ limit: 600 });
  const transformedCards = allCards.map(transformCardToView);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }}
      />
      <DeckBuilderClient
        allCards={transformedCards}
        initialDeckId={params?.deckId}
        initialDeckCode={params?.deck}
      />
    </>
  );
}

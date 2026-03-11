import { notFound } from "next/navigation";
import Link from "next/link";
import { getCardById, searchCards, transformCardToView } from "../../lib/riftcodex";
import CardDetailClient from "./components/CardDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const cards = await searchCards({ limit: 100 });
  return cards.map((card: any) => ({
    id: card.id.toLowerCase(),
  }));
}

export default async function CardDetailPage({ params }: Props) {
  const { id } = await params;
  const card = await getCardById(id.toUpperCase());
  
  if (!card) {
    notFound();
  }

  const transformedCard = transformCardToView(card);

  return <CardDetailClient card={transformedCard} />;
}

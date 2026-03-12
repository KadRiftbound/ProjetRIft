import type { Metadata } from "next";
import { generatePageSEO } from "../lib/seo-config";
import ActusPageClient from "./ActusPageClient";

export const metadata: Metadata = generatePageSEO({
  title: "Actualités",
  description: "Les dernières nouvelles officielles et communautaires de Riftbound TCG, agrégées chaque heure. Sorties, méta, tournois et plus encore.",
  path: "/actus",
});

export default function ActusPage() {
  return <ActusPageClient />;
}

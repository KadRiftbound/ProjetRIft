import type { Metadata } from "next";
import { generatePageSEO } from "../lib/seo-config";
import GlossaryPageClient from "./GlossaryPageClient";

export const metadata: Metadata = generatePageSEO({
  title: "Glossaire",
  description: "Tous les termes, mots-clés et mécanismes du jeu Riftbound expliqués simplement. Might, Power, Energy, Battlefield et plus encore.",
  path: "/glossary",
});

export default function GlossaryPage() {
  return <GlossaryPageClient />;
}

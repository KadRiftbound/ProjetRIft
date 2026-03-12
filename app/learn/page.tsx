import type { Metadata } from "next";
import { generatePageSEO } from "../lib/seo-config";
import LearnPageClient from "./LearnPageClient";

export const metadata: Metadata = generatePageSEO({
  title: "Apprendre à jouer",
  description: "Maîtrisez les fondements de Riftbound TCG : règles officielles complètes, réponses aux questions fréquentes et glossaire.",
  path: "/learn",
});

export default function LearnPage() {
  return <LearnPageClient />;
}

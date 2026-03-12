import type { Metadata } from "next";
import { generatePageSEO, SEO_CONFIG } from "./seo-config";

type PageSEOParams = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: PageSEOParams): Metadata {
  return generatePageSEO({
    title,
    description,
    path,
    image,
    noIndex,
  });
}

export function getMetadataBase() {
  return {
    metadataBase: new URL(SEO_CONFIG.siteUrl),
  };
}

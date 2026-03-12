import type { Metadata } from "next";

const SITE_NAME = "Riftbound Guide";
const SITE_URL = "https://riftbound.fr";
const SITE_DESCRIPTION = "La référence Riftbound en France : cartes, règles, deck builder, tier list, guides et analyses de la méta.";
const SITE_IMAGE = "/og-image.png";

export const SEO_CONFIG = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  defaultTitle: `${SITE_NAME} | Cartes, Règles, Decks & Méta`,
  defaultDescription: SITE_DESCRIPTION,
  defaultImage: SITE_IMAGE,
  locale: "fr_FR",
  twitterHandle: "@riftbound",
} as const;

type PageSEOParams = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

export function generatePageSEO({
  title,
  description,
  path,
  image,
  noIndex = false,
}: PageSEOParams): Metadata {
  const url = `${SEO_CONFIG.siteUrl}${path}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    robots: noIndex 
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        fr: url,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SEO_CONFIG.siteName,
      locale: SEO_CONFIG.locale,
      type: "website",
      images: [
        {
          url: image || SEO_CONFIG.defaultImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image || SEO_CONFIG.defaultImage],
    },
  };
}

export const DEFAULT_SEO: Metadata = {
  title: SEO_CONFIG.defaultTitle,
  description: SEO_CONFIG.defaultDescription,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "Riftbound",
    "Riftbound guide",
    "cartes Riftbound",
    "deck builder Riftbound",
    "méta Riftbound",
    "tier list Riftbound",
    "règles Riftbound",
    "legends Riftbound",
    "guides Riftbound",
    "jeux de cartes",
  ],
  authors: [{ name: "Riftbound Community" }],
  creator: "Riftbound",
  publisher: "Riftbound",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SEO_CONFIG.siteUrl),
  alternates: {
    canonical: SEO_CONFIG.siteUrl,
  },
  openGraph: {
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    url: SEO_CONFIG.siteUrl,
    siteName: SEO_CONFIG.siteName,
    locale: SEO_CONFIG.locale,
    type: "website",
    images: [
      {
        url: SEO_CONFIG.defaultImage,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    images: [SEO_CONFIG.defaultImage],
  },
};

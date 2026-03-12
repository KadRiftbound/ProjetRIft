import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Providers } from "./components/Providers";
import { DEFAULT_SEO } from "./lib/seo-config";
import { WEBSITE_JSON_LD, ORGANIZATION_JSON_LD, generateWebApplicationSchema } from "./lib/json-ld";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = 'https://riftbound.fr';

const WEBAPP_SCHEMA = generateWebApplicationSchema(
  "Riftbound Guide",
  "La référence Riftbound en France : deck builder, base de données cartes, tier list, guides et analyses méta.",
  SITE_URL
);

export const metadata: Metadata = {
  ...DEFAULT_SEO,
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Riftbound Guide | La référence francophone",
    template: "%s | Riftbound Guide",
  },
  description: "La référence Riftbound en France. Deck builder professionnel, base de données complète, tier list méta, guides de légendes et analyses. Tout pour maîtriser le jeu.",
  keywords: [
    "Riftbound",
    "Riftbound TCG",
    "deck builder Riftbound",
    "cartes Riftbound",
    "méta Riftbound",
    "tier list Riftbound",
    "guides Riftbound",
    "légendes Riftbound",
    "tournament Riftbound",
    "jeu de cartes",
  ],
  authors: [{ name: "Riftbound Guide" }],
  creator: "Riftbound Guide",
  publisher: "Riftbound Guide",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      fr: SITE_URL,
      en: SITE_URL,
    },
  },
  openGraph: {
    ...DEFAULT_SEO.openGraph,
    title: "Riftbound Guide | La référence francophone",
    description: "La référence Riftbound en France. Deck builder professionnel, base de données complète, tier list méta, guides de légendes.",
    url: SITE_URL,
    siteName: "Riftbound Guide",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riftbound Guide | La référence francophone",
    description: "La référence Riftbound en France. Deck builder, cartes, tier list, guides.",
  },
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f1117",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${cinzel.variable} ${inter.variable} font-sans`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f1117" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow" />
        <meta name="author" content="Riftbound Guide" />
        
        <link rel="alternate" hrefLang="fr" href="https://riftbound.fr/" />
        <link rel="alternate" hrefLang="en" href="https://riftbound.fr/" />
        <link rel="alternate" hrefLang="x-default" href="https://riftbound.fr/" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBAPP_SCHEMA) }}
        />
      </head>
      <body className="antialiased bg-background text-foreground font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-rift-blue focus:text-black focus:font-bold focus:rounded-lg"
        >
          Aller au contenu principal
        </a>
        <Providers>
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

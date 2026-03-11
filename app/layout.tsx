import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Providers } from "./components/Providers";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "Riftbound Guide | Cartes, Règles, Decks & Méta",
  description:
    "La référence Riftbound en France : cartes, règles, deck builder, tier list, guides et analyses de la méta.",
  openGraph: {
    title: "Riftbound Guide | Cartes, Règles, Decks & Méta",
    description:
      "La référence Riftbound en France : cartes, règles, deck builder, tier list, guides et analyses de la méta.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cinzel.variable}>
      <body className="antialiased bg-background text-foreground">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

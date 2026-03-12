import { MetadataRoute } from 'next';
import { LEGENDS } from './lib/legend-index';
import { ALL_CARDS } from './lib/cards';

const SITE_URL = 'https://riftbound.fr';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  
  const staticPages = [
    '',
    '/cards',
    '/legends',
    '/decks',
    '/deckbuilder',
    '/tierlist',
    '/learn',
    '/rules',
    '/glossary',
    '/actus',
    '/login',
    '/register',
    '/premium',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'daily' as const : 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  // Pages de légendes individuelles
  const legendEntries: MetadataRoute.Sitemap = LEGENDS.map((legend) => ({
    url: `${SITE_URL}/legends/${legend.legend.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Pages de cartes individuelles
  const cardEntries: MetadataRoute.Sitemap = ALL_CARDS.slice(0, 200).map((card) => ({
    url: `${SITE_URL}/cards/${card.id.toLowerCase()}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...legendEntries, ...cardEntries];
}

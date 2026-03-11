import { NextResponse } from 'next/server';
import { RAW_META_DECKS } from '../../decks/data';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface RawNewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  sourceType: 'official' | 'community' | 'selfmade';
  keywords: string[];
}

interface ProcessedNewsItem extends RawNewsItem {
  confidence: 'confirmed' | 'single' | 'rumor';
  sources: string[];
}

// ─── SOURCE CONFIG ────────────────────────────────────────────────────────────

const SOURCES = [
  {
    name: 'riftbound.gg',
    url: 'https://riftbound.gg/feed/',
    type: 'official' as const,
    parser: 'rss',
  },
  {
    name: 'Riot Games',
    url: 'https://www.riotgames.com/en/news/rss',
    type: 'official' as const,
    parser: 'rss',
    filter: (title: string, desc: string) => {
      const text = (title + ' ' + desc).toLowerCase();
      return (
        text.includes('riftbound') ||
        text.includes('tcg') ||
        text.includes('card game') ||
        text.includes('jeu de cartes')
      );
    },
  },
  {
    name: 'Reddit',
    url: 'https://www.reddit.com/r/Riftbound/.json?limit=20',
    type: 'community' as const,
    parser: 'reddit',
  },
  {
    name: 'riftbound.gg/news',
    url: 'https://riftbound.gg/news/',
    type: 'official' as const,
    parser: 'html',
  },
];

// ─── KEYWORD EXTRACTION ───────────────────────────────────────────────────────

const IMPORTANT_WORDS = new Set([
  'set', 'expansion', 'patch', 'balance', 'update', 'release', 'new', 'announce',
  'card', 'legend', 'champion', 'deck', 'meta', 'tier', 'guide', 'gameplay',
  'tournament', 'championship', 'win', 'nerf', 'buff', 'bug', 'fix', 'hotfix',
  'spirit', 'forge', 'chaos', 'order', 'fury', 'calm', 'magic', 'lore', 'story',
  'season', 'ranked', 'draft', 'event', 'preview', 'spoiler', 'reveal',
  'rotation', 'rotation', 'format', 'standard', 'bundle', 'skin',
]);

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  return [...new Set(words.filter(w => IMPORTANT_WORDS.has(w)))];
}

// ─── TITLE SIMILARITY (Jaccard on keyword sets) ───────────────────────────────

function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter(x => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function normalizeForMatch(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(the|a|an|of|in|to|for|with|and|or|is|are|was|were)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function titlesSimilar(a: string, b: string, kwA: string[], kwB: string[]): boolean {
  const normA = normalizeForMatch(a);
  const normB = normalizeForMatch(b);

  // Exact substring match on normalized titles
  if (normA.includes(normB) || normB.includes(normA)) return true;

  // Jaccard on extracted keywords
  const allKwA = [...kwA, ...extractKeywords(a)];
  const allKwB = [...kwB, ...extractKeywords(b)];
  if (jaccardSimilarity(allKwA, allKwB) >= 0.5) return true;

  // Character n-gram similarity (trigrams) for short titles
  const trigramsA = trigrams(normA);
  const trigramsB = trigrams(normB);
  if (trigramsA.size > 0 && trigramsB.size > 0) {
    const intersection = [...trigramsA].filter(x => trigramsB.has(x)).length;
    const union = new Set([...trigramsA, ...trigramsB]).size;
    if (intersection / union > 0.45) return true;
  }

  return false;
}

function trigrams(str: string): Set<string> {
  const result = new Set<string>();
  for (let i = 0; i < str.length - 2; i++) {
    result.add(str.slice(i, i + 3));
  }
  return result;
}

// ─── RSS FETCHER ──────────────────────────────────────────────────────────────

async function fetchRSS(
  url: string,
  sourceName: string,
  sourceType: 'official' | 'community',
  filter?: (title: string, desc: string) => boolean,
): Promise<RawNewsItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Riftbound-News-Aggregator/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];

    const text = await res.text();
    const items: RawNewsItem[] = [];

    const itemMatches = text.matchAll(/<item>([\s\S]*?)<\/item>/g);

    for (const match of itemMatches) {
      const block = match[1];

      const getTag = (tag: string) => {
        const m = block.match(
          new RegExp(
            `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`,
          ),
        );
        return m ? (m[1] || m[2] || '').trim() : '';
      };

      const title = getTag('title');
      const link =
        getTag('link') ||
        block.match(/<link>([^<]+)<\/link>/)?.[1]?.trim() ||
        '';
      const rawDesc = getTag('description');
      const description = rawDesc.replace(/<[^>]+>/g, '').slice(0, 300).trim();
      const pubDate = getTag('pubDate');

      if (!title || !link) continue;
      if (filter && !filter(title, description)) continue;

      items.push({
        title,
        link,
        description,
        pubDate: pubDate || new Date().toISOString(),
        source: sourceName,
        sourceType,
        keywords: extractKeywords(title + ' ' + description),
      });

      if (items.length >= 15) break;
    }

    return items;
  } catch {
    return [];
  }
}

// ─── REDDIT FETCHER ───────────────────────────────────────────────────────────

async function fetchReddit(url: string): Promise<RawNewsItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Riftbound-News-Aggregator/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const posts: RawNewsItem[] = [];

    const children = data.data?.children?.slice(0, 15) || [];

    for (const post of children) {
      const p = post.data;
      if (!p.title) continue;

      // Skip pure link posts with no body (no added value to display)
      const body = (p.selftext || '').slice(0, 300).trim();

      posts.push({
        title: p.title,
        link: `https://reddit.com${p.permalink}`,
        description: body,
        pubDate: new Date(p.created_utc * 1000).toISOString(),
        source: 'Reddit',
        sourceType: 'community',
        keywords: extractKeywords(p.title + ' ' + body),
      });
    }

    return posts;
  } catch {
    return [];
  }
}

// ─── HTML SCRAPER (riftbound.gg/news) ────────────────────────────────────────

async function fetchHTMLNews(url: string, sourceName: string): Promise<RawNewsItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Riftbound-News-Aggregator/1.0',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];

    const html = await res.text();
    const items: RawNewsItem[] = [];

    // Match article cards — look for <a href="..."> inside article/card containers
    // Pattern covers common CMS structures (title in <h2> or <h3>, optional excerpt)
    const articlePattern =
      /<article[^>]*>([\s\S]*?)<\/article>|<div[^>]*class="[^"]*(?:post|card|article|news)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;

    for (const articleMatch of html.matchAll(articlePattern)) {
      const block = articleMatch[1] || articleMatch[2] || '';

      // Extract href
      const hrefMatch = block.match(/href="([^"]+)"/);
      if (!hrefMatch) continue;
      let link = hrefMatch[1];
      if (link.startsWith('/')) link = 'https://riftbound.gg' + link;
      if (!link.startsWith('http')) continue;

      // Extract title from heading tags
      const titleMatch =
        block.match(/<h[1-3][^>]*>(?:<[^>]+>)*([^<]{5,})</) ||
        block.match(/title="([^"]{5,})"/) ||
        block.match(/alt="([^"]{5,})"/);
      if (!titleMatch) continue;
      const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
      if (!title) continue;

      // Extract description / excerpt
      const descMatch =
        block.match(/<p[^>]*>([^<]{20,})<\/p>/) ||
        block.match(/<span[^>]*class="[^"]*excerpt[^"]*"[^>]*>([^<]+)<\/span>/);
      const description = descMatch
        ? descMatch[1].replace(/<[^>]+>/g, '').slice(0, 300).trim()
        : '';

      // Extract date if available
      const dateMatch =
        block.match(/<time[^>]*datetime="([^"]+)"/) ||
        block.match(/<time[^>]*>([^<]+)<\/time>/);
      const pubDate = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();

      items.push({
        title,
        link,
        description,
        pubDate,
        source: sourceName,
        sourceType: 'official',
        keywords: extractKeywords(title + ' ' + description),
      });

      if (items.length >= 10) break;
    }

    return items;
  } catch {
    return [];
  }
}

// ─── SELFMADE NEWS GENERATOR ─────────────────────────────────────────────────
//
// When 2+ sources confirm a topic, we generate a digest article in French.

interface TopicCluster {
  topic: string;
  items: RawNewsItem[];
  keywords: string[];
}

function buildTopicClusters(items: RawNewsItem[]): TopicCluster[] {
  const clusters: TopicCluster[] = [];

  for (const item of items) {
    let merged = false;
    for (const cluster of clusters) {
      if (titlesSimilar(item.title, cluster.topic, item.keywords, cluster.keywords)) {
        cluster.items.push(item);
        // Merge keywords
        for (const kw of item.keywords) {
          if (!cluster.keywords.includes(kw)) cluster.keywords.push(kw);
        }
        merged = true;
        break;
      }
    }
    if (!merged) {
      clusters.push({
        topic: item.title,
        items: [item],
        keywords: [...item.keywords],
      });
    }
  }

  return clusters;
}

const TOPIC_TEMPLATES: {
  keywords: string[];
  title: (cluster: TopicCluster) => string;
  body: (cluster: TopicCluster) => string;
  category: string;
}[] = [
  {
    keywords: ['patch', 'balance', 'nerf', 'buff', 'hotfix', 'fix'],
    title: () => 'Patch Notes : équilibrage de la meta',
    body: (c) =>
      `Plusieurs sources confirment un patch d'équilibrage en cours. ${c.items.length} sources mentionnent des modifications : ${c.items.map(i => i.source).join(', ')}.`,
    category: 'Metagame',
  },
  {
    keywords: ['set', 'expansion', 'release', 'new', 'reveal', 'spoiler', 'preview'],
    title: (c) => `Nouveau set — ${c.topic.length > 40 ? c.topic.slice(0, 40) + '…' : c.topic}`,
    body: (c) =>
      `Annonce d'un nouveau set ou d'une expansion confirmée par ${c.items.length} sources. Sources : ${c.items.map(i => i.source).join(', ')}.`,
    category: 'Sets',
  },
  {
    keywords: ['tournament', 'championship', 'event', 'ranked', 'season'],
    title: () => 'Événement compétitif annoncé',
    body: (c) =>
      `Un événement compétitif officiel a été annoncé. ${c.items.length} sources en parlent : ${c.items.map(i => i.source).join(', ')}.`,
    category: 'Events',
  },
  {
    keywords: ['legend', 'champion', 'card', 'reveal', 'preview'],
    title: (c) => `Nouvelle carte révélée — ${c.keywords.includes('legend') ? 'Légende' : 'Carte'}`,
    body: (c) =>
      `Une ou plusieurs nouvelles cartes ont été révélées. Confirmé par ${c.items.length} sources : ${c.items.map(i => i.source).join(', ')}.`,
    category: 'Legends',
  },
];

function generateSelfmadeArticle(cluster: TopicCluster): RawNewsItem | null {
  if (cluster.items.length < 2) return null;
  const uniqueSources = new Set(cluster.items.map(i => i.source));
  if (uniqueSources.size < 2) return null;

  // Find matching template
  const template = TOPIC_TEMPLATES.find(t =>
    t.keywords.some(kw => cluster.keywords.includes(kw)),
  );

  if (!template) {
    // Generic digest
    const sources = [...uniqueSources].join(' + ');
    return {
      title: `[Récap] ${cluster.topic.length > 60 ? cluster.topic.slice(0, 60) + '…' : cluster.topic}`,
      link: cluster.items[0].link,
      description: `Synthèse : ${cluster.items.length} sources (${sources}) rapportent ce sujet. ${cluster.items[0].description}`,
      pubDate: cluster.items[0].pubDate,
      source: 'Riftbound Guide',
      sourceType: 'selfmade',
      keywords: cluster.keywords,
    };
  }

  return {
    title: template.title(cluster),
    link: cluster.items[0].link,
    description: template.body(cluster),
    pubDate: cluster.items[0].pubDate,
    source: 'Riftbound Guide',
    sourceType: 'selfmade',
    keywords: cluster.keywords,
  };
}

// ─── CROSS-REFERENCE ──────────────────────────────────────────────────────────

function crossReference(allItems: RawNewsItem[]): ProcessedNewsItem[] {
  const clusters = buildTopicClusters(allItems);

  const result: ProcessedNewsItem[] = [];
  const selfmadeArticles: RawNewsItem[] = [];

  for (const cluster of clusters) {
    const uniqueSources = [...new Set(cluster.items.map(i => i.source))];
    const confidence: ProcessedNewsItem['confidence'] =
      uniqueSources.length >= 2 ? 'confirmed' : 'single';

    // Pick the best representative item (prefer official, then most recent)
    const best =
      cluster.items.find(i => i.sourceType === 'official') || cluster.items[0];

    result.push({
      ...best,
      confidence,
      sources: uniqueSources,
    });

    // Generate selfmade digest for multi-source confirmed topics
    const selfmade = generateSelfmadeArticle(cluster);
    if (selfmade) selfmadeArticles.push(selfmade);
  }

  // Add selfmade articles (deduplicated by title)
  for (const sm of selfmadeArticles) {
    const duplicate = result.some(r => titlesSimilar(r.title, sm.title, r.keywords, sm.keywords));
    if (!duplicate) {
      result.push({
        ...sm,
        confidence: 'confirmed',
        sources: [...new Set(
          clusters.find(c => titlesSimilar(c.topic, sm.title, c.keywords, sm.keywords))
            ?.items.map(i => i.source) || [sm.source],
        )],
      });
    }
  }

  // Sort: confirmed first, then by date
  return result.sort((a, b) => {
    const co = { confirmed: 0, single: 1, rumor: 2 };
    if (co[a.confidence] !== co[b.confidence]) return co[a.confidence] - co[b.confidence];
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });
}

// ─── DECK-BASED NEWS GENERATOR ───────────────────────────────────────────────
//
// Generates news items from the deck database so that adding a deck automatically
// creates an associated news article.

function generateDeckNewsItems(): RawNewsItem[] {
  const TIER_LABELS: Record<string, string> = { S: 'S-tier', A: 'A-tier', B: 'B-tier', C: 'C-tier' };
  const ARCHETYPE_FR: Record<string, string> = {
    Midrange: 'Midrange', Miracle: 'Miracle', Aggro: 'Aggro',
    Control: 'Contrôle', Combo: 'Combo', Tempo: 'Tempo',
  };

  return RAW_META_DECKS.slice(0, 8).map((deck, i) => {
    const tier = TIER_LABELS[deck.tier] ?? deck.tier;
    const archetype = ARCHETYPE_FR[deck.archetype] ?? deck.archetype;
    const pubDate = new Date(Date.now() - i * 2 * 86400000).toISOString();

    const title = i % 2 === 0
      ? `${deck.fullName} — Deck ${tier} du moment`
      : `Guide ${archetype} : ${deck.champion} en meta`;

    const description =
      `${deck.description} Cartes clés : ${deck.keyCards.slice(0, 3).join(', ')}. ` +
      `Résultats : ${deck.placement}.`;

    return {
      title,
      link: `/decks?deck=${deck.id}`,
      description,
      pubDate,
      source: 'Riftbound Guide',
      sourceType: 'official' as const,
      keywords: extractKeywords(title + ' ' + description),
    };
  });
}

// ─── GET HANDLER ──────────────────────────────────────────────────────────────

export async function GET() {
  const allItems: RawNewsItem[] = [];

  await Promise.all([
    // riftbound.gg RSS
    fetchRSS(SOURCES[0].url, SOURCES[0].name, SOURCES[0].type).then(items =>
      allItems.push(...items),
    ),

    // Riot Games RSS (filtered to Riftbound mentions)
    fetchRSS(
      SOURCES[1].url,
      SOURCES[1].name,
      SOURCES[1].type,
      SOURCES[1].filter,
    ).then(items => allItems.push(...items)),

    // Reddit
    fetchReddit(SOURCES[2].url).then(items => allItems.push(...items)),

    // riftbound.gg/news HTML scrape
    fetchHTMLNews(SOURCES[3].url, SOURCES[3].name).then(items =>
      allItems.push(...items),
    ),
  ]);

  // Inject deck-based news (always available, no network required)
  allItems.push(...generateDeckNewsItems());

  const processed = crossReference(allItems);

  const formatted = processed.slice(0, 25).map(item => ({
    title: item.title,
    link: item.link,
    description: item.description,
    pubDate: item.pubDate,
    source: item.source,
    sourceType: item.sourceType,
    confidence: item.confidence,
    sources: item.sources,
  }));

  return NextResponse.json({
    news: formatted,
    meta: {
      total: formatted.length,
      confirmed: formatted.filter(n => n.confidence === 'confirmed').length,
      selfmade: formatted.filter(n => n.sourceType === 'selfmade').length,
      fetchedAt: new Date().toISOString(),
      sources: ['riftbound.gg', 'Riot Games', 'Reddit', 'riftbound.gg/news', 'Riftbound Guide'],
    },
  });
}

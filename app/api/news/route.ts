import { NextResponse } from 'next/server';

// Types
interface RawNewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  sourceType: 'official' | 'community';
  keywords: string[];
}

interface ProcessedNewsItem extends RawNewsItem {
  confidence: 'confirmed' | 'single' | 'rumor';
  sources: string[];
}

// Source configurations
const SOURCES = [
  {
    name: 'riftbound.gg',
    url: 'https://riftbound.gg/feed/',
    type: 'official' as const,
    keywords: ['set', 'expansion', 'patch', 'balance', 'news', 'update', 'release'],
  },
  {
    name: 'reddit',
    url: 'https://www.reddit.com/r/Riftbound/.json',
    type: 'community' as const,
    keywords: ['discussion', 'meta', 'deck', 'guide', 'tier'],
  },
];

// Simple keyword extraction from title
function extractKeywords(title: string): string[] {
  const lower = title.toLowerCase();
  const keywords: string[] = [];
  
  const importantWords = [
    'set', 'expansion', 'patch', 'balance', 'update', 'release', 'new',
    'card', 'legend', 'champion', 'deck', 'meta', 'tier', 'guide',
    'tournament', 'win', 'champion', 'nerf', 'buff', 'bug', 'fix',
    'spirit', 'forge', 'chaos', 'order', 'fury', 'calm', 'magic',
  ];
  
  for (const word of importantWords) {
    if (lower.includes(word)) {
      keywords.push(word);
    }
  }
  
  return keywords;
}

// Normalize title for comparison
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/edition|set|the|a|an|of|in|to|for|with|and|or/g, '')
    .trim()
    .slice(0, 30);
}

// Fetch from RSS
async function fetchRSS(url: string, sourceName: string, sourceType: 'official' | 'community'): Promise<RawNewsItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Riftbound-News-Aggregator/1.0' },
    });
    
    if (!res.ok) return [];
    
    const text = await res.text();
    const items: RawNewsItem[] = [];
    
    // Handle Reddit JSON
    if (sourceName === 'reddit') {
      try {
        const data = JSON.parse(text);
        const posts = data.data?.children?.slice(0, 10) || [];
        
        for (const post of posts) {
          const p = post.data;
          if (!p.title || p.is_self === false) continue;
          
          items.push({
            title: p.title,
            link: `https://reddit.com${p.permalink}`,
            description: p.selftext?.slice(0, 200) || '',
            pubDate: new Date(p.created_utc * 1000).toISOString(),
            source: sourceName,
            sourceType,
            keywords: extractKeywords(p.title),
          });
        }
      } catch {
        // Reddit parsing failed
      }
      return items;
    }
    
    // Handle RSS
    const itemMatches = text.matchAll(/<item>([\s\S]*?)<\/item>/g);
    
    for (const match of itemMatches) {
      const block = match[1];
      
      const getTag = (tag: string) => {
        const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`));
        return m ? (m[1] || m[2] || '').trim() : '';
      };
      
      const title = getTag('title');
      const link = getTag('link') || block.match(/<link>([^<]+)<\/link>/)?.[1]?.trim() || '';
      const rawDesc = getTag('description');
      const description = rawDesc.replace(/<[^>]+>/g, '').slice(0, 200).trim();
      const pubDate = getTag('pubDate');
      
      if (title && link) {
        items.push({
          title,
          link,
          description,
          pubDate: pubDate || new Date().toISOString(),
          source: sourceName,
          sourceType,
          keywords: extractKeywords(title),
        });
      }
      
      if (items.length >= 15) break;
    }
    
    return items;
  } catch {
    return [];
  }
}

// Cross-reference and determine confidence
function crossReference(allItems: RawNewsItem[]): ProcessedNewsItem[] {
  const normalizedMap = new Map<string, ProcessedNewsItem>();
  
  for (const item of allItems) {
    const normalized = normalizeTitle(item.title);
    const key = normalized.slice(0, 25); // First 25 chars for matching
    
    // Find similar items
    let found = false;
    for (const [existingKey, existing] of normalizedMap) {
      // Check if titles are similar (overlap)
      const overlap = normalized.split('').filter((c, i) => existingKey.includes(c)).length;
      const similarity = overlap / Math.max(normalized.length, existingKey.length);
      
      if (similarity > 0.6 || normalized.includes(existingKey) || existingKey.includes(normalized)) {
        // Same news from different source
        if (!existing.sources.includes(item.source)) {
          existing.sources.push(item.source);
          existing.confidence = existing.sources.length >= 2 ? 'confirmed' : 'single';
        }
        found = true;
        break;
      }
    }
    
    if (!found) {
      normalizedMap.set(key, {
        ...item,
        confidence: 'single',
        sources: [item.source],
      });
    }
  }
  
  // Sort by confidence then date
  return Array.from(normalizedMap.values())
    .sort((a, b) => {
      const confidenceOrder = { confirmed: 0, single: 1, rumor: 2 };
      if (confidenceOrder[a.confidence] !== confidenceOrder[b.confidence]) {
        return confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
      }
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    });
}

// GET handler
export async function GET() {
  const allItems: RawNewsItem[] = [];
  
  // Fetch from all sources
  await Promise.all(
    SOURCES.map(async (source) => {
      const items = await fetchRSS(source.url, source.name, source.type);
      allItems.push(...items);
    })
  );
  
  // Process and cross-reference
  const processed = crossReference(allItems);
  
  // Format response
  const formatted = processed.slice(0, 20).map(item => ({
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
      fetchedAt: new Date().toISOString(),
    },
  });
}

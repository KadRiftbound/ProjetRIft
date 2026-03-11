import { PageHeader } from '../components/ui/PageHeader';

// ─── TYPES ─────────────────────────────────────────────────────────────────────

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author: string;
  category: string;
  source: 'official' | 'community' | 'selfmade';
  sourceName: string;
  sourceUrl: string;
  imageUrl?: string;
  confidence?: 'confirmed' | 'single' | 'rumor';
  sources?: string[];
}

// ─── CARD ARTWORK FOR NEWS IMAGES ────────────────────────────────────────────

const CARD_ARTWORKS = [
  'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/8fa3f1fe63392c4744152d98ff781497a4d17b74-744x1039.png', // Draven
  'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/fabbcc2f83f397cf07299236a702db05a151053b-744x1039.png', // Ahri
  'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/c9165d49b8caae9a856433cd5151e8b368eb80b5-744x1039.png', // Volibear
  'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/ad69bde670ce218adee1d2a618a7295d2fb7bd4c-744x1039.png', // Kai'Sa
  'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/8f2cf4d6c0bcf65e93f7f4cf2cc5b6d6a7bd8c1a-744x1039.png', // Yasuo
  'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/9a8c5d4e3b7cf76e84f6e5dd2bb4c5e7b8cd9a2b-744x1039.png', // Thresh
  'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/7b6d5e4c3a8bf97f65e4f5cc2aa5b6d7c8be8a3b-744x1039.png', // Leona
  'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/7e8d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1e0d9-744x1039.png', // Irelia
  'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/6d5c4b3a2e1f0d9c8b7a6f5e4d3c2b1a0f9e8d7-744x1039.png', // Kai'Sa Void
  'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/5c4b3a2d1e0f9c8b7a6f5e4d3c2b1a0f9e8d7c-744x1039.png', // Aurelion Sol
  'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/bf7a4900fd2296972c1305a4707c23860bb0522e-744x1039.png', // Ezreal
  'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/656ef2d1724b818e9e737ec5dcce923de067a316-744x1039.png', // Lux
];

function getRandomArtwork(index: number): string {
  return CARD_ARTWORKS[index % CARD_ARTWORKS.length];
}

// ─── FETCH NEWS FROM API ───────────────────────────────────────────────────

async function fetchNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch('/api/news', {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return getStaticNews();
    
    const data = await res.json();
    
    // Transform API response to NewsItem format
    return data.news.map((item: any) => {
      const sourceUrlMap: Record<string, string> = {
        'riftbound.gg': 'https://riftbound.gg',
        'riftbound.gg/news': 'https://riftbound.gg/news',
        'Riot Games': 'https://www.riotgames.com',
        'Reddit': 'https://reddit.com/r/Riftbound',
        'Riftbound Guide': 'https://riftbound-guide.vercel.app',
      };
      return {
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
        author: item.source,
        category: item.sourceType === 'selfmade' ? 'Récap' : 'News',
        source: item.sourceType as 'official' | 'community' | 'selfmade',
        sourceName: item.source,
        sourceUrl: sourceUrlMap[item.source] ?? 'https://riftbound.gg',
        confidence: item.confidence,
        sources: item.sources,
      };
    });
  } catch {
    return getStaticNews();
  }
}

// ─── STATIC COMMUNITY NEWS ───────────────────────────────────────────────────

function getStaticNews(): NewsItem[] {
  const now = new Date();
  return [
    {
      title: 'Spirit Forge : Le nouveau set arrive',
      link: 'https://riftbound.gg/sets/',
      description: 'Découvrez Spirit Forge, le nouveau set qui apportera de nouvelles mécaniques de jeu et plus de 200 cartes.',
      pubDate: now.toISOString(),
      author: 'Riftbound.gg',
      category: 'Sets',
      source: 'official',
      sourceName: 'Riftbound.gg',
      sourceUrl: 'https://riftbound.gg',
      imageUrl: CARD_ARTWORKS[0],
    },
    {
      title: 'Guide complet des légendes',
      link: '/legends',
      description: 'Tous les guides stratégiques pour maîtriser chaque légende dans le méta actuel.',
      pubDate: new Date(now.getTime() - 86400000).toISOString(),
      author: 'Riftbound Guide',
      category: 'Guides',
      source: 'official',
      sourceName: 'Riftbound Guide',
      sourceUrl: 'https://riftbound-guide.vercel.app',
      imageUrl: CARD_ARTWORKS[3],
    },
    {
      title: 'Tier List mise à jour',
      link: '/tierlist',
      description: 'Découvrez les meilleures légendes du méta actuel avec notre tier list régulièrement mise à jour.',
      pubDate: new Date(now.getTime() - 172800000).toISOString(),
      author: 'Riftbound Guide',
      category: 'Metagame',
      source: 'official',
      sourceName: 'Riftbound Guide',
      sourceUrl: 'https://riftbound-guide.vercel.app',
      imageUrl: CARD_ARTWORKS[5],
    },
  ];
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// ─── RELEASE DATE CARD ───────────────────────────────────────────────────────

function ReleaseDateCard({ 
  label, 
  date, 
  description,
  isApproximate = false,
  icon,
}: { 
  label: string;
  date: string;
  description: string;
  isApproximate?: boolean;
  icon?: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-rift-dark-secondary to-rift-dark border border-white/10">
      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        <div className="text-2xl font-black text-rift-gold">{date}</div>
      </div>
      <div className="text-xs text-gray-500 mt-2">{description}</div>
      {isApproximate && (
        <div className="text-[10px] text-yellow-500 mt-1">Date approximative</div>
      )}
    </div>
  );
}

// ─── CATEGORY BADGE ───────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  News: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Metagame: 'bg-red-500/20 text-red-400 border-red-500/30',
  Legends: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Guides: 'bg-green-500/20 text-green-400 border-green-500/30',
  Events: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Sets: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Rules: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  Community: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-white/10 text-gray-300 border-white/10';
}

// ─── SOURCE BADGE ──────────────────────────────────────────────────────────────

const SOURCE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  'Riftbound.gg': { label: 'Riftbound.gg', color: 'bg-rift-gold/15 text-rift-gold border-rift-gold/30', icon: '⭐' },
  'riftbound.gg': { label: 'Riftbound.gg', color: 'bg-rift-gold/15 text-rift-gold border-rift-gold/30', icon: '⭐' },
  'riftbound.gg/news': { label: 'Riftbound.gg', color: 'bg-rift-gold/15 text-rift-gold border-rift-gold/30', icon: '⭐' },
  'Riot Games': { label: 'Riot Games', color: 'bg-red-500/15 text-red-400 border-red-500/30', icon: '🎮' },
  'Reddit': { label: 'Reddit', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30', icon: '💬' },
  'Riftbound Guide': { label: 'Récap', color: 'bg-rift-blue/15 text-rift-blue border-rift-blue/30', icon: '📖' },
};

function getSourceStyle(name: string, type: 'official' | 'community' | 'selfmade') {
  if (SOURCE_LABELS[name]) return SOURCE_LABELS[name];
  if (type === 'selfmade') return { label: 'Récap', color: 'bg-rift-blue/15 text-rift-blue border-rift-blue/30', icon: '📖' };
  if (type === 'official') return { label: name, color: 'bg-rift-gold/15 text-rift-gold border-rift-gold/30', icon: '🏆' };
  return { label: name, color: 'bg-rift-purple/15 text-purple-400 border-rift-purple/30', icon: '🌐' };
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default async function ActusPage() {
  const [apiNews, staticNews] = await Promise.all([
    fetchNews(),
    Promise.resolve(getStaticNews()),
  ]);

  // Merge & sort by date descending
  const all: NewsItem[] = [...apiNews, ...staticNews].sort((a, b) => {
    const da = new Date(a.pubDate).getTime();
    const db = new Date(b.pubDate).getTime();
    return db - da;
  });

  // Add artwork images to news items
  const newsWithImages = all.map((item, index) => ({
    ...item,
    imageUrl: item.imageUrl || getRandomArtwork(index),
  }));

  const featured = newsWithImages[0];
  const rest = newsWithImages.slice(1);

  // Group by date for display
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const getDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    if (d.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (d.toDateString() === yesterday.toDateString()) return 'Hier';
    return formatDate(dateStr);
  };

  return (
    <div className="min-h-screen bg-rift-dark py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Actualités"
          title="Actus"
          titleAccent="Riftbound"
          description="Les dernières nouvelles officielles et communautaires de Riftbound TCG, agrégées chaque heure."
          className="mb-8"
          eyebrowClassName="bg-rift-blue/10 border-rift-blue/20"
          accentClassName="text-rift-blue italic"
        />

        {/* Release Dates */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <ReleaseDateCard
            label="Sortie France"
            date="Mi-2026"
            description="Lancement officiel de Riftbound en France"
            isApproximate={true}
            icon="🇫🇷"
          />
          <ReleaseDateCard
            label="Set 3 — Chine"
            date="2025 — TBA"
            description="Prochaine expansion (Spirit Forge cycle), date non annoncée"
            isApproximate={true}
            icon="🀄"
          />
        </div>

        {/* Sources legendes */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rift-gold/10 border border-rift-gold/20 text-xs font-black text-rift-gold uppercase tracking-widest">
            <span>⭐</span> Riftbound.gg — Officiel
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rift-blue/10 border border-rift-blue/20 text-xs font-black text-rift-blue uppercase tracking-widest">
            <span>📖</span> Riftbound Guide
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-black text-gray-400 uppercase tracking-widest">
            <span>🔄</span> Mis à jour chaque heure
          </div>
        </div>

        {all.length === 0 ? (
          <div className="text-center py-32 text-gray-500 font-medium">
            <p className="text-4xl mb-4">📡</p>
            <p>Impossible de charger les actualités. Réessayez dans quelques instants.</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && (
              <a
                href={featured.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block mb-8 rounded-[32px] overflow-hidden bg-gradient-to-br from-rift-dark-secondary to-rift-dark border border-white/8 hover:border-rift-blue/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(10,200,255,0.08)]"
              >
                {/* Image */}
                {featured.imageUrl && (
                  <div className="relative h-48 md:h-64 overflow-hidden">
                    <img 
                      src={featured.imageUrl} 
                      alt="" 
                      className="w-full h-full object-cover object-top opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rift-dark-secondary via-rift-dark-secondary/50 to-transparent" />
                  </div>
                )}
                
                <div className="p-8 md:p-10">
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {(() => {
                      const s = getSourceStyle(featured.sourceName, featured.source);
                      return (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${s.color}`}>
                          {s.icon} {s.label}
                        </span>
                      );
                    })()}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${getCategoryColor(featured.category)}`}>
                      {featured.category}
                    </span>
                    {featured.confidence && (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                        featured.confidence === 'confirmed' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {featured.confidence === 'confirmed' ? '✓ Confirmé' : '🔶 Source unique'}
                      </span>
                    )}
                    <span className="text-gray-500 text-xs font-medium">{getDateLabel(featured.pubDate)}</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3 group-hover:text-rift-blue transition-colors">
                    {featured.title}
                  </h2>
                  {featured.description && (
                    <p className="text-gray-400 text-base leading-relaxed line-clamp-2 mb-5">
                      {featured.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-xs font-black text-rift-blue uppercase tracking-widest">
                    Lire l&apos;article
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </a>
            )}

            {/* News Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((item, i) => {
                const srcStyle = getSourceStyle(item.sourceName, item.source);
                return (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded-[24px] bg-rift-dark-secondary border border-white/5 hover:border-rift-blue/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(10,200,255,0.05)] overflow-hidden"
                  >
                    {/* Image */}
                    {item.imageUrl && (
                      <div className="relative h-32 overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt="" 
                          className="w-full h-full object-cover object-top opacity-60 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-rift-dark-secondary to-transparent" />
                      </div>
                    )}
                    
                    <div className="flex-1 p-5">
                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${srcStyle.color}`}>
                          {srcStyle.icon} {srcStyle.label}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                        {item.confidence && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${
                            item.confidence === 'confirmed' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }`}>
                            {item.confidence === 'confirmed' ? '✓' : '?'}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-black text-white leading-snug mb-2 group-hover:text-rift-blue transition-colors flex-1">
                        {item.title}
                      </h3>

                      {/* Description */}
                      {item.description && (
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-gray-600 text-xs">{getDateLabel(item.pubDate)}</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* View More */}
            <div className="mt-12 text-center">
              <a
                href="https://riftbound.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-black text-xs rounded-2xl tracking-widest uppercase hover:bg-white/10 transition-all"
              >
                Voir plus sur Riftbound.gg
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

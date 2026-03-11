const DOMAIN_COLORS: Record<string, string> = {
  Fury: '#DC2626',
  Hope: '#16A34A',
  Glory: '#EAB308',
  Cunning: '#2563EB',
  Knowledge: '#9333EA',
  Order: '#EA580C',
  Colorless: '#6B7280',
};

const RARITY_BG: Record<string, string> = {
  Champion: 'linear-gradient(135deg, #C8AA6E 0%, #8B6914 100%)',
  Epic: 'linear-gradient(135deg, #A855F7 0%, #6B21A8 100%)',
  Rare: 'linear-gradient(135deg, #0AC8FF 0%, #0284C7 100%)',
  Uncommon: 'linear-gradient(135deg, #A3E635 0%, #65A30D 100%)',
  Common: 'linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)',
};

export function getPlaceholderCardImage(name: string, domain: string, rarity: string): string {
  const color = DOMAIN_COLORS[domain] || DOMAIN_COLORS.Colorless;
  const bgGradient = RARITY_BG[rarity] || RARITY_BG.Common;
  
  // Create a placeholder SVG with the card info
  const svg = `
    <svg width="240" height="336" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.4" />
        </linearGradient>
      </defs>
      <rect width="240" height="336" fill="url(#bg)" rx="12"/>
      <rect x="8" y="8" width="224" height="320" fill="none" stroke="${color}" stroke-width="2" rx="8"/>
      <text x="120" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="18" font-weight="bold">
        ${name.substring(0, 20)}
      </text>
      <text x="120" y="190" text-anchor="middle" fill="white" font-family="Arial" font-size="14">
        ${domain}
      </text>
      <text x="120" y="300" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">
        ${rarity}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getCardImageUrl(cardId: string, setId: string = 'OGN'): string {
  // Try Piltover Archive first
  const paddedNumber = cardId.replace(/[^0-9]/g, '').padStart(3, '0');
  const setCode = setId.toUpperCase();
  
  return `https://piltoverarchive.com/images/cards/${setCode}-${paddedNumber}.webp`;
}

export function getCardImages(cardId: string, setId: string = 'OGN') {
  const paddedNumber = cardId.replace(/[^0-9]/g, '').padStart(3, '0');
  const setCode = setId.toUpperCase();
  const baseUrl = `https://piltoverarchive.com/images/cards/${setCode}-${paddedNumber}`;
  
  return {
    small: `${baseUrl}_sm.webp`,
    medium: `${baseUrl}.webp`,
    large: `${baseUrl}_lg.webp`,
  };
}

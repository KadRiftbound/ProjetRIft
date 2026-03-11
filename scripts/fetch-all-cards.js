const fs = require('fs');
const https = require('https');

const url = 'https://gist.githubusercontent.com/OwenMelbz/e04dadf641cc9b81cb882b4612343112/raw/riftbound.json';
const path = require('path');
const outputPath = path.join(__dirname, '..', 'app', 'lib', 'riftbound-full.ts');

console.log('Fetching card data...');

https.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const cards = JSON.parse(data);
      console.log(`Total cards: ${cards.length}`);
      
      // Group by set
      const ognCards = cards.filter(c => c.set === 'OGN');
      const ogsCards = cards.filter(c => c.set === 'OGS');
      const sfdCards = cards.filter(c => c.set === 'SFD');
      
      console.log(`OGN: ${ognCards.length}, OGS: ${ogsCards.length}, SFD: ${sfdCards.length}`);
      
      // Generate TypeScript
      let ts = '// Auto-generated from gist\n\n';
      ts += 'export interface RiftboundCard {\n';
      ts += '  id: string;\n';
      ts += '  name: string;\n';
      ts += '  set: string;\n';
      ts += '  setName: string;\n';
      ts += '  number: number;\n';
      ts += "  type: 'Champion' | 'Unit' | 'Spell' | 'Gear' | 'Rune' | 'Legend' | 'Battlefield';\n";
      ts += '  domain: string;\n';
      ts += "  rarity: 'Champion' | 'Epic' | 'Rare' | 'Uncommon' | 'Common' | 'Showcase';\n";
      ts += '  energy: number;\n';
      ts += '  might: number;\n';
      ts += '  power: number;\n';
      ts += '  rules: string;\n';
      ts += '  artist: string;\n';
      ts += '  variants: { id: string; name: string; imageUrl: string; variantType: string }[];\n';
      ts += '}\n\n';
      
      const processCard = (c) => {
        const setCode = c.set.toUpperCase();
        const num = c.collectorNumber;
        const idSuffix = c.id.includes('-a') ? 'a' : '';
        const id = `${setCode}-${num}${idSuffix}`;
        const domain = c.domains?.[0]?.label || 'Colorless';
        const type = c.cardType?.[0]?.label || 'Unit';
        const rarity = c.rarity?.label || 'Common';
        const rules = (c.text || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        const artist = c.illustrator?.[0] || 'Unknown';
        const energy = c.energy || 0;
        const power = c.power || 0;
        const imageUrl = c.cardImage?.url || '';
        const name = c.name.replace(/'/g, "\\'");
        
        return `{ id: '${id}', name: '${name}', set: '${setCode}', setName: '${c.setName}', number: ${num}, type: '${type}', domain: '${domain}', rarity: '${rarity}', energy: ${energy}, might: 0, power: ${power}, rules: '${rules.replace(/'/g, "\\'")}', artist: '${artist.replace(/'/g, "\\'")}', variants: [{ id: '${id}', name: '${name}', imageUrl: '${imageUrl}', variantType: 'regular' }] }`;
      };
      
      ts += 'export const ORIGINS_CARDS: RiftboundCard[] = [\n';
      ognCards.forEach(c => ts += '  ' + processCard(c) + ',\n');
      ts += '];\n\n';
      
      ts += 'export const PROVING_GROUNDS_CARDS: RiftboundCard[] = [\n';
      ogsCards.forEach(c => ts += '  ' + processCard(c) + ',\n');
      ts += '];\n\n';
      
      ts += 'export const SPIRITFORGED_CARDS: RiftboundCard[] = [\n';
      sfdCards.forEach(c => ts += '  ' + processCard(c) + ',\n');
      ts += '];\n\n';
      
      ts += 'export const ALL_CARDS: RiftboundCard[] = [...ORIGINS_CARDS, ...PROVING_GROUNDS_CARDS, ...SPIRITFORGED_CARDS];\n\n';
      ts += 'export const SETS = {\n';
      ts += "  OGN: { id: 'OGN', name: 'Origins' },\n";
      ts += "  OGS: { id: 'OGS', name: 'Proving Grounds' },\n";
      ts += "  SFD: { id: 'SFD', name: 'Spiritforged' },\n";
      ts += '};\n';
      
      fs.writeFileSync(outputPath, ts);
      console.log(`Written to ${outputPath}`);
      
    } catch (e) {
      console.error('Parse error:', e.message);
    }
  });
}).on('error', (e) => {
  console.error('Fetch error:', e.message);
});

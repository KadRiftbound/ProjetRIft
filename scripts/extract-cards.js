const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', '..', '..', '..', '..', 'AppData', 'Local', 'opencode', 'tool-output', 'tool_cd52a0238001vu5jZlOGXHdyWL');

try {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  console.log('// Total cards in JSON:', data.length);
  console.log('');
  
  const cards = data.map(card => {
    const setCode = card.set.toUpperCase();
    const collectorNum = card.collectorNumber;
    const idSuffix = card.id.includes('-a') ? 'a' : '';
    const id = `${setCode}-${collectorNum}${idSuffix}`;
    
    const domain = card.domains?.[0]?.label || 'Colorless';
    const type = card.cardType?.[0]?.label || 'Unit';
    const rarity = card.rarity?.label || 'Common';
    const rules = card.text?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() || '';
    const artist = card.illustrator?.[0] || 'Unknown';
    const energy = card.energy || 0;
    const power = card.power || 0;
    const imageUrl = card.cardImage?.url || '';
    
    return `  { id: '${id}', name: '${card.name.replace(/'/g, "\\'")}', set: '${setCode}', setName: '${card.setName}', number: ${collectorNum}, type: '${type}', domain: '${domain}', rarity: '${rarity}', energy: ${energy}, might: 0, power: ${power}, rules: '${rules.replace(/'/g, "\\'")}', artist: '${artist.replace(/'/g, "\\'")}', variants: [{ id: '${id}', name: '${card.name.replace(/'/g, "\\'")}', imageUrl: '${imageUrl}', variantType: 'regular' }] },`;
  });
  
  console.log('export const ORIGINS_CARDS: RiftboundCard[] = [');
  cards.filter(c => c.includes("set: 'OGN'")).forEach(c => console.log(c));
  console.log('];');
  console.log('');
  console.log('export const PROVING_GROUNDS_CARDS: RiftboundCard[] = [');
  cards.filter(c => c.includes("set: 'OGS'")).forEach(c => console.log(c));
  console.log('];');
  console.log('');
  console.log('export const SPIRITFORGED_CARDS: RiftboundCard[] = [');
  cards.filter(c => c.includes("set: 'SFD'")).forEach(c => console.log(c));
  console.log('];');
  
} catch (e) {
  console.error('Error:', e.message);
}

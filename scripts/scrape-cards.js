const axios = require('axios');
const fs = require('fs');
const path = require('path');

const RIFTBOUND_GALLERY_URL = 'https://riftbound.gg/cards/';
const SCRAPEFLIGHT_API = 'https://api.scrydex.com/riftbound/v1/cards';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 10000
    });
    
    return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filepath))
        .on('close', resolve)
        .on('error', reject);
    });
  } catch (error) {
    console.log(`Failed to download: ${url}`);
    return null;
  }
}

async function scrapeCards() {
  console.log('Starting card image scraper...');
  
  const cardsDir = path.join(__dirname, '..', 'public', 'cards');
  
  if (!fs.existsSync(cardsDir)) {
    fs.mkdirSync(cardsDir, { recursive: true });
  }
  
  // Sample card data - in production, fetch from API
  const sampleCards = [
    { id: 'OGN-001', name: 'Ahri' },
    { id: 'OGN-002', name: 'Darius' },
    { id: 'OGN-003', name: 'Garen' },
    { id: 'OGN-004', name: 'Lux' },
    { id: 'OGN-005', name: 'Teemo' },
    { id: 'OGN-006', name: 'Cleave' },
  ];
  
  // Try multiple image sources
  const imageSources = [
    // Scrydex images
    (id) => `https://cdn.riftbound.app/cards/${id}.png`,
    // Piltover Archive
    (id) => `https://piltoverarchive.com/images/cards/${id}.png`,
    // Riftbound.gg
    (id) => `https://riftbound.gg/images/cards/${id}.webp`,
  ];
  
  let successCount = 0;
  
  for (const card of sampleCards) {
    console.log(`Processing: ${card.name} (${card.id})`);
    
    let downloaded = false;
    
    for (const source of imageSources) {
      if (downloaded) break;
      
      const url = source(card.id);
      const filepath = path.join(cardsDir, `${card.id}.png`);
      
      if (fs.existsSync(filepath)) {
        console.log(`  Already exists: ${card.id}`);
        downloaded = true;
        successCount++;
        break;
      }
      
      try {
        await downloadImage(url, filepath);
        await sleep(500);
        
        if (fs.existsSync(filepath)) {
          const stats = fs.statSync(filepath);
          if (stats.size > 1000) {
            console.log(`  Downloaded: ${card.id}`);
            downloaded = true;
            successCount++;
          }
        }
      } catch (e) {
        console.log(`  Failed: ${url}`);
      }
    }
    
    if (!downloaded) {
      console.log(`  Could not find image for: ${card.name}`);
    }
  }
  
  console.log(`\nDone! Downloaded ${successCount}/${sampleCards.length} images`);
  console.log(`Images saved to: ${cardsDir}`);
}

// Run if called directly
if (require.main === module) {
  scrapeCards().catch(console.error);
}

module.exports = { scrapeCards, downloadImage };

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://riftdecks.com';
const JINA_BASE = 'https://r.jina.ai/http://riftdecks.com';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchText(url, retries = 5) {
  const res = await fetch(url, { headers: { 'User-Agent': 'RiftboundDataBot/1.0' } });
  if (!res.ok) {
    if (retries > 0 && (res.status === 503 || res.status === 429)) {
      await wait(3000 * (6 - retries));
      return fetchText(url, retries - 1);
    }
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  const text = await res.text();
  await wait(1200);
  return text;
}

function toAbsoluteUrl(url) {
  if (!url) return url;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url}`;
}

function parseListPage(markdown) {
  const lines = markdown.split(/\r?\n/);
  const rows = lines.filter(line => line.trim().startsWith('| **') && line.includes('riftbound-tournaments/'));
  return rows.map(line => {
    const cols = line.split('|').map(col => col.trim());
    const date = cols[1]?.replace(/\*\*/g, '') || '';
    const metaFormat = cols[2] || '';
    const [meta, ...formatParts] = metaFormat.split(/\s+/);
    const format = formatParts.join(' ').trim();
    const nameCell = cols[3] || '';
    const nameMatch = nameCell.match(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/);
    const name = nameMatch ? nameMatch[1].trim() : '';
    const url = nameMatch ? nameMatch[2].trim() : '';
    const organizerPart = nameCell.includes('@') ? nameCell.split('@')[1] : '';
    const organizer = organizerPart.replace(/New/g, '').trim();
    const players = Number((cols[4] || '').replace(/[^0-9]/g, '')) || 0;
    const countryCode = (cols[6] || '').replace(/[^A-Z]/g, '').trim();
    return { url: toAbsoluteUrl(url), date, meta, format, name, organizer, players, countryCode };
  }).filter(entry => entry.url && entry.name);
}

function parseLastPage(markdown) {
  const explicit = markdown.match(/Page\s+\d+\s+of\s+(\d+)/i);
  if (explicit) {
    return Number(explicit[1]) || 1;
  }
  const pages = [...markdown.matchAll(/riftbound-tournaments\?page=(\d+)/g)].map(m => Number(m[1]) || 1);
  return pages.length ? Math.max(...pages) : 1;
}

function parseEventDetails(markdown) {
  const eventName = (markdown.match(/Event name\s*\n\s*\*\*([^*]+)\*\*/) || [])[1]?.trim() || '';
  const country = (markdown.match(/Event name[\s\S]*?\*\*([^*]+)\*\*\s*\n\s*\*\*([^*]+)\*\*/)||[])[2]?.trim() || '';
  const organizer = (markdown.match(/\*\*Organized\/Hosted by\s*([^*\n]+)\*\*/) || [])[1]?.trim() || '';
  const playersMatch = markdown.match(/\b([0-9][0-9,]*) Players\b/);
  const players = playersMatch ? Number(playersMatch[1].replace(/,/g, '')) : 0;
  const date = (markdown.match(/Date\s*\n\s*([^\n]+)\s*/) || [])[1]?.trim() || '';
  const formatBlock = markdown.match(/Format\s*\n\s*([^\n]+)\s*\n\s*([^\n]+)/);
  const meta = formatBlock ? formatBlock[1].trim() : '';
  const format = formatBlock ? formatBlock[2].trim() : '';

  return { eventName, organizer, players, date, meta, format, country };
}

function parseEventDecks(markdown) {
  const lines = markdown.split(/\r?\n/);
  const rows = lines.filter(line => line.trim().startsWith('| **') && line.includes('riftbound-metagame/deck-'));
  return rows.map(line => {
    const cols = line.split('|').map(col => col.trim());
    const rank = cols[1]?.replace(/\*\*/g, '') || '';
    const nameCell = cols[3] || '';
    const nameMatch = nameCell.match(/\[\*\*([^\]]+)\*\*\]\(([^)]+)\)/);
    const deckName = nameMatch ? nameMatch[1].trim() : '';
    const deckUrl = nameMatch ? nameMatch[2].trim() : '';
    const playerMatch = nameCell.match(/by\s+([^|]+)/i);
    const player = playerMatch ? playerMatch[1].trim() : '';
    const domains = [...(cols[5] || '').matchAll(/rune_([a-z]+)\.png/gi)].map(m => m[1].toLowerCase());
    const uniqueDomains = [...new Set(domains)];
    return {
      rank,
      deckName,
      player,
      deckUrl: toAbsoluteUrl(deckUrl),
      domains: uniqueDomains,
    };
  }).filter(deck => deck.rank && deck.deckName);
}

function parseRssWinners(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(match => match[1]);
  return items.map(item => {
    const title = (item.match(/<title>([^<]+)<\/title>/) || [])[1]?.trim() || '';
    const link = (item.match(/<link>([^<]+)<\/link>/) || [])[1]?.trim() || '';
    const description = (item.match(/<description>([^<]+)<\/description>/) || [])[1]?.trim() || '';
    const winnerMatch = description.match(/Winner of the event:\s*([^<]+?)\s*with\s*([^<.]+)\.?/i);
    const winner = winnerMatch ? winnerMatch[1].trim() : '';
    const winnerDeck = winnerMatch ? winnerMatch[2].trim() : '';
    const playersMatch = description.match(/featuring\s*(\d+)\s*players/i);
    const players = playersMatch ? Number(playersMatch[1]) : 0;
    const countryMatch = description.match(/\(([^)]+)\)\s*took place/i);
    const countryCode = countryMatch ? countryMatch[1].trim() : '';
    return { title, link, description, winner, winnerDeck, players, countryCode };
  }).filter(item => item.link);
}

async function main() {
  const queryTerms = [
    'City Challenge',
    'Regional Open',
    'Regional Qualifier',
    'Regional Challenge',
  ];
  const cnEvents = [];

  for (const term of queryTerms) {
    const encoded = encodeURIComponent(term);
    const firstPageMarkdown = await fetchText(`${JINA_BASE}/riftbound-tournaments?omni=${encoded}&page=1`);
    const lastPage = parseLastPage(firstPageMarkdown);
    for (let page = 1; page <= lastPage; page += 1) {
      const markdown = page === 1 ? firstPageMarkdown : await fetchText(`${JINA_BASE}/riftbound-tournaments?omni=${encoded}&page=${page}`);
      cnEvents.push(...parseListPage(markdown));
    }
  }

  const uniqueCnEvents = [...new Map(cnEvents.map(e => [e.url, e])).values()];
  const cnMajor = uniqueCnEvents.filter(e => e.countryCode === 'CN' && e.players >= 64);

  const bolognaMarkdown = await fetchText(`${JINA_BASE}/riftbound-tournaments?omni=Bologna`);
  const lasVegasMarkdown = await fetchText(`${JINA_BASE}/riftbound-tournaments?omni=Las%20Vegas`);
  const namedMajors = [
    ...parseListPage(bolognaMarkdown),
    ...parseListPage(lasVegasMarkdown),
  ];
  const rssWinners = [];

  const selected = [...new Map([...cnMajor, ...namedMajors].map(e => [e.url, e])).values()];
  const eventResults = [];

  for (const event of namedMajors) {
    const markdown = await fetchText(`${JINA_BASE}${event.url.replace(BASE_URL, '')}`);
    const details = parseEventDetails(markdown);
    const mergedDetails = {
      eventName: details.eventName || event.name,
      organizer: details.organizer || event.organizer,
      players: details.players || event.players,
      date: details.date || event.date,
      meta: details.meta || event.meta,
      format: details.format || event.format,
      country: details.country || (event.countryCode === 'CN' ? 'China' : ''),
    };
    if (mergedDetails.players < event.players) {
      mergedDetails.players = event.players;
    }
    const decks = parseEventDecks(markdown);
    eventResults.push({
      sourceUrl: event.url,
      index: event,
      details: mergedDetails,
      decks,
    });
  }

  const cnResults = [];
  for (const event of cnMajor) {
    const markdown = await fetchText(`${JINA_BASE}${event.url.replace(BASE_URL, '')}`);
    const details = parseEventDetails(markdown);
    const mergedDetails = {
      eventName: details.eventName || event.name,
      organizer: details.organizer || event.organizer,
      players: details.players || event.players,
      date: details.date || event.date,
      meta: details.meta || event.meta,
      format: details.format || event.format,
      country: details.country || 'China',
    };
    if (mergedDetails.players < event.players) {
      mergedDetails.players = event.players;
    }
    const decks = parseEventDecks(markdown).slice(0, 8);
    cnResults.push({
      sourceUrl: event.url,
      index: event,
      details: mergedDetails,
      decks,
    });
  }

  const outDir = path.join(__dirname);
  fs.writeFileSync(path.join(outDir, 'riftdecks-tournaments-index.json'), JSON.stringify(uniqueCnEvents, null, 2));
  fs.writeFileSync(path.join(outDir, 'riftdecks-tournaments-cn-major.json'), JSON.stringify(cnMajor, null, 2));
  fs.writeFileSync(path.join(outDir, 'riftdecks-tournaments-selected-results.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: BASE_URL,
    totalEvents: uniqueCnEvents.length + namedMajors.length,
    cnMajorCount: cnMajor.length,
    selectedCount: selected.length,
    events: eventResults,
    cnResults,
  }, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

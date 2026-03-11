export interface ShareDeckPayload {
  name: string;
  domain: string;
  cards: { id: string; count: number }[];
  battlefields?: { id: string; count: number }[];
  chosenChampionId?: string;
}

export function encodeDeckForShare(deck: ShareDeckPayload) {
  const json = JSON.stringify(deck);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function decodeDeckFromShare(code: string): ShareDeckPayload {
  const base64 = code.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '==='.slice((base64.length + 3) % 4);
  const json = decodeURIComponent(escape(atob(padded)));
  return JSON.parse(json) as ShareDeckPayload;
}

export function parseDeckListText(text: string) {
  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
  const cards: { name: string; count: number }[] = [];
  let deckName = '';
  let deckDomain = '';
  let inChosenChampion = false;

  lines.forEach(line => {
    if (line.startsWith('# ')) {
      deckName = line.replace('# ', '').trim();
      return;
    }
    if (line.startsWith('## ')) {
      deckDomain = line.replace('## ', '').trim();
      return;
    }
    if (line.toLowerCase().startsWith('### champion choisi')) {
      inChosenChampion = true;
      return;
    }
    if (line.startsWith('### ')) {
      inChosenChampion = false;
    }
    const match = line.match(/^(?:-\s*)?(\d+)x\s+(.+)$/i);
    if (match) {
      const entry = { count: Number(match[1]), name: match[2].trim() };
      if (inChosenChampion) {
        cards.push(entry);
      } else {
        cards.push(entry);
      }
    }
  });

  return { deckName, deckDomain, cards };
}

const API_KEY = 'RGAPI-a08a0b5a-91fb-471d-b766-d71696822ef';

async function fetchRiftboundCards() {
  const endpoints = [
    'https://riotapi.net/riftbound/content/v1/contents?locale=en_US',
    'https://api.riotgames.com/riftbound/content/v1/contents?locale=en_US',
    'https://europe.api.riotgames.com/riftbound/content/v1/contents?locale=en_US',
  ];
  
  for (const url of endpoints) {
    console.log(`Trying: ${url}`);
    try {
      const response = await fetch(url, {
        headers: { 'X-Riot-Token': API_KEY }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Success! Data:', JSON.stringify(data).substring(0, 2000));
        return data;
      } else {
        console.log(`Failed: ${response.status} ${response.statusText}`);
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
  
  return null;
}

fetchRiftboundCards();

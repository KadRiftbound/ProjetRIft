import { createServer } from 'http';

const PORT = 3004;

const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Riftbound Server');
});

httpServer.listen(PORT, () => {
  console.log(`\n🔮 Riftbound Server lancé sur le port ${PORT}`);
});

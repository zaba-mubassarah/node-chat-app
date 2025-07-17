import { Server } from 'ws';
import { Server as HTTPServer } from 'http';

let clients: Set<any> = new Set();

export const setupWebSocket = (server: HTTPServer) => {
  const wss = new Server({ server });

  wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
      clients.forEach(client => {
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send(message.toString());
        }
      });
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });
};

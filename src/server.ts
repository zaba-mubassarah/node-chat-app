import express from 'express';
import cors from 'cors';
import http from 'http';
import { setupWebSocket } from './websocket';
import messageRoutes from './routes/messages';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use('/api/messages', messageRoutes);

setupWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

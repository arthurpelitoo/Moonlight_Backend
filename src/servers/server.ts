import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from '../routes/user.Routes.js';
import authRoutes from '../routes/auth.Routes.js';
import gameRoutes from '../routes/games.Routes.js';
import authRoutes from '../routes/auth.Routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('API do Projeto Moonlight rodando 🌙');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor na porta ${PORT}`);
});
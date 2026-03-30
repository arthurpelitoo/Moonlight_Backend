import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from '../routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API do Projeto Moonlight rodando 🌙');
});

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor na porta ${PORT}`);
});




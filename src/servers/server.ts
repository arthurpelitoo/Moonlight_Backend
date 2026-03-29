import Express from 'express';
import dotenv from 'dotenv';

const app = Express();
dotenv.config();
// Rota de teste tipada
app.get('/', (req, res) => {
    res.send('API do Projeto Moonlight rodando 🌙');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor na porta ${PORT}`);
});



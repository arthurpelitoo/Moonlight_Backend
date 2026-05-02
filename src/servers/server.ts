import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from '../routes/user.Routes.js';
import gameRoutes from '../routes/games.Routes.js';
import authRoutes from '../routes/auth.Routes.js';
import categoryRoutes from '../routes/category.Routes.js';
import checkoutRoutes from '../routes/checkout.Routes.js';
import orderRoutes from '../routes/order.Routes.js';
import { errorMiddleware } from '../middlewares/error.Middleware.js';

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
app.use('/api/categories', categoryRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

// if (process.env.NODE_ENV !== 'test') {
app.listen(PORT, () => {
    console.log(`Servidor na porta ${PORT}`);
});
// }

export default app;
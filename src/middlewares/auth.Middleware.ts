import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.Service.js';

dotenv.config();

interface JwtPayload {
  id_user: number;
  type: "admin" | "customer";
}

const userService = UserService.getInstance();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const parts = token.split(" ");
  if (parts.length !== 2 || !parts[1]) {
    return res.status(403).json({ message: 'Token inválido' });
  }

  const tokenValue = parts[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'JWT_SECRET não configurado' });
  }

  try {
      jwt.verify(tokenValue, secret, async (err, decoded) => {
          if (err || !decoded) {
              return res.status(403).json({ message: 'Token inválido' });
          }
          const payload = decoded as JwtPayload;

          const user = await userService.findById(payload.id_user);
          if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

          req.user = { id_user: payload.id_user, type: payload.type };
          next();
      });
  } catch {
      return res.status(403).json({ message: 'Token inválido' });
  }
};

export default authMiddleware;
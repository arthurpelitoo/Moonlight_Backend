import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';

dotenv.config();

interface JWTPayload {
  id_User: number;
  type: 'customer' | 'admin'; 
}

//declaração de variável global
declare global {
  namespace Express {
    interface Request {
      User: JWTPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.substring(7);

  try {
    const secret = process.env.JWT_SECRET;  
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET não configurado' });
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;
    req.User = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

export default authMiddleware;
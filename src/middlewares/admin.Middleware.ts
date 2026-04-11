import type { NextFunction, Request, Response } from "express";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.User?. type !== 'admin') {
    return res.status(403).json({ message: 'Acesso restrito a administradores' });
}
  next();
};
import type { NextFunction, Request, Response } from "express";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.type !== 'admin') {
    return res.status(403).json({ message: 'Acesso restrito a administradores' });
}
  next();
};
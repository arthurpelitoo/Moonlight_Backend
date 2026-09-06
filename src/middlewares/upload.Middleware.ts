import type { Request, Response, NextFunction } from "express";
import { multerUpload } from "../config/multer.js";
import multer from "multer";
import { AppError } from "../utils/AppError.js";

export function uploadMiddleware(req: Request, res: Response, next: NextFunction): void {

  multerUpload.single('image')(req, res, (err) => {

    if (err instanceof multer.MulterError) {

      const messages: Record<string, string> = {
        LIMIT_FILE_SIZE: 'Arquivo muito grande. Máximo permitido: 5MB',
        LIMIT_FILE_COUNT: 'Envie apenas uma imagem por vez',
        LIMIT_UNEXPECTED_FILE: 'Campo de arquivo inesperado. Use o campo "image"'
      };
      return next(new AppError(messages[err.code] ?? err.message, 400, err.code));

    }

    if (err) return next(new AppError(err.message, 400, 'INVALID_FILE_TYPE'));
    next();

  });

}

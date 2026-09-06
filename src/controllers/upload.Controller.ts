import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export class UploadController {

  uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) throw new AppError('Nenhuma midia foi enviada', 400, 'NO_FILE_SENT');

      const url = `/uploads/${req.params.context}/${req.file.filename}`;
      res.status(201).json({ url });
    } catch (error) {
      next(error);
    }
  };

}

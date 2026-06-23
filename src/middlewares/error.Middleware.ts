import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";

export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            message: err.message,
            code: err.code
        })
    }

    console.error(err);

    return res.status(500).json({
        message: 'Erro interno do servidor.'
    });
}
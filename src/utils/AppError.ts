export class AppError extends Error{
    public statusCode: number;
    public code: string;

    constructor(message: string, statusCode: number, code = 'APP_ERROR'){
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}
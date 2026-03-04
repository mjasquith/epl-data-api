import { NextFunction, Request, Response } from 'express';
import { log } from '../utils/logger';

interface ApiError extends Error {
    status?: number;
    code?: string;
}

export default function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    const error = err as ApiError;
    const status = error?.status ?? 500;
    const code = error?.code ?? undefined;
    const message =
        error?.message ?? 'An unexpected error occurred';

    // Minimal logging (replace with your logger)
    log({ 
        level: 'ERROR',
        message: 'Unhandled error occurred', 
        context: 'errorHandler', 
        customAttributes: { message, status, code, err } 
    });

    res.status(status).json({
        error: {
            message,
            status,
            code,
        },
    });
}
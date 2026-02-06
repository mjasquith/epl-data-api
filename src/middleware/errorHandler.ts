import { Request, Response, NextFunction } from 'express';

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
    // eslint-disable-next-line no-console
    console.error('[error]', { message, status, code, err });

    res.status(status).json({
        error: {
            message,
            status,
            code,
        },
    });
}
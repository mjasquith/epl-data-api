"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
function errorHandler(err, _req, res, _next) {
    const error = err;
    const status = error?.status ?? 500;
    const code = error?.code ?? undefined;
    const message = error?.message ?? 'An unexpected error occurred';
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
//# sourceMappingURL=errorHandler.js.map
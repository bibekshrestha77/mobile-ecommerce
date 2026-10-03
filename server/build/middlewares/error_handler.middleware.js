"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, CustomError);
    }
}
const errorHandler = (error, req, res, next) => {
    const statusCode = error?.statusCode || 500;
    const message = error?.message || "Internal server error";
    const status = error?.status || "error";
    res.status(statusCode).json({
        message,
        success: false,
        status,
        originalError: error?.stack,
    });
};
exports.errorHandler = errorHandler;
exports.default = CustomError;

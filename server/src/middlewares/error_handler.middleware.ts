import { NextFunction, Request, Response } from "express";

class CustomError extends Error {
  status: 'error' | 'fail';
  statusCode: number;
  isOperational: boolean

  constructor(message:string, statusCode:number) {
    super(message);
    this.status = `${statusCode}` .startsWith("4") ? "fail" : "error";
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, CustomError);
  }
}
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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


export default CustomError
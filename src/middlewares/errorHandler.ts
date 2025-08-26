import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class CustomError extends Error {
  statusCode: number;
  code?: string;
  errors?: any;

  constructor(message: string, name: string, statusCode: number, errors?: any) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: CustomError | ZodError,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = (err instanceof CustomError && err.statusCode) || 500;
  let message = err.message || "Internal Server Error";
  let errors = (err instanceof CustomError && err.errors) || null;
  let stack = err.stack;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    name: err.name,
    errors,
    stack,
  });
};

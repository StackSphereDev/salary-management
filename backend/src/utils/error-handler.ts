import { Response } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(500, message);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export const formatZodError = (error: ZodError): string => {
  return error.issues
    .map((issue) => {
      const field = issue.path.join('.');
      return field ? `${field}: ${issue.message}` : issue.message;
    })
    .join(', ');
};

export const handleError = (error: unknown, res: Response): Response => {
  if (error instanceof ZodError) {
    const errorMessage = formatZodError(error);
    return res.status(400).json({ error: errorMessage });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  return res.status(500).json({ error: errorMessage });
};

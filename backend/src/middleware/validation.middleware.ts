import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { handleError } from '../utils/error-handler';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      handleError(error, res);
    }
  };
};

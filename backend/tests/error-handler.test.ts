import { describe, it, expect, vi } from 'vitest';
import { Response } from 'express';
import { ZodError, z } from 'zod';
import {
  AppError,
  ValidationError,
  DatabaseError,
  NotFoundError,
  formatZodError,
  handleError,
} from '../src/utils/error-handler';

describe('Error Handler Utilities', () => {
  describe('AppError', () => {
    it('should create AppError with correct properties', () => {
      const error = new AppError(500, 'Internal Server Error');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Internal Server Error');
      expect(error.isOperational).toBe(true);
    });

    it('should allow setting isOperational to false', () => {
      const error = new AppError(500, 'Critical Error', false);

      expect(error.isOperational).toBe(false);
    });

    it('should have correct prototype chain', () => {
      const error = new AppError(500, 'Test Error');

      expect(Object.getPrototypeOf(error)).toBe(AppError.prototype);
    });
  });

  describe('ValidationError', () => {
    it('should create ValidationError with 400 status code', () => {
      const error = new ValidationError('Invalid input');

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid input');
      expect(error.isOperational).toBe(true);
    });

    it('should have correct prototype chain', () => {
      const error = new ValidationError('Test');

      expect(Object.getPrototypeOf(error)).toBe(ValidationError.prototype);
    });
  });

  describe('DatabaseError', () => {
    it('should create DatabaseError with 500 status code', () => {
      const error = new DatabaseError('Database connection failed');

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(DatabaseError);
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Database connection failed');
      expect(error.isOperational).toBe(true);
    });

    it('should have correct prototype chain', () => {
      const error = new DatabaseError('Test');

      expect(Object.getPrototypeOf(error)).toBe(DatabaseError.prototype);
    });
  });

  describe('NotFoundError', () => {
    it('should create NotFoundError with 404 status code', () => {
      const error = new NotFoundError('Resource not found');

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
      expect(error.isOperational).toBe(true);
    });

    it('should have correct prototype chain', () => {
      const error = new NotFoundError('Test');

      expect(Object.getPrototypeOf(error)).toBe(NotFoundError.prototype);
    });
  });

  describe('formatZodError', () => {
    it('should format single field error', () => {
      const schema = z.object({
        email: z.string().email(),
      });

      try {
        schema.parse({ email: 'invalid' });
      } catch (error) {
        if (error instanceof ZodError) {
          const formatted = formatZodError(error);
          expect(formatted).toContain('email');
          expect(formatted).toContain('Invalid email');
        }
      }
    });

    it('should format multiple field errors', () => {
      const schema = z.object({
        email: z.string().email(),
        age: z.number().min(18),
      });

      try {
        schema.parse({ email: 'invalid', age: 10 });
      } catch (error) {
        if (error instanceof ZodError) {
          const formatted = formatZodError(error);
          expect(formatted).toContain('email');
          expect(formatted).toContain('age');
        }
      }
    });

    it('should format nested field errors', () => {
      const schema = z.object({
        user: z.object({
          email: z.string().email(),
        }),
      });

      try {
        schema.parse({ user: { email: 'invalid' } });
      } catch (error) {
        if (error instanceof ZodError) {
          const formatted = formatZodError(error);
          expect(formatted).toContain('user.email');
        }
      }
    });

    it('should handle errors without field path', () => {
      const schema = z.string().min(5);

      try {
        schema.parse('abc');
      } catch (error) {
        if (error instanceof ZodError) {
          const formatted = formatZodError(error);
          expect(typeof formatted).toBe('string');
          expect(formatted.length).toBeGreaterThan(0);
        }
      }
    });

    it('should join multiple errors with comma', () => {
      const schema = z.object({
        email: z.string().email(),
        name: z.string().min(2),
      });

      try {
        schema.parse({ email: 'invalid', name: 'a' });
      } catch (error) {
        if (error instanceof ZodError) {
          const formatted = formatZodError(error);
          expect(formatted).toContain(',');
        }
      }
    });
  });

  describe('handleError', () => {
    let mockResponse: Partial<Response>;
    let statusMock: ReturnType<typeof vi.fn>;
    let jsonMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      jsonMock = vi.fn();
      statusMock = vi.fn().mockReturnValue({ json: jsonMock });
      mockResponse = {
        status: statusMock,
      };
    });

    it('should handle ZodError with 400 status', () => {
      const schema = z.object({
        email: z.string().email(),
      });

      try {
        schema.parse({ email: 'invalid' });
      } catch (error) {
        handleError(error, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            error: expect.any(String),
          })
        );
      }
    });

    it('should handle ValidationError with correct status', () => {
      const error = new ValidationError('Invalid input');

      handleError(error, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid input',
      });
    });

    it('should handle NotFoundError with 404 status', () => {
      const error = new NotFoundError('Resource not found');

      handleError(error, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Resource not found',
      });
    });

    it('should handle DatabaseError with 500 status', () => {
      const error = new DatabaseError('Database error');

      handleError(error, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });

    it('should handle generic Error with 500 status', () => {
      const error = new Error('Something went wrong');

      handleError(error, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Something went wrong',
      });
    });

    it('should handle non-Error objects', () => {
      const error = 'String error';

      handleError(error, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'String error',
      });
    });

    it('should handle null error', () => {
      handleError(null, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'null',
      });
    });

    it('should handle undefined error', () => {
      handleError(undefined, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'undefined',
      });
    });

    it('should handle custom AppError with custom status code', () => {
      const error = new AppError(403, 'Forbidden');

      handleError(error, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Forbidden',
      });
    });

    it('should return response object', () => {
      const error = new Error('Test');
      const result = handleError(error, mockResponse as Response);

      expect(result).toBeDefined();
    });
  });

  describe('Error Hierarchy', () => {
    it('should maintain instanceof relationships', () => {
      const validationError = new ValidationError('Test');
      const databaseError = new DatabaseError('Test');
      const notFoundError = new NotFoundError('Test');

      expect(validationError instanceof AppError).toBe(true);
      expect(validationError instanceof Error).toBe(true);

      expect(databaseError instanceof AppError).toBe(true);
      expect(databaseError instanceof Error).toBe(true);

      expect(notFoundError instanceof AppError).toBe(true);
      expect(notFoundError instanceof Error).toBe(true);
    });

    it('should differentiate between error types', () => {
      const validationError = new ValidationError('Test');
      const databaseError = new DatabaseError('Test');
      const notFoundError = new NotFoundError('Test');

      expect(validationError instanceof DatabaseError).toBe(false);
      expect(validationError instanceof NotFoundError).toBe(false);

      expect(databaseError instanceof ValidationError).toBe(false);
      expect(databaseError instanceof NotFoundError).toBe(false);

      expect(notFoundError instanceof ValidationError).toBe(false);
      expect(notFoundError instanceof DatabaseError).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty error message', () => {
      const error = new AppError(500, '');

      expect(error.message).toBe('');
      expect(error.statusCode).toBe(500);
    });

    it('should handle very long error message', () => {
      const longMessage = 'A'.repeat(10000);
      const error = new AppError(500, longMessage);

      expect(error.message).toBe(longMessage);
      expect(error.message.length).toBe(10000);
    });

    it('should handle special characters in error message', () => {
      const specialMessage = 'Error: <script>alert("xss")</script>';
      const error = new AppError(500, specialMessage);

      expect(error.message).toBe(specialMessage);
    });

    it('should handle unicode characters in error message', () => {
      const unicodeMessage = 'Error: 你好 🚀 مرحبا';
      const error = new AppError(500, unicodeMessage);

      expect(error.message).toBe(unicodeMessage);
    });
  });
});

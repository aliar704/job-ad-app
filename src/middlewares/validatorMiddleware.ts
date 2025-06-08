import { Request, Response, NextFunction } from 'express';
import { ObjectSchema, ValidationError } from 'joi';
import { ErrorCode } from '../types/errorCodes';
import { UnprocessableEntity } from '../exceptions/unprocessable-entity-exception';

// Body validation
export const validateBody = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };
};

// Params validation
export const validateParams = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = await schema.validateAsync(req.params, { abortEarly: false });
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };
};

// Query validation
export const validateQuery = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = await schema.validateAsync(req.query, { abortEarly: false });
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };
};

// Common error handler
const handleValidationError = (error: unknown, next: NextFunction) => {
  if (error instanceof ValidationError) {
    const exception = new UnprocessableEntity(
      'Validation error',
      ErrorCode.UNPROCESSABLE_ENTITY_EXCEPTION,
      error.details
    );
    return next(exception);
  }
  next(error);
};

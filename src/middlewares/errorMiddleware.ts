import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/root';
import { logger } from '../logger/logger';

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  logger.error(error.message, {
    errorCode: error.errorCode,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    stack: error.stack,
    errors: error.errors || null,
  });

  res.status(error.statusCode || 500).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors || null,
  });
};

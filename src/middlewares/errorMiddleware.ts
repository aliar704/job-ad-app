import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/root';
import { logger } from '../logger/logger';

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  logger.error(error.message, {
    errorCode: error.errorCode,//meta
    status_code: error.statusCode,
    path: req.path,
    method: req.method,
    data: req.body,
    query: req.query,//meta
    stack: error.stack,//meta
    errors: error.errors || null,//meta
  });

  res.status(error.statusCode || 500).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors || null,
  });
};

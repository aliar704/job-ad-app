import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger/logger';

const sensitiveFields = ['password'];

const redact = (data: any) => {
  const cloned = { ...data };
  for (const field of sensitiveFields) {
    if (field in cloned) {
      cloned[field] = '***';
    }
  }
  return cloned;
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const safeBody = redact(req.body);

  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    body: safeBody,
  });
  next();
};

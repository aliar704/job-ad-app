import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger/logger';

const sensitiveFields = ['password'];

const redact = (data: any) => {
  const redacted = { ...data };
  for (const field of sensitiveFields) {
    if (redacted[field]) {
      redacted[field] = '***';
    }
  }
  return redacted;
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const safeBody = redact(req.body);

  res.on('finish', () => {
    logger.info('Incoming request', {
      method: req.method,
      path: req.originalUrl,
      status_code: res.statusCode,
      data: safeBody,
      query: req.query, // this goes into meta
      headers: req.headers, // meta
      ip: req.ip, // meta
    });
  });

  next();
};

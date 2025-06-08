import { createLogger, format, transports } from 'winston';
import { PostgresTransport } from './postgresTransport';

export const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [new PostgresTransport()],
});

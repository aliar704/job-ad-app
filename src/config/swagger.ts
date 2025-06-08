// src/swagger.ts

import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { paths } from '../docs/index';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'JobApp API',
    version: '1.0.0',
    description: 'API documentation for JobApp',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
  servers: [
    {
      url: 'http://localhost:3500',
    },
  ],
  paths,
};

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

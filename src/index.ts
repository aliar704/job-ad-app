import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import mainRouter from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { requestLogger } from './logger/requestLogger';
import { setupSwagger } from './config/swagger';
import redisClient from './db/redis';
import path from 'path';
import AuthMiddleware from './middlewares/AuthMiddleware';
import { PORT } from './secrets';

const app: Express = express();
app.use(express.json());
app.use(
  '/uploads/resumes',
  AuthMiddleware.authenticate,
  express.static(path.join(__dirname, '../public/uploads/resumes'))
);

setupSwagger(app);

app.use(requestLogger);

app.use('/api', mainRouter);

app.use(errorMiddleware);

async function startServer() {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });


    const shutdown = async () => {
      console.log('\n🛑 Shutting down gracefully...');
      await redisClient.disconnect();
      server.close(() => {
        console.log('🔌 Server and Redis connections closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown); 
    process.on('SIGTERM', shutdown); 
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

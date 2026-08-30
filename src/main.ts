import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

async function getAvailablePort(preferredPort: number): Promise<number> {
  const candidatePorts = [preferredPort, 3001, 3002, 3003, 5001, 5002];

  for (const port of candidatePorts) {
    try {
      await new Promise<void>((resolve, reject) => {
        const server = require('node:http').createServer();
        server.once('error', (err: any) => {
          if (err && err.code === 'EADDRINUSE') {
            reject(err);
            return;
          }
          reject(err);
        });
        server.once('listening', () => {
          server.close(() => resolve());
        });
        server.listen(port);
      });
      return port;
    } catch {
      // tenta a próxima porta disponível
    }
  }

  return preferredPort;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  setupSwagger(app);

  const preferredPort = Number(process.env.PORT ?? 3001);
  const port = await getAvailablePort(preferredPort);

  await app.listen(port, '0.0.0.0');
}

bootstrap();


import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const frontendUrl = new URL(
    process.env.FRONTEND_URL ?? 'http://localhost:3000',
  );

  app.enableCors({
    origin: frontendUrl.origin,
    credentials: true,
  });
  setupSwagger(app);

  const preferredPort = Number(process.env.PORT ?? 3001);

  await app.listen(preferredPort, '0.0.0.0');
}

bootstrap();


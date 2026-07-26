import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.APP_URL,
  });
  setupSwagger(app);
  await app.listen(process.env.PORT!);
}
bootstrap();


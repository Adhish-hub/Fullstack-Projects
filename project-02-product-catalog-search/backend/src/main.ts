import * as dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validate incoming request bodies.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Allow our frontend to communicate with this backend.
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  const configService = app.get(ConfigService);
  const port = Number(configService.get<string>('PORT') ?? 3001);

  await app.listen(port);

  console.log(`Product Catalog API running on http://localhost:${port}`);
}

bootstrap();

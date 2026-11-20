import * as dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global request validation.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);

  // Allow configured frontend origins.
  const frontendOrigins = (
    configService.get<string>('FRONTEND_URL') ?? 'http://localhost:5173'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: frontendOrigins,
  });

  const port = Number(configService.get<string>('PORT') ?? 3001);

  await app.listen(port);

  console.log(`Product Catalog API running on http://localhost:${port}`);
  console.log(`Allowed frontend origins: ${frontendOrigins.join(', ')}`);
}

bootstrap();

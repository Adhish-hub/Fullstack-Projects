import * as dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable request validation globally.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Allow requests from our React frontend.
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  console.log(`Application running at http://localhost:${port}`);
}

bootstrap();

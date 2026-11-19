import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsModule } from './products/products.module.js';

@Module({
  imports: [
    // Makes environment variables available throughout the app.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Establishes the MongoDB connection.
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
        family: 4,
      }),
    }),

    // Registers all product-related functionality.
    ProductsModule,
  ],
})
export class AppModule {}

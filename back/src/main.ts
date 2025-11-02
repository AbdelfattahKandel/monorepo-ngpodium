import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { Request, Response, NextFunction } from 'express';
import express, { json, urlencoded } from 'express';
import { resolve } from 'node:path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '15mb' }));
  app.use(urlencoded({ limit: '15mb', extended: true }));
  app.enableCors({ origin: 'http://localhost:4200', credentials: true });
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('ngPodium API')
    .setDescription('API documentation for ngPodium backend')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  try {
    (app.getHttpAdapter().getInstance() as any).set('etag', false);
  } catch {}
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  const uploadsDir = resolve(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsDir));
  const seedImagesDir = resolve(process.cwd(), 'seed', 'images');
  app.use('/images', express.static(seedImagesDir));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

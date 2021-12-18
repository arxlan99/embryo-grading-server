import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from "cookie-parser";
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: ['https://embryo-grading-client.vercel.app', 'http://localhost:3000'],
    credentials: true,
  })
  
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001, async () => {
    console.log(`Listening on ${await app.getUrl()}`);
  });
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  await app.listen(process.env.PORT || 3000);
  console.log('API Gateway escuchando en http://localhost:3000');
}
void bootstrap();

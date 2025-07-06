import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configure proxy middleware directly
  const configService = app.get(ConfigService);
  const expressServiceUrl =
    configService.get<string>('EXPRESS_SERVICE_URL') ||
    'http://cocinando_express:3001';

  console.log(`Configuring proxy route: /api/v1/* -> ${expressServiceUrl}`);

  const proxyMiddleware = createProxyMiddleware({
    target: expressServiceUrl,
    changeOrigin: true,
    pathRewrite: { '^/api/v1': '' },
    on: {
      proxyReq: fixRequestBody,
      error: (err, req, res) => {
        console.error(`Proxy error for ${req.url}:`, err);
        if (res && 'headersSent' in res && !res.headersSent) {
          (res as Response).status(502).json({
            error: 'Bad Gateway',
            message: 'Service temporarily unavailable',
          });
        }
      },
      proxyRes: (proxyRes, req) => {
        console.log(
          `Proxy response: ${req.method} ${req.url} -> ${proxyRes.statusCode}`,
        );
      },
    },
  });

  app.use('/api/v1', proxyMiddleware);

  // CORS configuration
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  const port = process.env.PORT_API_GATEWAY || 3000;
  await app.listen(port);

  console.log(`🚀 API Gateway running on http://localhost:${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
}

bootstrap().catch((error) => {
  console.error('Failed to start API Gateway:', error);
  process.exit(1);
});

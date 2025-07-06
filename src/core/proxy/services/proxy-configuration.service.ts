import { INestApplication, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

export interface ProxyRoute {
  path: string;
  target: string;
  pathRewrite?: Record<string, string>;
  changeOrigin?: boolean;
}

@Injectable()
export class ProxyConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  configureProxies(app: INestApplication): void {
    const routes = this.getProxyRoutes();

    routes.forEach((route) => {
      console.log(`Configuring proxy route: ${route.path} -> ${route.target}`);

      const proxyMiddleware = createProxyMiddleware({
        target: route.target,
        changeOrigin: route.changeOrigin ?? true,
        pathRewrite: route.pathRewrite,
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

      app.use(route.path, proxyMiddleware);
    });
  }

  private getProxyRoutes(): ProxyRoute[] {
    return [
      {
        path: '/api/v1/recipe',
        target:
          this.configService.get<string>('EXPRESS_SERVICE_URL') ||
          'http://cocinando_express:3001',
        pathRewrite: { '^/api/v1': '' },
        changeOrigin: true,
      },
      // Aquí puedes agregar más rutas de proxy
    ];
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { IProxyService, ProxyRoute } from '../../interfaces/proxy.interface';

@Injectable()
export class ProxyService implements IProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly proxyRoutes = new Map<string, any>();

  constructor(private readonly configService: ConfigService) {}

  configureRoute(route: ProxyRoute): void {
    this.logger.log(
      `Configuring proxy route: ${route.path} -> ${route.target}`,
    );

    const middleware = createProxyMiddleware({
      target: route.target,
      changeOrigin: true,
      pathRewrite: route.pathRewrite || {},
      on: {
        proxyReq: fixRequestBody,
        error: (err, req, res) => {
          this.logger.error(`Proxy error for ${req.url}:`, err);
          this.handleProxyError(res as Response);
        },
        proxyRes: (proxyRes, req) => {
          this.logger.log(
            `Proxy response: ${req.method} ${req.url} -> ${proxyRes.statusCode}`,
          );
        },
      },
    });

    this.proxyRoutes.set(route.path, middleware);
  }

  getMiddleware(path: string): any {
    return this.proxyRoutes.get(path);
  }

  private handleProxyError(res: Response): void {
    if (res && 'headersSent' in res && !res.headersSent) {
      res.status(502).json({
        error: 'Bad Gateway',
        message: 'Service temporarily unavailable',
      });
    }
  }
}

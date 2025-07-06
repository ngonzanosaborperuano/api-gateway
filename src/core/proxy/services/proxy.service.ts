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
    this.logger.log(`🔀 Configurando proxy: ${route.path} → ${route.target}`);

    const middleware = createProxyMiddleware({
      target: route.target,
      changeOrigin: true,
      pathRewrite: route.pathRewrite || {},
      on: {
        proxyReq: (proxyReq, req) => {
          fixRequestBody(proxyReq, req);
          this.logger.debug(
            `📤 Proxy: ${req.method} ${req.url} → ${route.target}${proxyReq.path}`,
          );
        },
        error: (err, req, res) => {
          this.logger.error(
            `❌ Error proxy ${req.method} ${req.url} → ${route.target}:`,
            err.message,
          );
          this.handleProxyError(res as Response);
        },
        proxyRes: (proxyRes, req) => {
          const statusCode = proxyRes.statusCode || 0;
          const isRootRequest =
            req.url === '/' || req.url === '/api/v1/' || req.url === '/api/v1';
          const is404OnRoot = statusCode === 404 && isRootRequest;

          // No marcar error los 404 en rutas raíz
          const statusIcon = statusCode >= 400 && !is404OnRoot ? '❌' : '✅';

          this.logger.log(
            `${statusIcon} Respuesta: ${req.method} ${req.url} → ${statusCode}`,
          );
        },
      },
    });

    this.proxyRoutes.set(route.path, middleware);
    this.logger.debug(`✅ Ruta ${route.path} configurada`);
  }

  getMiddleware(path: string): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const middleware = this.proxyRoutes.get(path);
    if (!middleware) {
      this.logger.warn(`⚠️ No middleware found for path: ${path}`);
    }

    return middleware;
  }

  getAllConfiguredRoutes(): string[] {
    return Array.from(this.proxyRoutes.keys());
  }

  private handleProxyError(res: Response): void {
    if (res && 'headersSent' in res && !res.headersSent) {
      res.status(502).json({
        error: 'Bad Gateway',
        message: 'Service temporarily unavailable',
        timestamp: new Date().toISOString(),
      });
    }
  }
}

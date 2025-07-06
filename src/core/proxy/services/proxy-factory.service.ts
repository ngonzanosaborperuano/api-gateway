import { Injectable } from '@nestjs/common';
import type { RequestHandler } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { LoggingService } from '../../logging/services/logging.service';
import { ProxyRoute } from './proxy-configuration.service';

@Injectable()
export class ProxyFactoryService {
  constructor(private readonly logger: LoggingService) {}

  createProxy(route: ProxyRoute): RequestHandler {
    return createProxyMiddleware({
      target: route.target,
      changeOrigin: route.changeOrigin ?? true,
      pathRewrite: route.pathRewrite,
      on: {
        proxyReq: fixRequestBody,
        error: (err, req, res) => {
          console.error(`Proxy error for ${req.url}:`, err);
          if (res && 'headersSent' in res && !res.headersSent) {
            res.status(502).json({
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
  }
}

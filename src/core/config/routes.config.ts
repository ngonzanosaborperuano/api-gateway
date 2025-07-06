import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface RouteConfig {
  path: string;
  target: string;
  pathRewrite?: Record<string, string>;
  description?: string;
}

@Injectable()
export class RoutesConfigService {
  constructor(private readonly configService: ConfigService) {}

  getProxyRoutes(): RouteConfig[] {
    const expressServiceUrl =
      this.configService.get<string>('EXPRESS_SERVICE_URL') ||
      'http://cocinando_express:3001';
    const nestServiceUrl =
      this.configService.get<string>('NEST_SERVICE_URL') ||
      'http://cocinando_nest:3002';

    return [
      // Recetas → Express Service
      {
        path: '/api/v1/recipe',
        target: expressServiceUrl,
        pathRewrite: { '^/': '/recipe' },
        description: 'Recipe management endpoints',
      },

      // Usuarios → Nest Service
      {
        path: '/api/v1/usuarios',
        target: nestServiceUrl,
        pathRewrite: { '^/': '/usuarios' },
        description: 'User management endpoints',
      },

      // Auth → Nest Service
      {
        path: '/api/v1/auth',
        target: nestServiceUrl,
        pathRewrite: { '^/(.*)': '/auth/$1' },
        description: 'Authentication endpoints',
      },

      // Pagos → Express Service
      {
        path: '/api/v1/payments',
        target: expressServiceUrl,
        pathRewrite: { '^/': '/payments' },
        description: 'Payment processing endpoints',
      },
    ];
  }

  // Método para obtener rutas ordenadas por especificidad (más específicas primero)
  getOrderedRoutes(): RouteConfig[] {
    return this.getProxyRoutes().sort((a, b) => {
      // Rutas más específicas (más segmentos) van primero
      const aSegments = a.path.split('/').length;
      const bSegments = b.path.split('/').length;
      return bSegments - aSegments;
    });
  }
}

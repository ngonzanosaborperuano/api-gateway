import { ConfigService } from '@nestjs/config';

// === TIPOS ===
export interface RouteConfig {
  path: string;
  target: string;
  pathRewrite?: Record<string, string>;
  description?: string;
}

// === CONSTANTES INTERNAS ===
// Rutas base para servicios
const ROUTE_PATHS = {
  RECIPES: '/api/v1/recipe',
  PAYMENTS: '/api/v1/payments',
  USERS: '/api/v1/usuarios',
  AUTH: '/api/v1/auth',
} as const;

// Configuraciones de reescritura de rutas
const PATH_REWRITES = {
  RECIPES: { '^/': '/recipe' },
  PAYMENTS: { '^/': '/payments' },
  USERS: { '^/': '/usuarios' },
  AUTH: { '^/(.*)': '/auth/$1' },
} as const;

export const getRouteConfig = (configService: ConfigService): RouteConfig[] => {
  const expressServiceUrl = configService.get<string>('EXPRESS_SERVICE_URL')!;
  const nestServiceUrl = configService.get<string>('NEST_SERVICE_URL')!;

  return [
    {
      path: ROUTE_PATHS.RECIPES,
      target: expressServiceUrl,
      pathRewrite: PATH_REWRITES.RECIPES,
      description: 'Recipe management endpoints',
    },
    {
      path: ROUTE_PATHS.USERS,
      target: nestServiceUrl,
      pathRewrite: PATH_REWRITES.USERS,
      description: 'User management endpoints',
    },
    {
      path: ROUTE_PATHS.AUTH,
      target: nestServiceUrl,
      pathRewrite: PATH_REWRITES.AUTH,
      description: 'Authentication endpoints',
    },
    {
      path: ROUTE_PATHS.PAYMENTS,
      target: expressServiceUrl,
      pathRewrite: PATH_REWRITES.PAYMENTS,
      description: 'Payment processing endpoints',
    },
  ];
};

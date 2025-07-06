export const API_ROUTES = {
  HEALTH: {
    BASE: 'health',
    DETAILED: 'health/detailed',
  },
  PROXY: {
    BASE: 'proxy',
    ROUTES: 'proxy/routes',
    STATUS: 'proxy/status',
  },
  // Rutas hacia Express Service
  RECIPES: {
    BASE: '/api/v1/recipe',
    PREFERENCES: '/api/v1/recipe/preferencias',
    TARGET: 'http://cocinando_express:3001',
    PATH_REWRITE: { '^/api/v1': '' },
  },
  PAYMENTS: {
    BASE: '/api/v1/payments',
    TARGET: 'http://cocinando_express:3001',
    PATH_REWRITE: { '^/api/v1': '' },
  },
  // Rutas hacia Nest Service
  USERS: {
    BASE: '/api/v1/usuarios',
    TARGET: 'http://cocinando_nest:3002',
    PATH_REWRITE: { '^/api/v1': '' },
  },
  AUTH: {
    BASE: '/api/v1/auth',
    TARGET: 'http://cocinando_nest:3002',
    PATH_REWRITE: { '^/api/v1': '' },
  },
} as const;

export const SERVICE_URLS = {
  EXPRESS_SERVICE:
    process.env.EXPRESS_SERVICE_URL || 'http://cocinando_express:3001',
  NEST_SERVICE: process.env.NEST_SERVICE_URL || 'http://cocinando_nest:3002',
} as const;

export const PROXY_ROUTES = {
  // Express Service Routes
  EXPRESS: ['/api/v1/recipe', '/api/v1/payments'],
  // Nest Service Routes
  NEST: ['/api/v1/usuarios', '/api/v1/auth'],
} as const;

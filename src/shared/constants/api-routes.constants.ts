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
  RECIPE: {
    BASE: '/api/v1/recipe',
    TARGET: 'http://cocinando_express:3001',
    PATH_REWRITE: { '^/api/v1': '' },
  },
} as const;

export const SERVICE_URLS = {
  EXPRESS_SERVICE:
    process.env.EXPRESS_SERVICE_URL || 'http://cocinando_express:3001',
  NEST_SERVICE: process.env.NEST_SERVICE_URL || 'http://cocinando_nest:3002',
} as const;

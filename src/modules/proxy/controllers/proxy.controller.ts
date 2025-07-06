import { Controller, Get } from '@nestjs/common';
import { RoutesConfigService } from '../../../core/config/routes.config';
import { ProxyService } from '../../../core/proxy/services/proxy.service';

export interface ProxyRouteInfo {
  path: string;
  target: string;
  status: 'active' | 'inactive';
  description?: string;
}

export interface ProxyConfigInfo {
  route: string;
  target: string;
  pathRewrite: Record<string, string> | undefined;
  description: string;
  isConfigured: boolean;
}

@Controller('proxy')
export class ProxyController {
  constructor(
    private readonly routesConfigService: RoutesConfigService,
    private readonly proxyService: ProxyService,
  ) {}

  @Get('routes')
  getProxyRoutes(): ProxyRouteInfo[] {
    const routes = this.routesConfigService.getProxyRoutes();

    return routes.map((route) => ({
      path: route.path,
      target: route.target,
      status: 'active' as const,
      description: route.description,
    }));
  }

  @Get('config')
  getProxyConfig(): ProxyConfigInfo[] {
    const routes = this.routesConfigService.getProxyRoutes();
    const configuredRoutes = this.proxyService.getAllConfiguredRoutes();

    return routes.map((route) => ({
      route: route.path,
      target: route.target,
      pathRewrite: route.pathRewrite,
      description: route.description || 'No description',
      isConfigured: configuredRoutes.includes(route.path),
    }));
  }

  @Get('status')
  getProxyStatus(): {
    status: string;
    message: string;
    totalRoutes: number;
    configuredRoutes: number;
    timestamp: string;
  } {
    const routes = this.routesConfigService.getProxyRoutes();
    const configuredRoutes = this.proxyService.getAllConfiguredRoutes();

    return {
      status: 'operational',
      message: 'All proxy routes are functioning correctly',
      totalRoutes: routes.length,
      configuredRoutes: configuredRoutes.length,
      timestamp: new Date().toISOString(),
    };
  }
}

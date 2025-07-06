import { Controller, Get } from '@nestjs/common';
import { ProxyConfigurationService } from '../../../core/proxy/services/proxy-configuration.service';

export interface ProxyRouteInfo {
  path: string;
  target: string;
  status: 'active' | 'inactive';
}

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyConfigService: ProxyConfigurationService) {}

  @Get('routes')
  getProxyRoutes(): ProxyRouteInfo[] {
    // En una implementación real, esto podría consultar el estado actual de las rutas
    return [
      {
        path: '/api/v1/recipe',
        target: 'http://cocinando_express:3001',
        status: 'active',
      },
    ];
  }

  @Get('status')
  getProxyStatus(): { status: string; message: string } {
    return {
      status: 'operational',
      message: 'All proxy routes are functioning correctly',
    };
  }
}

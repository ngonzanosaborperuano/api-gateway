import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RouteConfig,
  getRouteConfig,
} from '../../shared/constants/api-routes.constants';

@Injectable()
export class RoutesConfigService {
  constructor(private readonly configService: ConfigService) {}

  getProxyRoutes(): RouteConfig[] {
    return getRouteConfig(this.configService);
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

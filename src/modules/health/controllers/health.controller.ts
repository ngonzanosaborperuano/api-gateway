import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../services/health.service';

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
  services?: Record<string, 'healthy' | 'unhealthy'>;
}

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): HealthCheckResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  @Get('detailed')
  async getDetailedHealth(): Promise<HealthCheckResponse> {
    const basicHealth = this.getHealth();

    try {
      const expressServiceUrl = 'http://cocinando_express:3001';
      const response = await fetch(`${expressServiceUrl}/`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      const services = {
        express: response.ok ? ('healthy' as const) : ('unhealthy' as const),
      };

      return {
        ...basicHealth,
        status: services.express === 'unhealthy' ? 'error' : 'ok',
        services,
      };
    } catch {
      return {
        ...basicHealth,
        status: 'error',
        services: { express: 'unhealthy' },
      };
    }
  }
}

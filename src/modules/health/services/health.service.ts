import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckResponse } from '../controllers/health.controller';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  getHealthStatus(): HealthCheckResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  async getDetailedHealthStatus(): Promise<HealthCheckResponse> {
    const basicHealth = this.getHealthStatus();

    const services = await this.checkExternalServices();

    return {
      ...basicHealth,
      status: this.determineOverallStatus(services),
      services,
    };
  }

  private async checkExternalServices(): Promise<
    Record<string, 'healthy' | 'unhealthy'>
  > {
    const expressServiceUrl =
      this.configService.get<string>('EXPRESS_SERVICE_URL') ||
      'http://cocinando_express:3001';

    const services: Record<string, 'healthy' | 'unhealthy'> = {};

    // Check Express service
    try {
      const response = await fetch(`${expressServiceUrl}/`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      services.express = response.ok ? 'healthy' : 'unhealthy';
    } catch {
      services.express = 'unhealthy';
    }

    return services;
  }

  private determineOverallStatus(
    services: Record<string, 'healthy' | 'unhealthy'>,
  ): 'ok' | 'error' {
    const hasUnhealthyService = Object.values(services).some(
      (status) => status === 'unhealthy',
    );
    return hasUnhealthyService ? 'error' : 'ok';
  }
}

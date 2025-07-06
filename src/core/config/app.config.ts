import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ApplicationConfig {
  port: number;
  expressServiceUrl: string;
  environment: string;
}

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  getApplicationConfig(): ApplicationConfig {
    return {
      port: this.configService.get<number>('PORT_API_GATEWAY') || 3000,
      expressServiceUrl:
        this.configService.get<string>('EXPRESS_SERVICE_URL') ||
        'http://cocinando_express:3001',
      environment: this.configService.get<string>('NODE_ENV') || 'development',
    };
  }
}

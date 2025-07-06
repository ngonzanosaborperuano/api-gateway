import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CorsConfigService {
  constructor(private readonly configService: ConfigService) {}

  getCorsOptions(): CorsOptions {
    const allowedOrigins = this.configService
      .get<string>('ALLOWED_ORIGINS')
      ?.split(',') || ['http://localhost:3000'];

    return {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    };
  }
}

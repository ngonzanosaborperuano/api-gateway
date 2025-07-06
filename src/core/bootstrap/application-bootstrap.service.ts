import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { CorsConfigService } from '../config/cors.config';
import { ProxyService } from '../proxy/services/proxy.service';

export class ApplicationBootstrapService {
  private static readonly logger = new Logger(ApplicationBootstrapService.name);

  static async bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    this.configureApplication(app);
    await this.startServer(app);
  }

  private static configureApplication(app: INestApplication): void {
    this.configureValidation(app);
    this.configureProxy(app);
    this.configureCors(app);
  }

  private static configureValidation(app: INestApplication): void {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    this.logger.log('✅ Global validation configured');
  }

  private static configureProxy(app: INestApplication): void {
    const proxyService = app.get(ProxyService);
    const configService = app.get(ConfigService);

    const expressServiceUrl =
      configService.get<string>('EXPRESS_SERVICE_URL') ||
      'http://cocinando_express:3001';

    proxyService.configureRoute({
      path: '/api/v1',
      target: expressServiceUrl,
      pathRewrite: { '^/api/v1': '' },
    });

    app.use('/api/v1', proxyService.getMiddleware('/api/v1'));
    this.logger.log('✅ Proxy middleware configured');
  }

  private static configureCors(app: INestApplication): void {
    const corsConfigService = app.get(CorsConfigService);
    const corsOptions = corsConfigService.getCorsOptions();

    app.enableCors(corsOptions);
    this.logger.log('✅ CORS configured');
  }

  private static async startServer(app: INestApplication): Promise<void> {
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT_API_GATEWAY') || 3000;

    await app.listen(port);

    this.logger.log(`🚀 API Gateway running on http://localhost:${port}`);
    this.logger.log(`📋 Health check: http://localhost:${port}/health`);
    this.logger.log(
      `🌍 Environment: ${configService.get<string>('NODE_ENV') || 'development'}`,
    );
  }
}

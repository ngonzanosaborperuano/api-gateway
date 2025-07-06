import {
  INestApplication,
  Injectable,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { AppConfigService } from '../config/app.config';
import { CorsConfigService } from '../config/cors.config';
import { IApplicationBootstrap } from '../interfaces/proxy.interface';
import { ProxyService } from '../proxy/services/proxy.service';

@Injectable()
export class ApplicationBootstrapService implements IApplicationBootstrap {
  private readonly logger = new Logger(ApplicationBootstrapService.name);

  async bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    this.configureApplication(app);
    await this.startServer(app);
  }

  private configureApplication(app: INestApplication): void {
    this.configureValidation(app);
    this.configureProxy(app);
    this.configureCors(app);
  }

  private configureValidation(app: INestApplication): void {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    this.logger.log('✅ Global validation configured');
  }

  private configureProxy(app: INestApplication): void {
    const proxyService = app.get(ProxyService);
    const appConfigService = app.get(AppConfigService);
    const config = appConfigService.getApplicationConfig();

    proxyService.configureRoute({
      path: '/api/v1',
      target: config.expressServiceUrl,
      pathRewrite: { '^/api/v1': '' },
    });

    app.use('/api/v1', proxyService.getMiddleware('/api/v1'));
    this.logger.log('✅ Proxy middleware configured');
  }

  private configureCors(app: INestApplication): void {
    const corsConfigService = app.get(CorsConfigService);
    const corsOptions = corsConfigService.getCorsOptions();

    app.enableCors(corsOptions);
    this.logger.log('✅ CORS configured');
  }

  private async startServer(app: INestApplication): Promise<void> {
    const appConfigService = app.get(AppConfigService);
    const config = appConfigService.getApplicationConfig();

    await app.listen(config.port);

    this.logger.log(
      `🚀 API Gateway running on http://localhost:${config.port}`,
    );
    this.logger.log(`📋 Health check: http://localhost:${config.port}/health`);
    this.logger.log(`🌍 Environment: ${config.environment}`);
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationBootstrapService } from './bootstrap/application-bootstrap.service';
import { AppConfigService } from './config/app.config';
import { CorsConfigService } from './config/cors.config';
import { ProxyService } from './proxy/services/proxy.service';

@Module({
  imports: [ConfigModule],
  providers: [
    ProxyService,
    CorsConfigService,
    AppConfigService,
    ApplicationBootstrapService,
  ],
  exports: [
    ProxyService,
    CorsConfigService,
    AppConfigService,
    ApplicationBootstrapService,
  ],
})
export class CoreModule {}

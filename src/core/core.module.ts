import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CorsConfigService } from './config/cors.config';
import { RoutesConfigService } from './config/routes.config';
import { ProxyService } from './proxy/services/proxy.service';

@Module({
  imports: [ConfigModule],
  providers: [ProxyService, CorsConfigService, RoutesConfigService],
  exports: [ProxyService, CorsConfigService, RoutesConfigService],
})
export class CoreModule {}

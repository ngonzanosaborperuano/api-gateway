import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config/app.config';
import { CorsConfigService } from './config/cors.config';
import { ProxyService } from './proxy/services/proxy.service';

@Module({
  imports: [ConfigModule],
  providers: [ProxyService, CorsConfigService, AppConfigService],
  exports: [ProxyService, CorsConfigService, AppConfigService],
})
export class CoreModule {}

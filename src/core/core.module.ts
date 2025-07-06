import { Module } from '@nestjs/common';
import { ProxyConfigurationService } from './proxy/services/proxy-configuration.service';

@Module({
  providers: [ProxyConfigurationService],
  exports: [ProxyConfigurationService],
})
export class CoreModule {}

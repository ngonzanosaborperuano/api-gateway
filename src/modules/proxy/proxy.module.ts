import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { ProxyController } from './controllers/proxy.controller';

@Module({
  imports: [CoreModule],
  controllers: [ProxyController],
})
export class ProxyModule {}

import { Module } from '@nestjs/common';
import { VnDirectIntegrationService } from './vn-direct-integration.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [VnDirectIntegrationService],
  exports: [VnDirectIntegrationService],
})
export class VnDirectIntegrationModule {}

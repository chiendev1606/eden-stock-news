import { Module } from '@nestjs/common';
import { VnDirectIntegrationService } from './vn-direct-integration.service';
import { HttpModule } from '@nestjs/axios';
import { injectApiProvider } from './utils/providers';
import { NewsApi, StocksApi } from './client/generated';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    DatabaseModule,
  ],
  providers: [
    VnDirectIntegrationService,
    injectApiProvider(StocksApi),
    injectApiProvider(NewsApi),
  ],
  exports: [VnDirectIntegrationService],
})
export class VnDirectIntegrationModule {}

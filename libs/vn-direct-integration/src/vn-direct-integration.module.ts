import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ChartDataApi, NewsApi, StocksApi } from './client/generated';
import { DatabaseModule } from '@app/database';
import { injectApiProvider } from './utils/providers';
import { VnDirectIntegrationService } from './vn-direct-integration.service';
import { HtmlStripperModule } from '@app/html-stripper/html-stripper.module';
import { AppConfigModule } from '@app/config';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    DatabaseModule.forRoot({
      isGlobal: true,
      enableLogging: process.env.NODE_ENV === 'development',
    }),
    HtmlStripperModule.forRoot({
      enableCaching: true,
      cacheSize: 1000,
      cacheTTL: 3600,
    }),
    AppConfigModule,
  ],
  providers: [
    VnDirectIntegrationService,
    injectApiProvider(StocksApi, 'VN_DIRECT_API_URL'),
    injectApiProvider(NewsApi, 'VN_DIRECT_API_URL'),
    injectApiProvider(ChartDataApi, 'DCHART_API_BASE_PATH'),
  ],
  exports: [VnDirectIntegrationService],
})
export class VnDirectIntegrationModule {}

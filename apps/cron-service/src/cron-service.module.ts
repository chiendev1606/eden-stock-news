import { Module } from '@nestjs/common';
import { CronServiceService } from './cron-service.service';
import { VnDirectIntegrationModule } from '@app/http-eden-client';
import { StockProcessorModule } from './context/stock-processor/stock-processor.module';
import { NewsProcessorModule } from './context/new-processor/news-processor.module';

@Module({
  imports: [
    VnDirectIntegrationModule,
    StockProcessorModule,
    NewsProcessorModule,
  ],
  providers: [CronServiceService],
})
export class CronServiceModule {}

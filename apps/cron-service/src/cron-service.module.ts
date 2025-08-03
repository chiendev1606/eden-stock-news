import { VnDirectIntegrationModule } from '@app/http-eden-client';
import { Module } from '@nestjs/common';
import { NewsProcessorModule } from './context/new-processor/news-processor.module';
import { StockProcessorModule } from './context/stock-processor/stock-processor.module';
import { CronServiceService } from './cron-service.service';

@Module({
  imports: [
    VnDirectIntegrationModule,
    StockProcessorModule,
    NewsProcessorModule,
  ],
  providers: [CronServiceService],
})
export class CronServiceModule {}

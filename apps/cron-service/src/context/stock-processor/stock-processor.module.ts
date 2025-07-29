import { Module } from '@nestjs/common';
import { StocksProcessorServices } from './stocks-processor.services';
import { VnDirectIntegrationModule } from '@app/http-eden-client';

@Module({
  imports: [VnDirectIntegrationModule],
  providers: [StocksProcessorServices],
  exports: [StocksProcessorServices],
})
export class StockProcessorModule {}

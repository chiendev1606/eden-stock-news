import { Module } from '@nestjs/common';
import { StocksProcessorServices } from './stocks-processor.services';

@Module({
  providers: [StocksProcessorServices],
  exports: [StocksProcessorServices],
})
export class StockProcessorModule {}

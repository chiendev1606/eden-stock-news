import { Module } from '@nestjs/common';
import { StockProcessorService } from './stock-processor.service';
import { VnDirectIntegrationModule } from 'libs/vn-direct-integration/src';
import { StockProcessorCommand } from './stock-processor.command';

@Module({
  imports: [VnDirectIntegrationModule],
  providers: [StockProcessorService, StockProcessorCommand],
  // exports: [StockProcessorService, StockProcessorCommand],
})
export class StockProcessorModule {}

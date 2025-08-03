import { Module } from '@nestjs/common';
import { VnDirectIntegrationModule } from 'libs/vn-direct-integration/src';
import { StockProcessorCommand } from './stock-processor.command';
import { StockProcessorService } from './stock-processor.service';

@Module({
  imports: [VnDirectIntegrationModule],
  providers: [StockProcessorService, StockProcessorCommand],
})
export class StockProcessorModule {}

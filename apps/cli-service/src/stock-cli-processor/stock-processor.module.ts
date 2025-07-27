import { Module } from '@nestjs/common';
import { StockProcessorService } from './stock-processor.service';
import { VnDirectIntegrationModule } from 'libs/vn-direct-integration/src';
import { StockProcessorCommand } from './stock-processor.command';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [VnDirectIntegrationModule, DatabaseModule],
  providers: [StockProcessorService, StockProcessorCommand],
})
export class StockProcessorModule {}

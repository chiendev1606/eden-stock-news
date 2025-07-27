import { Module } from '@nestjs/common';
import { StockProcessorModule } from './stock-cli-processor/stock-processor.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [StockProcessorModule, SharedModule],
})
export class AppModule {}

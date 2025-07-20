import { Module } from '@nestjs/common';
import { StockProcessorModule } from '../stock-cli-processor/stock-processor.module';

@Module({
  imports: [StockProcessorModule],
})
export class AppModule {}

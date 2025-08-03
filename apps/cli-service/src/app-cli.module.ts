import { Module } from '@nestjs/common';
import { StockProcessorModule } from './stock-cli-processor/stock-processor.module';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [
    StockProcessorModule,
    DatabaseModule.forRoot({
      isGlobal: true,
      enableLogging: process.env.NODE_ENV === 'development',
    }),
  ],
})
export class AppCliModule {}

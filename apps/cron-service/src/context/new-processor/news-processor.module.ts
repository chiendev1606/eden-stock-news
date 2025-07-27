import { Module } from '@nestjs/common';
import { NewsProcessorServices } from './news-processor.services';

@Module({
  providers: [NewsProcessorServices],
  exports: [NewsProcessorServices],
})
export class NewsProcessorModule {}

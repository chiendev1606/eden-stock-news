import { Module } from '@nestjs/common';
import { NewsProcessorServices } from './news-processor.services';
import { VnDirectIntegrationModule } from '@app/http-eden-client';

@Module({
  imports: [VnDirectIntegrationModule],
  providers: [NewsProcessorServices],
  exports: [NewsProcessorServices],
})
export class NewsProcessorModule {}

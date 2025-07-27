import { VnDirectIntegrationService } from '@app/http-eden-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NewsProcessorServices {
  constructor(
    private readonly vnDirectIntegrationService: VnDirectIntegrationService,
  ) {}

  async processNews() {
    const res = await this.vnDirectIntegrationService.getVnDirectNews();
  }
}

import { VnDirectIntegrationService } from '@app/http-eden-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StocksProcessorServices {
  constructor(
    private readonly vnDirectIntegrationService: VnDirectIntegrationService,
  ) {}

  async processStocks() {
    const res = await this.vnDirectIntegrationService.getVnDirectStock();
    console.log(res);
  }
}

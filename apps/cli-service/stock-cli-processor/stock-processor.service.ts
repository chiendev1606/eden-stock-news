import { VnDirectIntegrationService } from '@app/http-eden-client';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StockProcessorService {
  private readonly logger = new Logger(StockProcessorService.name);
  constructor(
    private readonly vnDirectIntegrationService: VnDirectIntegrationService,
  ) {}

  async processStock() {
    const stockData = await this.vnDirectIntegrationService.getVnDirectStock();
    this.logger.log(stockData);
  }
}

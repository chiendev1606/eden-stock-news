import { DatabaseService } from '@app/database';
import { VnDirectIntegrationService } from '@app/http-eden-client';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StockProcessorService {
  private readonly logger = new Logger(StockProcessorService.name);
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly vnDirectIntegrationService: VnDirectIntegrationService,
  ) {}

  async processStock() {
    await this.vnDirectIntegrationService.crawlVnDirectStock();
  }
}

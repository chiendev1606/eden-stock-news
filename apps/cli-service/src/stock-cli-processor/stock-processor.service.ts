import { VnDirectIntegrationService } from '@app/http-eden-client';
import { Stock } from '@app/http-eden-client/client/generated';
import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class StockProcessorService {
  private readonly logger = new Logger(StockProcessorService.name);
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly vnDirectIntegrationService: VnDirectIntegrationService,
  ) {}

  createManyStock(stockData: Stock[]) {
    const stockDataToCreate = stockData.map((stock) => ({
      symbol: stock.code ?? '',
      companyName: stock.companyName ?? '',
      currentPrice: 0,
      changePercent: 0,
    }));
    return this.databaseService.stock.createMany({
      data: stockDataToCreate,
    });
  }

  async processStock() {
    const stockData = await this.vnDirectIntegrationService.getVnDirectStock();
    if (!stockData) {
      this.logger.error('No stock data found');
      return;
    }
    await this.createManyStock(stockData);
    this.logger.log('Stock data created successfully');
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@app/database';

@Injectable()
export class StockService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findStockBySymbol(symbol: string) {
    const stock = await this.databaseService.stock.findUnique({
      where: { symbol },
    });
    return stock;
  }

  async getStockDetail(symbol: string) {
    const stock = await this.findStockBySymbol(symbol);
    if (!stock) {
      throw new NotFoundException('Stock not found');
    }
    return stock;
  }
}

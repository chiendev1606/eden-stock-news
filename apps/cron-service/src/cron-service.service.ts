import { Injectable, Logger } from '@nestjs/common';
import { NewsProcessorServices } from './context/new-processor/news-processor.services';
import { StocksProcessorServices } from './context/stock-processor/stocks-processor.services';

@Injectable()
export class CronServiceService {
  private readonly logger = new Logger(CronServiceService.name);
  constructor(
    private readonly stocksProcessorServices: StocksProcessorServices,
    private readonly newsProcessorServices: NewsProcessorServices,
  ) {}

  async process() {
    this.logger.log('Processing jobs...');

    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // News everyday 7AM (Monday to Sunday)
    if ([7, 15].includes(currentHour)) {
      this.logger.log(`Processing news at ${currentHour}:00...`);
      await this.newsProcessorServices.processNews();
    }

    // Stocks every Saturday 10AM
    if (currentDay === 6 && currentHour === 10) {
      // Saturday = 6
      this.logger.log('Processing stocks at 10AM Saturday...');
      await this.stocksProcessorServices.processStocks();
    }
  }
}

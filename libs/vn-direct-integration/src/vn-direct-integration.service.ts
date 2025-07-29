import { Injectable, Logger } from '@nestjs/common';
import { NewsApi, StocksApi } from './client/generated';
import { DatabaseService } from './database/database.service';

@Injectable()
export class VnDirectIntegrationService {
  private logger = new Logger(VnDirectIntegrationService.name);
  constructor(
    private stocksApi: StocksApi,
    private newsApi: NewsApi,
    private databaseService: DatabaseService,
  ) {}

  async getVnDirectStock() {
    try {
      this.logger.log('staring getting stock data from vn direct');
      const res = await this.stocksApi.getStocks({
        q: 'type:STOCK~status:LISTED',
        size: 3000,
        fields:
          'code,companyName,companyNameEng,shortName,floor,industryName,price',
      });

      const stockData = res.data.data ?? [];
      const stockDataToCreate = stockData.map((stock) => ({
        symbol: stock.code ?? '',
        companyName: stock.companyName ?? '',
        currentPrice: 0,
        changePercent: 0,
      }));

      await this.databaseService.stock.createMany({
        data: stockDataToCreate,
      });

      return stockDataToCreate;
    } catch (error) {
      console.log(error);
    }
  }

  async getVnDirectNews() {
    try {
      this.logger.log('staring getting news data from vn direct');
      const res = await this.newsApi.getNews({
        size: 1000,
      });
      const newsData = res.data.data ?? [];
      const fetchedNews = newsData.map((item) => item.newsId);
      const existingNews = await this.databaseService.post.findMany({
        where: {
          vnDirectId: {
            in: fetchedNews,
          },
        },
      });
      const existingNewsIds = existingNews.map((item) => item.vnDirectId);

      for (const news of newsData) {
        const firstSymbol = news.tagCodes?.split(',')[0] ?? '';
        if (existingNewsIds.includes(news.newsId) || !firstSymbol) {
          continue;
        }
        const stock = await this.databaseService.stock.findUnique({
          where: {
            symbol: firstSymbol,
          },
          select: {
            id: true,
          },
        });
        if (!stock) {
          continue;
        }
        const newsDataToCreate = {
          title: news.newsTitle ?? '',
          content: news.newsContent ?? '',
          published: false,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          stockId: stock.id,
          vnDirectId: news.newsId,
        };
        this.logger.log(
          `creating news ${news.newsId} for stock ${firstSymbol}`,
        );
        await this.databaseService.post.create({
          data: newsDataToCreate,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

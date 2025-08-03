import { HtmlStripperService } from '@app/html-stripper/html-stripper.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  ChartDataApi,
  GetStockHistoryResolutionEnum,
  NewsApi,
  StocksApi,
} from './client/generated';
import { DatabaseService } from '@app/database';

@Injectable()
export class VnDirectIntegrationService {
  private logger = new Logger(VnDirectIntegrationService.name);
  constructor(
    private stocksApi: StocksApi,
    private newsApi: NewsApi,
    private chartDataApi: ChartDataApi,
    private databaseService: DatabaseService,
    private htmlStripperService: HtmlStripperService,
  ) {}

  findStockBySymbol(symbol: string) {
    const stock = this.databaseService.stock.findUnique({
      where: { symbol },
    });
    return stock;
  }

  createManyStocks(
    stockData: {
      symbol: string;
      companyName: string;
      currentPrice: number;
      changePercent: number;
    }[],
  ) {
    return this.databaseService.stock.createMany({
      data: stockData,
    });
  }

  updateStock(stockData: {
    stockId: string;
    currentPrice: number;
    changePercent: number;
  }) {
    return this.databaseService.stock.update({
      where: {
        id: stockData.stockId,
      },
      data: {
        currentPrice: stockData.currentPrice,
        changePercent: stockData.changePercent,
      },
    });
  }

  async createPost(newsDataToCreate: {
    title: string;
    content: string;
    published: boolean;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    stockId: string;
    vnDirectId: string;
  }) {
    return this.databaseService.post.create({
      data: newsDataToCreate,
    });
  }

  async crawlVnDirectStock() {
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

      await this.createManyStocks(stockDataToCreate);

      return stockDataToCreate;
    } catch (error) {
      console.log(error);
    }
  }

  async updateStockPrice(symbol: string, stockId: string) {
    try {
      const {
        data: { c: prices },
      } = await this.chartDataApi.getStockHistory({
        symbol,
        resolution: GetStockHistoryResolutionEnum._1D,
      });
      const lastPrice = prices?.[prices.length - 1] ?? 0;
      const nearLastPrice = prices?.[prices.length - 2] ?? 0;
      const changePercent = ((lastPrice - nearLastPrice) / nearLastPrice) * 100;

      if (lastPrice && changePercent) {
        await this.updateStock({
          stockId,
          currentPrice: lastPrice,
          changePercent,
        });
      }
    } catch {
      this.logger.error(`error when getting chart data for stock ${symbol}`);
    }
  }

  async crawlVnDirectNews() {
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
        const stock = await this.findStockBySymbol(firstSymbol);

        if (!stock) {
          continue;
        }

        await this.updateStockPrice(stock.symbol, stock.id);

        const strippedContent = this.htmlStripperService.stripHtml({
          html: news.newsContent ?? '',
          extractMainContent: true,
        });

        const newsDataToCreate = {
          title: news.newsTitle ?? '',
          content: strippedContent.text ?? '',
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
        await this.createPost(newsDataToCreate);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

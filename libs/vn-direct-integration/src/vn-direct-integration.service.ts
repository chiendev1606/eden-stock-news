import { Injectable, Logger } from '@nestjs/common';
import { NewsApi, StocksApi } from './client/generated';

@Injectable()
export class VnDirectIntegrationService {
  private logger = new Logger(VnDirectIntegrationService.name);
  constructor(
    private stocksApi: StocksApi,
    private newsApi: NewsApi,
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

      console.log(res.data.data);

      return res.data.data ?? [];
    } catch (error) {
      console.log(error);
      // this.logger.error(`error getting data`, error);
      // throw new InternalServerErrorException(error);
    }
  }

  async getVnDirectNews() {
    try {
      this.logger.log('staring getting news data from vn direct');
      const res = await this.newsApi.getNews();
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }
}

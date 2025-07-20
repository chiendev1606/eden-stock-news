import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { VnDirectStockItem } from './vn-direct-integration.type';

@Injectable()
export class VnDirectIntegrationService {
  private logger = new Logger(VnDirectIntegrationService.name);
  constructor(private httpService: HttpService) {}

  async getVnDirectStock(): Promise<VnDirectStockItem[] | undefined> {
    try {
      this.logger.log('staring getting stock data from vn direct');
      const res = await this.httpService
        .request<{ data: VnDirectStockItem[] }>({
          baseURL: 'https://api-finfo.vndirect.com.vn/v4/stocks',
          method: 'get',
          params: {
            q: 'type:STOCK~status:LISTED',
            size: 3000,
            field:
              'code,companyName,companyNameEng,shortName,floor,industryName,price',
          },
        })
        .toPromise();

      return res?.data?.data;
    } catch (error) {
      this.logger.error(`error getting data`, error);
      throw new InternalServerErrorException(error);
    }
  }
}

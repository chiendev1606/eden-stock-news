import { VnDirectIntegrationService } from 'libs/vn-direct-integration/src';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@app/database';

@Injectable()
export class PostService {
  constructor(
    private databaseService: DatabaseService,
    private httpEdenService: VnDirectIntegrationService,
  ) {}

  async findPostById(id: string) {
    const post = await this.databaseService.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async getStockData() {
    console.log(this.databaseService);
    const stockData = await this.databaseService.stock.findMany();
    return stockData;
  }

  async processVnDirectData() {
    const stockData = await this.httpEdenService.getVnDirectStock();
    // await this.databaseService.stock.createMany({
    //   data:
    //     stockData?.map((stock) => ({
    //       symbol: stock.code,
    //       companyName: stock.companyName,
    //       currentPrice: 0,
    //       changePercent: 0,
    //     })) ?? [],
    //   skipDuplicates: true,
    // });
    return stockData;
  }
}

import {
  Global,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/eden-client';
import { ConfigServices } from '../shared/services/config.services';

@Global()
@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private config: ConfigServices) {
    const dbUrl = config.getConstructDBUrl();
    super({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}

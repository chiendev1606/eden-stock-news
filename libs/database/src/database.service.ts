import {
  Global,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/eden-client';

@Global()
@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: Prisma.PrismaClientOptions) {
    console.log(config);
    super(config);
  }
  async onModuleInit() {
    console.log('onModuleInit');
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}

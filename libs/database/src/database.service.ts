import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { DatabaseModuleOptions } from './database.module';
import { PrismaClient } from '@prisma/eden-client';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(DatabaseService.name);
  constructor(
    @Inject('DATABASE_OPTIONS') private options: DatabaseModuleOptions,
  ) {
    super({
      datasources: {
        db: {
          url: options.connectionString,
        },
      },
      log: options.enableLogging
        ? ['query', 'info', 'warn', 'error']
        : undefined,
      errorFormat: 'pretty',
    });
  }
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Successfully connected to database');

      if (this.options.enableMetrics) {
        this.logger.log('📊 Prisma metrics enabled');
      }
    } catch (error) {
      this.logger.error('❌ Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('🔌 Disconnected from database');
    } catch (error) {
      this.logger.error('❌ Error disconnecting from database', error);
    }
  }

  async executeTransaction<T>(
    fn: (
      prisma: Omit<
        PrismaClient,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
      >,
    ) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(fn);
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  async resetDatabase(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot reset database in production environment');
    }

    const tablenames = await this.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

    for (const table of tablenames) {
      try {
        await this.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${table.tablename}" CASCADE;`,
        );
      } catch (error) {
        console.log(`Error truncating ${table.tablename}:`, error);
      }
    }
  }
}

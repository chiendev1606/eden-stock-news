import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { constructDbUrl } from 'apps/api-service/utils/helpers';
import { DatabaseService } from './database.service';

@Module({})
@Global()
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DatabaseService,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return new DatabaseService({
              datasources: {
                db: {
                  url: constructDbUrl({
                    DB_USERNAME: configService.get('DB_USERNAME') ?? '',
                    DB_PASSWORD: configService.get('DB_PASSWORD') ?? '',
                    DB_URL_HOST: configService.get('DB_URL_HOST') as string,
                    DB_PORT: configService.get('DB_PORT') ?? 0,
                    DB_NAME: configService.get('DB_NAME') ?? '',
                  }),
                },
              },
            });
          },
        },
      ],
      exports: [DatabaseService],
    };
  }
}

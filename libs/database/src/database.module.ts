import { DynamicModule, Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { AppConfigModule, AppConfigModuleOptions } from '@app/config';
import { AppConfigService } from '@app/config';

export interface DatabaseModuleOptions {
  /**
   * Database connection string override
   * If not provided, will use DATABASE_URL from config service
   */
  connectionString?: string;
  /**
   * Whether the module should be global
   */
  isGlobal?: boolean;
  /**
   * Whether to enable database query logging
   */
  enableLogging?: boolean;
  /**
   * Whether to enable database metrics
   */
  enableMetrics?: boolean;
  /**
   * Configuration module options
   */
  configOptions?: AppConfigModuleOptions;
}

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseModuleOptions = {}): DynamicModule {
    const {
      configOptions = {},
      isGlobal = true,
      enableLogging = false,
      enableMetrics = false,
      connectionString,
    } = options;

    const providers = [
      {
        provide: 'DATABASE_OPTIONS',
        useFactory: (configService: AppConfigService) => ({
          connectionString: connectionString || configService.getDatabaseUrl(),
          isGlobal,
          enableLogging,
          enableMetrics,
        }),
        inject: [AppConfigService],
      },
      DatabaseService,
    ];

    return {
      module: DatabaseModule,
      imports: [AppConfigModule.forRoot(configOptions)],
      providers,
      exports: [DatabaseService],
      global: isGlobal,
    };
  }
}

import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import {
  ConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import path from 'path';
import { validateConfig } from './utils/validation.util';
import { AppConfigService } from './config.service';

export interface AppConfigModuleOptions
  extends Omit<ConfigModuleOptions, 'validate'> {
  /**
   * Path to the root directory of the monorepo
   */
  rootPath?: string;
  /**
   * Additional env files to load
   */
  additionalEnvFiles?: string[];
  /**
   * Whether to validate environment variables
   */
  validate?: boolean;
  /**
   * Whether to expand variables
   */
  expandVariables?: boolean;
  /**
   * Whether to enable strict mode (fail on unknown variables)
   */
  strictMode?: boolean;
}

@Global()
@Module({})
export class AppConfigModule {
  private static logger = new Logger(AppConfigModule.name);
  static forRoot(options: AppConfigModuleOptions = {}): DynamicModule {
    const {
      rootPath = process.cwd(),
      additionalEnvFiles = [],
      validate = true,
      expandVariables = true,
      strictMode = false,
      ...nestConfigOptions
    } = options;

    AppConfigModule.logger.log(`Loading config from ${rootPath}`);

    // Define env files to load (order matters - later files override earlier ones)
    const envFilePaths = [
      // Root level env files
      path.join(rootPath, '.env'),
      path.join(rootPath, `.env.${process.env.NODE_ENV || 'development'}`),

      // App specific env files
      path.join(process.cwd(), '.env'),
      path.join(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`),

      // Local overrides (should be gitignored)
      path.join(rootPath, '.env.local'),
      path.join(process.cwd(), '.env.local'),

      // Additional env files
      ...additionalEnvFiles,
    ];

    return {
      module: AppConfigModule,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          envFilePath: envFilePaths,
          expandVariables,
          validate: validate ? validateConfig : undefined,
          validationOptions: {
            allowUnknown: !strictMode,
            abortEarly: false,
          },
          load: [
            () => {
              // Store validated config for type-safe access
              const validatedConfig = validate
                ? validateConfig(process.env)
                : process.env;
              return { VALIDATED_CONFIG: validatedConfig };
            },
          ],
          ...nestConfigOptions,
        }),
      ],
      providers: [AppConfigService],
      exports: [AppConfigService],
    };
  }
}

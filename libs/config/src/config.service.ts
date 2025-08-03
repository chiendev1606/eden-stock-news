import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvironmentVariablesDto } from './dto/environment-variables.dto';
import { DatabaseConfigDto } from './dto/database-config.dto';
import { VnDirectConfigDto } from './dto/vndirect-config.dto';

@Injectable()
export class AppConfigService {
  private readonly config: EnvironmentVariablesDto;

  constructor(
    private configService: NestConfigService<EnvironmentVariablesDto>,
  ) {
    this.config = this.configService.get<EnvironmentVariablesDto>(
      'VALIDATED_CONFIG' as any,
    )!;
  }

  get database(): DatabaseConfigDto {
    return this.config.database;
  }

  get vndirect(): VnDirectConfigDto {
    return this.config.vndirect;
  }

  get all(): EnvironmentVariablesDto {
    return this.config;
  }

  // Get nested config with type safety
  getTyped<K extends keyof EnvironmentVariablesDto>(
    key: K,
  ): EnvironmentVariablesDto[K] {
    return this.config[key];
  }

  // Utility methods for common operations
  getDatabaseUrl(): string {
    return this.database.DATABASE_URL;
  }
}

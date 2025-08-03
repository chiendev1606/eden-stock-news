import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { EnvironmentVariablesDto } from '../dto/environment-variables.dto';

// Custom transformer to map flat env variables to nested objects
export function mapEnvToConfig(rawEnv: Record<string, any>) {
  // Map flat environment variables to nested structure
  const mappedConfig: any = {};

  // Database configuration mapping
  mappedConfig.database = {
    DATABASE_URL: rawEnv.DATABASE_URL,
    DB_URL_HOST: rawEnv.DB_URL_HOST,
    DB_PORT: rawEnv.DB_PORT,
    DB_USERNAME: rawEnv.DB_USERNAME,
    DB_PASSWORD: rawEnv.DB_PASSWORD,
    DB_NAME: rawEnv.DB_NAME,
  };

  mappedConfig.vndirect = {
    VN_DIRECT_API_URL: rawEnv.VN_DIRECT_API_URL,
    DCHART_API_BASE_PATH: rawEnv.DCHART_API_BASE_PATH,
  };

  return mappedConfig;
}

export function validateConfig(config: Record<string, any>) {
  // Transform flat env to nested config
  const mappedConfig = mapEnvToConfig(config);

  // Transform to class instance
  const validatedConfig = plainToInstance(
    EnvironmentVariablesDto,
    mappedConfig,
    {
      enableImplicitConversion: true,
    },
  );

  // Validate
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    forbidUnknownValues: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error: ValidationError) => {
        const constraints = Object.values(error.constraints || {});
        const nestedErrors = error.children
          ?.map((child) => Object.values(child.constraints || {}).join(', '))
          .filter(Boolean);

        return [...constraints, ...(nestedErrors || [])].join(', ');
      })
      .join('; ');

    throw new Error(`Environment validation failed: ${errorMessages}`);
  }

  return validatedConfig;
}

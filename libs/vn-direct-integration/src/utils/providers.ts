import { AxiosInstance } from 'axios';
import { Configuration } from '../client/generated';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';

export function injectApiProvider<T>(
  ApiClass: new (
    configuration?: Configuration,
    basePath?: string,
    axios?: AxiosInstance,
  ) => T,
  configKey: string, // Key để lấy config từ ConfigService
): FactoryProvider<T> {
  return {
    provide: ApiClass,
    inject: [HttpService, ConfigService],
    useFactory: (httpService: HttpService, configService: ConfigService) => {
      const basePath = configService.get<string>(configKey);

      if (!basePath) {
        throw new Error(`Configuration key '${configKey}' not found`);
      }

      const config = new Configuration({
        basePath: basePath,
      });

      return new ApiClass(config, config.basePath, httpService.axiosRef);
    },
  };
}

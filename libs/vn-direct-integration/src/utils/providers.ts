import { HttpService } from '@nestjs/axios';
import { FactoryProvider, InternalServerErrorException } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { Configuration } from '../client/generated';
import { AppConfigService } from '@app/config';
import { VnDirectConfigDto } from '@app/config/dto/vndirect-config.dto';

export function injectApiProvider<T>(
  ApiClass: new (
    configuration?: Configuration,
    basePath?: string,
    axios?: AxiosInstance,
  ) => T,
  configKey: keyof VnDirectConfigDto,
): FactoryProvider<T> {
  return {
    provide: ApiClass,
    inject: [HttpService, AppConfigService],
    useFactory: (httpService: HttpService, configService: AppConfigService) => {
      const basePath = configService.vndirect[configKey];

      if (!basePath)
        throw new InternalServerErrorException(
          `${configKey} is required in the config`,
        );

      const config = new Configuration({
        basePath: basePath,
      });

      return new ApiClass(config, config.basePath, httpService.axiosRef);
    },
  };
}

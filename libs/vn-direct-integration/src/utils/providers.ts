import { HttpService } from '@nestjs/axios';
import { FactoryProvider } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { Configuration } from '../client/generated';

export function injectApiProvider<T>(
  ApiClass: new (
    configuration?: Configuration,
    basePath?: string,
    axios?: AxiosInstance,
  ) => T,
): FactoryProvider<T> {
  return {
    provide: ApiClass,
    inject: [HttpService],
    useFactory: (httpService: HttpService) => {
      const basePath = 'https://api-finfo.vndirect.com.vn/v4';

      const config = new Configuration({
        basePath: basePath,
      });

      return new ApiClass(config, config.basePath, httpService.axiosRef);
    },
  };
}

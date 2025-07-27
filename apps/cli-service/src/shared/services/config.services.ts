import { Injectable } from '@nestjs/common';
import { ConfigService as ConfigServiceEnv } from '@nestjs/config';
import { constructDbUrl } from 'apps/api-service/utils/helpers';

@Injectable()
export class ConfigServices {
  constructor(private configEnv: ConfigServiceEnv) {}

  get config() {
    return {
      DB_USERNAME: this.configEnv.get('DB_USERNAME'),
      DB_PASSWORD: this.configEnv.get('DB_PASSWORD'),
      DB_URL_HOST: this.configEnv.get('DB_URL_HOST'),
      DB_PORT: this.configEnv.get('DB_PORT'),
      DB_NAME: this.configEnv.get('DB_NAME'),
    };
  }

  getConstructDBUrl() {
    return constructDbUrl(this.config);
  }
}

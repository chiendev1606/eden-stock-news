import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../../config/validate-config';
import { ConfigServices } from './services/config.services';

const shardServices = [ConfigServices];

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validate,
      isGlobal: true,
    }),
  ],
  exports: shardServices,
  providers: shardServices,
})
export class SharedModule {}

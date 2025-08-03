import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { DatabaseConfigDto } from './database-config.dto';
import { VnDirectConfigDto } from './vndirect-config.dto';

export class EnvironmentVariablesDto {
  @ValidateNested()
  @Type(() => DatabaseConfigDto)
  database: DatabaseConfigDto;

  @ValidateNested()
  @Type(() => VnDirectConfigDto)
  vndirect: VnDirectConfigDto;
}

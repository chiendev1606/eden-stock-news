import { IsString } from 'class-validator';

export class VnDirectConfigDto {
  @IsString()
  VN_DIRECT_API_URL: string;

  @IsString()
  DCHART_API_BASE_PATH: string;
}

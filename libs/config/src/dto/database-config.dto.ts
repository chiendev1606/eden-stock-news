import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class DatabaseConfigDto {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  @IsOptional()
  DB_URL_HOST: string = 'localhost';

  @IsNumber()
  @Min(1)
  @Max(65535)
  @Type(() => Number)
  @IsOptional()
  DB_PORT: number = 5432;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;
}

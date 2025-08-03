import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class HtmlContentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000000)
  @Transform(({ value }) => value?.trim())
  html: string;

  @IsOptional()
  @IsBoolean()
  preserveFormatting?: boolean = false;

  @IsOptional()
  @IsBoolean()
  extractMainContent?: boolean = true;
}

export class StrippedContentDto {
  text: string;
  originalLength: number;
  strippedLength: number;
  processingTime: number;
  cached: boolean;
}

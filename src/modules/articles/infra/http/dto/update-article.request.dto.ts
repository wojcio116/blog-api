import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateArticleRequestDto {
  @ApiPropertyOptional({
    description: 'Updated title of the blog article',
    example: 'Updated Article Title',
    minLength: 3,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated main body text of the blog article',
    example: 'Updated article body content with more details.',
    minLength: 10,
    maxLength: 50000,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50000)
  text?: string;
}

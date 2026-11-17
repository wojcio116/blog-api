import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateArticleRequestDto {
  @ApiProperty({
    description: 'Title of the blog article',
    example: 'Getting Started with CQRS in NestJS',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Main body text of the blog article',
    example: 'CQRS separates read and write operations into distinct models.',
    minLength: 10,
    maxLength: 50000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50000)
  text: string;
}

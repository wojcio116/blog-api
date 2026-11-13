import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../../../model/article.model';
export class ArticleResponseDto {
  @ApiProperty({ example: '5e1f0a2b-0001-4000-8000-000000000001' }) id: string;
  @ApiProperty({ example: 'Building a Clean NestJS API' }) title: string;
  @ApiProperty({ example: 'Article text' }) text: string;
  @ApiProperty({ example: '2026-02-01T12:00:00.000Z' }) publishedAt: Date;
  static fromModel(a: Article): ArticleResponseDto {
    const d = new ArticleResponseDto();
    d.id = a.id;
    d.title = a.title;
    d.text = a.text;
    d.publishedAt = a.publishedAt;
    return d;
  }
}

import { Controller, Get, HttpStatus } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenericBadRequestResponse } from '../../../../core/http/response/bad-request.response';
import { GenericNotFoundResponse } from '../../../../core/http/response/not-found.response';
import { UuidParam } from '../../../../core/validation/decorator/uuid-v4-param.decorator';
import { GetArticleByIdQuery } from '../../application/queries/get-article-by-id.query';
import { GetArticlesQuery } from '../../application/queries/get-articles.query';
import { Article } from '../../model/article.model';
import { ArticleResponseDto } from './dto/article.response.dto';
@ApiTags('articles')
@Controller('api/v1/articles')
export class ArticlesController {
  constructor(private readonly queryBus: QueryBus) {}
  @Get()
  @ApiOperation({ summary: 'List all blog articles, newest first' })
  @ApiResponse({ status: HttpStatus.OK, type: [ArticleResponseDto] })
  async listArticles(): Promise<ArticleResponseDto[]> {
    const list = await this.queryBus.execute<GetArticlesQuery, Article[]>(
      new GetArticlesQuery(),
    );
    return list.map((a) => ArticleResponseDto.fromModel(a));
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get a single blog article by ID' })
  @ApiParam({ name: 'id', example: '5e1f0a2b-0001-4000-8000-000000000001' })
  @ApiResponse({ status: HttpStatus.OK, type: ArticleResponseDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: GenericBadRequestResponse,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: GenericNotFoundResponse })
  async getArticle(@UuidParam('id') id: string): Promise<ArticleResponseDto> {
    const a = await this.queryBus.execute<GetArticleByIdQuery, Article>(
      new GetArticleByIdQuery(id),
    );
    return ArticleResponseDto.fromModel(a);
  }
}

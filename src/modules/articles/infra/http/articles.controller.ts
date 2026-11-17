import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../../../../core/http/auth/admin.guard';
import { GenericBadRequestResponse } from '../../../../core/http/response/bad-request.response';
import { ForbiddenResponse } from '../../../../core/http/response/forbidden.response';
import { GenericNotFoundResponse } from '../../../../core/http/response/not-found.response';
import { UnauthorizedResponse } from '../../../../core/http/response/unauthorized.response';
import { UuidParam } from '../../../../core/validation/decorator/uuid-v4-param.decorator';
import { CreateArticleCommand } from '../../application/commands/create-article.command';
import { DeleteArticleCommand } from '../../application/commands/delete-article.command';
import { UpdateArticleCommand } from '../../application/commands/update-article.command';
import { GetArticleByIdQuery } from '../../application/queries/get-article-by-id.query';
import { GetArticlesQuery } from '../../application/queries/get-articles.query';
import { Article } from '../../model/article.model';
import { ArticleResponseDto } from './dto/article.response.dto';
import { CreateArticleRequestDto } from './dto/create-article.request.dto';
import { UpdateArticleRequestDto } from './dto/update-article.request.dto';

@ApiTags('articles')
@Controller('api/v1/articles')
export class ArticlesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new blog article' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ArticleResponseDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: GenericBadRequestResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedResponse,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ForbiddenResponse })
  async createArticle(
    @Body() dto: CreateArticleRequestDto,
  ): Promise<ArticleResponseDto> {
    const article = await this.commandBus.execute<
      CreateArticleCommand,
      Article
    >(new CreateArticleCommand(dto.title, dto.text));
    return ArticleResponseDto.fromModel(article);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Edit an existing blog article' })
  @ApiParam({ name: 'id', example: '5e1f0a2b-0001-4000-8000-000000000001' })
  @ApiResponse({ status: HttpStatus.OK, type: ArticleResponseDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: GenericBadRequestResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedResponse,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ForbiddenResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: GenericNotFoundResponse })
  async updateArticle(
    @UuidParam('id') id: string,
    @Body() dto: UpdateArticleRequestDto,
  ): Promise<ArticleResponseDto> {
    const article = await this.commandBus.execute<
      UpdateArticleCommand,
      Article
    >(new UpdateArticleCommand(id, dto.title, dto.text));
    return ArticleResponseDto.fromModel(article);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an existing blog article' })
  @ApiParam({ name: 'id', example: '5e1f0a2b-0001-4000-8000-000000000001' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: GenericBadRequestResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedResponse,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ForbiddenResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: GenericNotFoundResponse })
  async deleteArticle(@UuidParam('id') id: string): Promise<void> {
    await this.commandBus.execute<DeleteArticleCommand, void>(
      new DeleteArticleCommand(id),
    );
  }
}

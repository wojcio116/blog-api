import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Article } from '../../model/article.model';
import {
  ARTICLES_REPOSITORY,
  type ArticlesRepository,
} from '../../model/articles.repository';
import { GetArticleByIdQuery } from './get-article-by-id.query';
@QueryHandler(GetArticleByIdQuery)
export class GetArticleByIdHandler implements IQueryHandler<
  GetArticleByIdQuery,
  Article
> {
  constructor(
    @Inject(ARTICLES_REPOSITORY) private readonly repo: ArticlesRepository,
  ) {}
  async execute(q: GetArticleByIdQuery): Promise<Article> {
    const a = await this.repo.findById(q.id);
    if (!a)
      throw new NotFoundException(
        'Article with id "' + q.id + '" does not exist.',
      );
    return a;
  }
}

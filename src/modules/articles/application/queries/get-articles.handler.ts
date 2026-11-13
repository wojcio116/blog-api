import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Article } from '../../model/article.model';
import {
  ARTICLES_REPOSITORY,
  type ArticlesRepository,
} from '../../model/articles.repository';
import { GetArticlesQuery } from './get-articles.query';
@QueryHandler(GetArticlesQuery)
export class GetArticlesHandler implements IQueryHandler<
  GetArticlesQuery,
  Article[]
> {
  constructor(
    @Inject(ARTICLES_REPOSITORY) private readonly repo: ArticlesRepository,
  ) {}
  async execute(): Promise<Article[]> {
    return this.repo.findAll();
  }
}

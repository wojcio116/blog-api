import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Article } from '../../model/article.model';
import {
  ARTICLES_REPOSITORY,
  type ArticlesRepository,
} from '../../model/articles.repository';
import { CreateArticleCommand } from './create-article.command';

@CommandHandler(CreateArticleCommand)
export class CreateArticleHandler implements ICommandHandler<
  CreateArticleCommand,
  Article
> {
  constructor(
    @Inject(ARTICLES_REPOSITORY) private readonly repo: ArticlesRepository,
  ) {}

  async execute(command: CreateArticleCommand): Promise<Article> {
    return this.repo.create({
      title: command.title,
      text: command.text,
    });
  }
}

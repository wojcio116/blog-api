import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Article } from '../../model/article.model';
import {
  ARTICLES_REPOSITORY,
  type ArticlesRepository,
} from '../../model/articles.repository';
import { UpdateArticleCommand } from './update-article.command';

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleHandler implements ICommandHandler<
  UpdateArticleCommand,
  Article
> {
  constructor(
    @Inject(ARTICLES_REPOSITORY) private readonly repo: ArticlesRepository,
  ) {}

  async execute(command: UpdateArticleCommand): Promise<Article> {
    const existing = await this.repo.findById(command.id);
    if (!existing) {
      throw new NotFoundException(
        'Article with id "' + command.id + '" does not exist.',
      );
    }

    return this.repo.update(command.id, {
      title: command.title,
      text: command.text,
    });
  }
}

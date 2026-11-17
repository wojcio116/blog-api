import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ARTICLES_REPOSITORY,
  type ArticlesRepository,
} from '../../model/articles.repository';
import { DeleteArticleCommand } from './delete-article.command';

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleHandler implements ICommandHandler<
  DeleteArticleCommand,
  void
> {
  constructor(
    @Inject(ARTICLES_REPOSITORY) private readonly repo: ArticlesRepository,
  ) {}

  async execute(command: DeleteArticleCommand): Promise<void> {
    const existing = await this.repo.findById(command.id);
    if (!existing) {
      throw new NotFoundException(
        'Article with id "' + command.id + '" does not exist.',
      );
    }

    await this.repo.delete(command.id);
  }
}

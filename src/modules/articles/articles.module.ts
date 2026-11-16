import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { CreateArticleHandler } from './application/commands/create-article.handler';
import { DeleteArticleHandler } from './application/commands/delete-article.handler';
import { UpdateArticleHandler } from './application/commands/update-article.handler';
import { GetArticleByIdHandler } from './application/queries/get-article-by-id.handler';
import { GetArticlesHandler } from './application/queries/get-articles.handler';
import { ArticlesController } from './infra/http/articles.controller';
import { PrismaArticlesRepository } from './infra/persistence/prisma-articles.repository';
import { ARTICLES_REPOSITORY } from './model/articles.repository';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [ArticlesController],
  providers: [
    GetArticlesHandler,
    GetArticleByIdHandler,
    CreateArticleHandler,
    UpdateArticleHandler,
    DeleteArticleHandler,
    { provide: ARTICLES_REPOSITORY, useClass: PrismaArticlesRepository },
  ],
})
export class ArticlesModule {}

import { Module } from '@nestjs/common';
import { ArticlesModule } from './modules/articles/articles.module';
import { StatusController } from './modules/status/status.controller';
@Module({ imports: [ArticlesModule], controllers: [StatusController] })
export class AppModule {}

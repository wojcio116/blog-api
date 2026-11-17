import { Article } from './article.model';

export const ARTICLES_REPOSITORY = Symbol('ARTICLES_REPOSITORY');

export interface ArticlesRepository {
  findAll(): Promise<Article[]>;
  findById(id: string): Promise<Article | null>;
  create(data: { title: string; text: string }): Promise<Article>;
  update(id: string, data: { title?: string; text?: string }): Promise<Article>;
  delete(id: string): Promise<void>;
}

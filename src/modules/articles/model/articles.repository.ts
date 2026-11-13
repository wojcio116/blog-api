import { Article } from './article.model';
export const ARTICLES_REPOSITORY = Symbol('ARTICLES_REPOSITORY');
export interface ArticlesRepository {
  findAll(): Promise<Article[]>;
  findById(id: string): Promise<Article | null>;
}

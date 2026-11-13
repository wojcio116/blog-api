import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/prisma/prisma.service';
import { Article } from '../../model/article.model';
import { ArticlesRepository } from '../../model/articles.repository';
@Injectable()
export class PrismaArticlesRepository implements ArticlesRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(): Promise<Article[]> {
    const rows = await this.prisma.article.findMany({
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    });
    return rows.map((r) => new Article(r.id, r.title, r.text, r.publishedAt));
  }
  async findById(id: string): Promise<Article | null> {
    const r = await this.prisma.article.findUnique({ where: { id } });
    return r ? new Article(r.id, r.title, r.text, r.publishedAt) : null;
  }
}

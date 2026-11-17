import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/prisma/prisma.service';
import { Article } from '../../model/article.model';
import { ArticlesRepository } from '../../model/articles.repository';

@Injectable()
export class PrismaArticlesRepository implements ArticlesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Article[]> {
    const rows = await this.prisma['article'].findMany({
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    });
    return rows.map((r) => new Article(r.id, r.title, r.text, r.publishedAt));
  }

  async findById(id: string): Promise<Article | null> {
    const r = await this.prisma['article'].findUnique({ where: { id } });
    return r ? new Article(r.id, r.title, r.text, r.publishedAt) : null;
  }

  async create(data: { title: string; text: string }): Promise<Article> {
    const r = await this.prisma['article'].create({
      data: { title: data.title, text: data.text },
    });
    return new Article(r.id, r.title, r.text, r.publishedAt);
  }

  async update(
    id: string,
    data: { title?: string; text?: string },
  ): Promise<Article> {
    const r = await this.prisma['article'].update({
      where: { id },
      data,
    });
    return new Article(r.id, r.title, r.text, r.publishedAt);
  }

  async delete(id: string): Promise<void> {
    await this.prisma['article'].delete({ where: { id } });
  }
}

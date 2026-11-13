import * as fs from 'fs';
if (!process.env.DATABASE_URL && fs.existsSync('.env'))
  process.loadEnvFile('.env');
import { PrismaService } from '../../src/core/prisma/prisma.service';
const prisma = new PrismaService();
export async function main() {
  const items = [
    {
      id: '5e1f0a2b-0001-4000-8000-000000000001',
      title: 'Building a Clean NestJS API',
      text: 'In this article we explore layered architecture, CQRS, and PostgreSQL integration with Prisma 7.',
      publishedAt: new Date('2026-02-01T12:00:00.000Z'),
    },
    {
      id: '5e1f0a2b-0002-4000-8000-000000000002',
      title: 'Understanding Idempotent Database Seeds',
      text: 'Why upsert operations keep container restarts safe and predictable in development environments.',
      publishedAt: new Date('2026-01-15T10:00:00.000Z'),
    },
    {
      id: '5e1f0a2b-0003-4000-8000-000000000003',
      title: 'Deterministic Sorting in REST APIs',
      text: 'How secondary ordering by UUID prevents flaky pagination and inconsistent list responses.',
      publishedAt: new Date('2026-01-15T10:00:00.000Z'),
    },
  ];
  for (const a of items)
    await prisma.article.upsert({ where: { id: a.id }, update: {}, create: a });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    await prisma.$disconnect();
    console.error(e);
    process.exit(1);
  });

import * as fs from 'fs';
if (!process.env.DATABASE_URL && fs.existsSync('.env')) {
  process.loadEnvFile('.env');
}
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ?? 'postgres://user:pass@database:5432/app',
});
const prisma = new PrismaClient({ adapter });

const articles = [
  {
    id: '5e1f0a2b-0001-4000-8000-000000000001',
    title: 'Building a Clean NestJS API',
    text: 'In this article we explore layered architecture, CQRS, and PostgreSQL integration with Prisma 7.',
    publishedAt: new Date('2026-02-01T12:00:00.000Z'),
  },
  {
    id: '5e1f0a2b-0002-4000-8000-000000000002',
    title: 'Functional Testing with Cucumber',
    text: 'Writing clear behavior-driven tests for REST APIs using Cucumber and TypeScript.',
    publishedAt: new Date('2026-01-20T10:00:00.000Z'),
  },
  {
    id: '5e1f0a2b-0003-4000-8000-000000000003',
    title: 'Securing Endpoints with NestJS Guards',
    text: 'How bearer token authentication and validation pipes protect write operations.',
    publishedAt: new Date('2026-01-10T08:30:00.000Z'),
  },
];

async function main() {
  for (const article of articles) {
    await prisma.article.upsert({
      where: { id: article.id },
      update: {},
      create: article,
    });
  }
  console.log('Seed OK');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import * as fs from 'fs';
import { defineConfig } from 'prisma/config';
if (fs.existsSync('.env')) process.loadEnvFile('.env');
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node --transpile-only prisma/seed/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL
      ? process.env.DATABASE_URL
      : 'postgres://user:pass@database:5432/app',
  },
});

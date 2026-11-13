import * as fs from 'fs';
if (!process.env.DATABASE_URL && fs.existsSync('.env'))
  process.loadEnvFile('.env');
import { When, Then, Given, After } from '@cucumber/cucumber';
import axios, { AxiosResponse } from 'axios';
import expect from 'expect';
import { execSync } from 'child_process';
import { deepCompare } from '../_helper/deep-compare';
import { PrismaService } from '../../src/core/prisma/prisma.service';
const apiBaseUrl = 'http://localhost:3000';
let apiToken: string | null = null;
let apiResponse: AxiosResponse;
let prevBody: unknown;
Given('I use seed data', () => {
  execSync(
    'npx prisma migrate reset --force > /dev/null && npm run database:seed > /dev/null',
  );
});
Given('the database has no articles', async () => {
  const p = new PrismaService();
  await p.$connect();
  await p.article.deleteMany();
  await p.$disconnect();
});
Given('I use admin token', async () => {
  apiToken = 'admin-token';
});
Given('I use destructive actions token', async () => {
  apiToken = 'destructive-actions-token';
});
When('I send a {string} request to {string}', async (m: string, p: string) => {
  apiResponse = await axios.request({
    method: m,
    url: apiBaseUrl + p,
    validateStatus: () => true,
    headers: apiToken === '' ? {} : { Authorization: 'Bearer ' + apiToken },
  });
});
When(
  'I send a {string} request to {string} with body:',
  async (m: string, p: string, b: string) => {
    apiResponse = await axios.request({
      method: m,
      url: apiBaseUrl + p,
      data: JSON.parse(b),
      validateStatus: () => true,
      headers: apiToken === '' ? {} : { Authorization: 'Bearer ' + apiToken },
    });
  },
);
When('I remember the response body', () => {
  prevBody = apiResponse.data;
});
When('I run the database seed again', () => {
  execSync('npm run database:seed > /dev/null');
});
Then('the response status should be {int}', (s: number) => {
  expect(apiResponse.status).toBe(s);
});
Then('the response body should have the property {string}', (prop: string) => {
  expect(apiResponse.data).toHaveProperty(prop);
});
Then('the response body should contain:', async function (doc: string) {
  deepCompare(apiResponse.data, JSON.parse(doc));
});
Then('the response body should be an empty list', () => {
  expect(apiResponse.data).toEqual([]);
});
Then(
  'the response body should contain {int} articles ordered newest first',
  (c: number) => {
    const arr = apiResponse.data as Array<{ publishedAt: string }>;
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.length).toBe(c);
    for (let i = 0; i < arr.length - 1; i++)
      expect(new Date(arr[i].publishedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(arr[i + 1].publishedAt).getTime(),
      );
  },
);
Then('the response body should match the remembered response body', () => {
  expect(apiResponse.data).toEqual(prevBody);
});
Then('the response body should contain a not found message', () => {
  expect(typeof apiResponse.data.message).toBe('string');
  expect(apiResponse.data.message.toLowerCase()).toContain('does not exist');
});
Then('I dump response', () => {
  console.log(JSON.stringify(apiResponse.data));
});
After(() => {
  apiToken = null;
});

import { beforeAll, afterAll, beforeEach } from 'vitest';
import prisma from '../src/config/database';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await prisma.employee.deleteMany({});
});

beforeEach(async () => {
  await prisma.employee.deleteMany({});
});

afterAll(async () => {
  await prisma.employee.deleteMany({});
  await prisma.$disconnect();
});

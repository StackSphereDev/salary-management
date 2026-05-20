import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { AggregationService } from '../src/services/aggregation.service';

const prisma = new PrismaClient();
const aggregationService = new AggregationService(prisma);

describe('AggregationService', () => {
  beforeEach(async () => {
    await prisma.employee.deleteMany({});
  });

  afterAll(async () => {
    await aggregationService.disconnect();
  });

  describe('getSalaryStatistics', () => {
    it('should calculate correct statistics for multiple employees', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Employee 1',
            email: 'emp1@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee 2',
            email: 'emp2@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 60000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee 3',
            email: 'emp3@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 70000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const stats = await aggregationService.getSalaryStatistics();

      expect(stats.min).toBe(50000);
      expect(stats.max).toBe(70000);
      expect(stats.avg).toBe(60000);
      expect(stats.median).toBe(60000);
      expect(stats.count).toBe(3);
    });

    it('should calculate median correctly for even number of employees', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Employee 1',
            email: 'emp1@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee 2',
            email: 'emp2@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 60000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee 3',
            email: 'emp3@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 70000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee 4',
            email: 'emp4@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 80000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const stats = await aggregationService.getSalaryStatistics();

      expect(stats.median).toBe(65000);
    });

    it('should handle single employee', async () => {
      await prisma.employee.create({
        data: {
          fullName: 'Solo Employee',
          email: 'solo@test.com',
          department: 'Engineering',
          jobTitle: 'Engineer',
          country: 'USA',
          salary: 75000,
          currency: 'USD',
          joiningDate: new Date(),
          employmentType: 'FULL_TIME',
          status: 'ACTIVE',
        },
      });

      const stats = await aggregationService.getSalaryStatistics();

      expect(stats.min).toBe(75000);
      expect(stats.max).toBe(75000);
      expect(stats.avg).toBe(75000);
      expect(stats.median).toBe(75000);
      expect(stats.count).toBe(1);
    });

    it('should return zeros for empty dataset', async () => {
      const stats = await aggregationService.getSalaryStatistics();

      expect(stats.min).toBe(0);
      expect(stats.max).toBe(0);
      expect(stats.avg).toBe(0);
      expect(stats.median).toBe(0);
      expect(stats.count).toBe(0);
    });

    it('should handle decimal salaries correctly', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Employee 1',
            email: 'emp1@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000.33,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee 2',
            email: 'emp2@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 60000.67,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const stats = await aggregationService.getSalaryStatistics();

      expect(stats.avg).toBe(55000.5);
      expect(stats.median).toBe(55000.5);
    });

    it('should filter by where clause', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Engineer 1',
            email: 'eng1@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 80000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Marketer 1',
            email: 'mkt1@test.com',
            department: 'Marketing',
            jobTitle: 'Marketer',
            country: 'USA',
            salary: 60000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const stats = await aggregationService.getSalaryStatistics({
        department: 'Engineering',
      });

      expect(stats.count).toBe(1);
      expect(stats.avg).toBe(80000);
    });
  });

  describe('getSalaryDistribution', () => {
    it('should create correct salary buckets', async () => {
      await prisma.employee.createMany({
        data: Array.from({ length: 10 }, (_, i) => ({
          fullName: `Employee ${i}`,
          email: `emp${i}@test.com`,
          department: 'Engineering',
          jobTitle: 'Engineer',
          country: 'USA',
          salary: 50000 + i * 10000,
          currency: 'USD',
          joiningDate: new Date(),
          employmentType: 'FULL_TIME',
          status: 'ACTIVE',
        })),
      });

      const distribution = await aggregationService.getSalaryDistribution(5);

      expect(distribution).toHaveLength(5);
      expect(distribution[0].minSalary).toBe(50000);
      expect(distribution[4].maxSalary).toBe(140000);
    });

    it('should return empty array when no employees exist', async () => {
      const distribution = await aggregationService.getSalaryDistribution(5);

      expect(distribution).toEqual([]);
    });

    it('should return empty array when all salaries are equal', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Employee 1',
            email: 'emp1@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee 2',
            email: 'emp2@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const distribution = await aggregationService.getSalaryDistribution(5);

      expect(distribution).toEqual([]);
    });

    it('should handle single bucket request', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Employee 1',
            email: 'emp1@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee 2',
            email: 'emp2@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 100000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const distribution = await aggregationService.getSalaryDistribution(1);

      expect(distribution).toHaveLength(1);
      expect(distribution[0].count).toBe(2);
    });
  });

  describe('getTopEarners', () => {
    it('should return top earners in descending order', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Low Earner',
            email: 'low@test.com',
            department: 'Engineering',
            jobTitle: 'Junior',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'High Earner',
            email: 'high@test.com',
            department: 'Engineering',
            jobTitle: 'Senior',
            country: 'USA',
            salary: 150000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Mid Earner',
            email: 'mid@test.com',
            department: 'Engineering',
            jobTitle: 'Mid',
            country: 'USA',
            salary: 100000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const topEarners = await aggregationService.getTopEarners(2);

      expect(topEarners).toHaveLength(2);
      expect(topEarners[0].salary).toBe(150000);
      expect(topEarners[1].salary).toBe(100000);
    });

    it('should respect limit parameter', async () => {
      await prisma.employee.createMany({
        data: Array.from({ length: 10 }, (_, i) => ({
          fullName: `Employee ${i}`,
          email: `emp${i}@test.com`,
          department: 'Engineering',
          jobTitle: 'Engineer',
          country: 'USA',
          salary: 50000 + i * 10000,
          currency: 'USD',
          joiningDate: new Date(),
          employmentType: 'FULL_TIME',
          status: 'ACTIVE',
        })),
      });

      const topEarners = await aggregationService.getTopEarners(3);

      expect(topEarners).toHaveLength(3);
    });

    it('should return empty array when no employees exist', async () => {
      const topEarners = await aggregationService.getTopEarners(5);

      expect(topEarners).toEqual([]);
    });
  });

  describe('getSalaryTrends', () => {
    it('should group by month correctly', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Employee Jan',
            email: 'jan@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date('2023-01-15'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee Feb',
            email: 'feb@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 60000,
            currency: 'USD',
            joiningDate: new Date('2023-02-15'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const trends = await aggregationService.getSalaryTrends('month');

      expect(trends).toHaveLength(2);
      expect(trends[0].period).toBe('2023-01');
      expect(trends[1].period).toBe('2023-02');
    });

    it('should group by quarter correctly', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Employee Q1',
            email: 'q1@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date('2023-01-15'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee Q2',
            email: 'q2@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 60000,
            currency: 'USD',
            joiningDate: new Date('2023-04-15'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const trends = await aggregationService.getSalaryTrends('quarter');

      expect(trends).toHaveLength(2);
      expect(trends[0].period).toBe('2023-Q1');
      expect(trends[1].period).toBe('2023-Q2');
    });

    it('should group by year correctly', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Employee 2022',
            email: '2022@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date('2022-06-15'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee 2023',
            email: '2023@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 60000,
            currency: 'USD',
            joiningDate: new Date('2023-06-15'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const trends = await aggregationService.getSalaryTrends('year');

      expect(trends).toHaveLength(2);
      expect(trends[0].period).toBe('2022');
      expect(trends[1].period).toBe('2023');
    });

    it('should calculate correct statistics per period', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Employee 1',
            email: 'emp1@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date('2023-01-15'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee 2',
            email: 'emp2@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 70000,
            currency: 'USD',
            joiningDate: new Date('2023-01-20'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const trends = await aggregationService.getSalaryTrends('month');

      expect(trends[0].avgSalary).toBe(60000);
      expect(trends[0].minSalary).toBe(50000);
      expect(trends[0].maxSalary).toBe(70000);
      expect(trends[0].employeeCount).toBe(2);
    });

    it('should return empty array when no employees exist', async () => {
      const trends = await aggregationService.getSalaryTrends('month');

      expect(trends).toEqual([]);
    });
  });

  describe('getTotalPayroll', () => {
    it('should calculate total payroll correctly', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Employee 1',
            email: 'emp1@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee 2',
            email: 'emp2@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 60000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const payroll = await aggregationService.getTotalPayroll();

      expect(payroll.totalPayroll).toBe(110000);
      expect(payroll.employeeCount).toBe(2);
    });

    it('should return zero for empty dataset', async () => {
      const payroll = await aggregationService.getTotalPayroll();

      expect(payroll.totalPayroll).toBe(0);
      expect(payroll.employeeCount).toBe(0);
    });

    it('should handle decimal salaries', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Employee 1',
            email: 'emp1@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000.5,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Employee 2',
            email: 'emp2@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 60000.5,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const payroll = await aggregationService.getTotalPayroll();

      expect(payroll.totalPayroll).toBe(110001);
    });
  });

  describe('groupByDepartment', () => {
    it('should group employees by department', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Engineer 1',
            email: 'eng1@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 80000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Marketer 1',
            email: 'mkt1@test.com',
            department: 'Marketing',
            jobTitle: 'Marketer',
            country: 'USA',
            salary: 60000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const groups = await aggregationService.groupByDepartment();

      expect(groups).toHaveLength(2);
      expect(groups[0].department).toBe('Engineering');
      expect(groups[1].department).toBe('Marketing');
    });

    it('should sort by average salary descending', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Engineer 1',
            email: 'eng1@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 100000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Marketer 1',
            email: 'mkt1@test.com',
            department: 'Marketing',
            jobTitle: 'Marketer',
            country: 'USA',
            salary: 60000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const groups = await aggregationService.groupByDepartment();

      expect(groups[0]._avg.salary).toBeGreaterThan(groups[1]._avg.salary!);
    });

    it('should return empty array when no employees exist', async () => {
      const groups = await aggregationService.groupByDepartment();

      expect(groups).toEqual([]);
    });
  });

  describe('getTopPayingDepartments', () => {
    it('should return top paying departments', async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Engineer 1',
            email: 'eng1@test.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 100000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Marketer 1',
            email: 'mkt1@test.com',
            department: 'Marketing',
            jobTitle: 'Marketer',
            country: 'USA',
            salary: 60000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Sales 1',
            email: 'sales1@test.com',
            department: 'Sales',
            jobTitle: 'Sales Rep',
            country: 'USA',
            salary: 80000,
            currency: 'USD',
            joiningDate: new Date(),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });

      const topDepts = await aggregationService.getTopPayingDepartments(2);

      expect(topDepts).toHaveLength(2);
      expect(topDepts[0].department).toBe('Engineering');
      expect(topDepts[0].averageSalary).toBe(100000);
      expect(topDepts[0].totalPayroll).toBe(100000);
    });

    it('should respect limit parameter', async () => {
      await prisma.employee.createMany({
        data: Array.from({ length: 5 }, (_, i) => ({
          fullName: `Employee ${i}`,
          email: `emp${i}@test.com`,
          department: `Dept${i}`,
          jobTitle: 'Engineer',
          country: 'USA',
          salary: 50000,
          currency: 'USD',
          joiningDate: new Date(),
          employmentType: 'FULL_TIME',
          status: 'ACTIVE',
        })),
      });

      const topDepts = await aggregationService.getTopPayingDepartments(3);

      expect(topDepts).toHaveLength(3);
    });
  });
});

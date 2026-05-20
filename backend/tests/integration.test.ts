import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/index';
import prisma from '../src/config/database';

describe('Integration Tests - Complex Scenarios', () => {
  beforeEach(async () => {
    await prisma.employee.deleteMany({});
  });

  describe('Salary Range Filtering', () => {
    beforeEach(async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Low Salary Employee',
            email: 'low@example.com',
            department: 'Engineering',
            jobTitle: 'Junior Engineer',
            country: 'USA',
            salary: 40000,
            currency: 'USD',
            joiningDate: new Date('2023-01-01'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Mid Salary Employee',
            email: 'mid@example.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 70000,
            currency: 'USD',
            joiningDate: new Date('2023-01-01'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'High Salary Employee',
            email: 'high@example.com',
            department: 'Engineering',
            jobTitle: 'Senior Engineer',
            country: 'USA',
            salary: 120000,
            currency: 'USD',
            joiningDate: new Date('2023-01-01'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });
    });

    it('should filter by minimum salary only', async () => {
      const response = await request(app).get('/api/employees?minSalary=60000');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data.every((e: any) => e.salary >= 60000)).toBe(true);
    });

    it('should filter by maximum salary only', async () => {
      const response = await request(app).get('/api/employees?maxSalary=80000');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data.every((e: any) => e.salary <= 80000)).toBe(true);
    });

    it('should filter by salary range', async () => {
      const response = await request(app).get('/api/employees?minSalary=50000&maxSalary=100000');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].salary).toBe(70000);
    });

    it('should return empty when range excludes all employees', async () => {
      const response = await request(app).get('/api/employees?minSalary=200000&maxSalary=300000');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should combine salary range with department filter', async () => {
      await prisma.employee.create({
        data: {
          fullName: 'Marketing Employee',
          email: 'marketing@example.com',
          department: 'Marketing',
          jobTitle: 'Marketer',
          country: 'USA',
          salary: 65000,
          currency: 'USD',
          joiningDate: new Date('2023-01-01'),
          employmentType: 'FULL_TIME',
          status: 'ACTIVE',
        },
      });

      const response = await request(app).get(
        '/api/employees?minSalary=60000&maxSalary=80000&department=Engineering'
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].department).toBe('Engineering');
      expect(response.body.data[0].salary).toBe(70000);
    });
  });

  describe('Multi-Filter Combinations', () => {
    beforeEach(async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Alice Johnson',
            email: 'alice@example.com',
            department: 'Engineering',
            jobTitle: 'Senior Engineer',
            country: 'USA',
            salary: 120000,
            currency: 'USD',
            joiningDate: new Date('2022-01-15'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Bob Smith',
            email: 'bob@example.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'UK',
            salary: 90000,
            currency: 'GBP',
            joiningDate: new Date('2023-03-20'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Charlie Brown',
            email: 'charlie@example.com',
            department: 'Marketing',
            jobTitle: 'Marketing Manager',
            country: 'USA',
            salary: 75000,
            currency: 'USD',
            joiningDate: new Date('2023-02-10'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Diana Prince',
            email: 'diana@example.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 85000,
            currency: 'USD',
            joiningDate: new Date('2023-06-01'),
            employmentType: 'CONTRACT',
            status: 'ACTIVE',
          },
          {
            fullName: 'Eve Davis',
            email: 'eve@example.com',
            department: 'Engineering',
            jobTitle: 'Junior Engineer',
            country: 'USA',
            salary: 60000,
            currency: 'USD',
            joiningDate: new Date('2023-08-15'),
            employmentType: 'FULL_TIME',
            status: 'ON_LEAVE',
          },
        ],
      });
    });

    it('should filter by department, country, and employment type', async () => {
      const response = await request(app).get(
        '/api/employees?department=Engineering&country=USA&employmentType=FULL_TIME'
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(
        response.body.data.every(
          (e: any) =>
            e.department === 'Engineering' &&
            e.country === 'USA' &&
            e.employmentType === 'FULL_TIME'
        )
      ).toBe(true);
    });

    it('should filter by search, department, and status', async () => {
      const response = await request(app).get(
        '/api/employees?search=Engineer&department=Engineering&status=ACTIVE'
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(3);
      expect(response.body.data.every((e: any) => e.status === 'ACTIVE')).toBe(true);
    });

    it('should combine all filters with sorting and pagination', async () => {
      const response = await request(app).get(
        '/api/employees?department=Engineering&country=USA&status=ACTIVE&minSalary=80000&sortBy=salary&order=desc&page=1&limit=10'
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].salary).toBeGreaterThan(response.body.data[1].salary);
    });

    it('should return empty result when no employees match all filters', async () => {
      const response = await request(app).get(
        '/api/employees?department=Engineering&country=UK&employmentType=CONTRACT'
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });
  });

  describe('Pagination Edge Cases', () => {
    beforeEach(async () => {
      const employees = Array.from({ length: 25 }, (_, i) => ({
        fullName: `Employee ${i + 1}`,
        email: `emp${i + 1}@example.com`,
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000 + i * 1000,
        currency: 'USD',
        joiningDate: new Date('2023-01-01'),
        employmentType: 'FULL_TIME' as const,
        status: 'ACTIVE' as const,
      }));

      await prisma.employee.createMany({ data: employees });
    });

    it('should handle last page with partial results', async () => {
      const response = await request(app).get('/api/employees?page=3&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(5);
      expect(response.body.pagination.page).toBe(3);
      expect(response.body.pagination.totalPages).toBe(3);
    });

    it('should handle exact page boundary', async () => {
      const response = await request(app).get('/api/employees?page=2&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(10);
      expect(response.body.pagination.page).toBe(2);
    });

    it('should maintain filter consistency across pages', async () => {
      const page1 = await request(app).get(
        '/api/employees?page=1&limit=10&sortBy=salary&order=asc'
      );
      const page2 = await request(app).get(
        '/api/employees?page=2&limit=10&sortBy=salary&order=asc'
      );

      expect(page1.status).toBe(200);
      expect(page2.status).toBe(200);

      const lastSalaryPage1 = page1.body.data[page1.body.data.length - 1].salary;
      const firstSalaryPage2 = page2.body.data[0].salary;

      expect(firstSalaryPage2).toBeGreaterThan(lastSalaryPage1);
    });
  });

  describe('Sorting Edge Cases', () => {
    beforeEach(async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: 'Alice',
            email: 'alice@example.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date('2023-01-01'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'alice',
            email: 'alice2@example.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date('2023-01-01'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'Bob',
            email: 'bob@example.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date('2023-01-01'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });
    });

    it('should handle case-insensitive sorting by name', async () => {
      const response = await request(app).get('/api/employees?sortBy=fullName&order=asc');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(3);

      const names = response.body.data.map((e: any) => e.fullName.toLowerCase());
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    it('should handle employees with identical salaries', async () => {
      const response = await request(app).get('/api/employees?sortBy=salary&order=asc');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(3);
      expect(response.body.data.every((e: any) => e.salary === 50000)).toBe(true);
    });
  });

  describe('Search Edge Cases', () => {
    beforeEach(async () => {
      await prisma.employee.createMany({
        data: [
          {
            fullName: "O'Brien",
            email: 'obrien@example.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date('2023-01-01'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'John-Paul Smith',
            email: 'jp@example.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date('2023-01-01'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
          {
            fullName: 'María García',
            email: 'maria@example.com',
            department: 'Engineering',
            jobTitle: 'Engineer',
            country: 'USA',
            salary: 50000,
            currency: 'USD',
            joiningDate: new Date('2023-01-01'),
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
          },
        ],
      });
    });

    it('should search names with apostrophes', async () => {
      const response = await request(app).get("/api/employees?search=O'Brien");

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].fullName).toBe("O'Brien");
    });

    it('should search names with hyphens', async () => {
      const response = await request(app).get('/api/employees?search=John-Paul');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].fullName).toBe('John-Paul Smith');
    });

    it('should search names with accented characters', async () => {
      const response = await request(app).get('/api/employees?search=María');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].fullName).toBe('María García');
    });

    it('should handle partial search with special characters', async () => {
      const response = await request(app).get('/api/employees?search=Garc');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Data Consistency', () => {
    it('should maintain referential integrity after multiple operations', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        fullName: 'Test Employee',
        email: 'test@example.com',
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000,
        joiningDate: '2023-01-01',
        employmentType: 'FULL_TIME',
      });

      const employeeId = createResponse.body.id;

      await request(app).put(`/api/employees/${employeeId}`).send({
        fullName: 'Updated Employee',
        email: 'updated@example.com',
        department: 'Marketing',
        jobTitle: 'Marketer',
        country: 'UK',
        salary: 60000,
        joiningDate: '2023-01-01',
        employmentType: 'PART_TIME',
      });

      const getResponse = await request(app).get(`/api/employees/${employeeId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.fullName).toBe('Updated Employee');
      expect(getResponse.body.salary).toBe(60000);
    });

    it('should handle concurrent filter requests consistently', async () => {
      await prisma.employee.createMany({
        data: Array.from({ length: 10 }, (_, i) => ({
          fullName: `Employee ${i}`,
          email: `emp${i}@example.com`,
          department: 'Engineering',
          jobTitle: 'Engineer',
          country: 'USA',
          salary: 50000,
          currency: 'USD',
          joiningDate: new Date('2023-01-01'),
          employmentType: 'FULL_TIME',
          status: 'ACTIVE',
        })),
      });

      const [response1, response2, response3] = await Promise.all([
        request(app).get('/api/employees?department=Engineering'),
        request(app).get('/api/employees?department=Engineering'),
        request(app).get('/api/employees?department=Engineering'),
      ]);

      expect(response1.body.pagination.total).toBe(response2.body.pagination.total);
      expect(response2.body.pagination.total).toBe(response3.body.pagination.total);
    });
  });

  describe('Boundary Value Testing', () => {
    it('should handle salary at exact boundary values', async () => {
      await prisma.employee.create({
        data: {
          fullName: 'Boundary Employee',
          email: 'boundary@example.com',
          department: 'Engineering',
          jobTitle: 'Engineer',
          country: 'USA',
          salary: 50000,
          currency: 'USD',
          joiningDate: new Date('2023-01-01'),
          employmentType: 'FULL_TIME',
          status: 'ACTIVE',
        },
      });

      const response1 = await request(app).get('/api/employees?minSalary=50000');
      expect(response1.body.data.length).toBe(1);

      const response2 = await request(app).get('/api/employees?maxSalary=50000');
      expect(response2.body.data.length).toBe(1);

      const response3 = await request(app).get('/api/employees?minSalary=50000&maxSalary=50000');
      expect(response3.body.data.length).toBe(1);
    });

    it('should handle very large datasets efficiently', async () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        fullName: `Employee ${i}`,
        email: `emp${i}@example.com`,
        department: i % 2 === 0 ? 'Engineering' : 'Marketing',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000 + i * 100,
        currency: 'USD',
        joiningDate: new Date('2023-01-01'),
        employmentType: 'FULL_TIME' as const,
        status: 'ACTIVE' as const,
      }));

      await prisma.employee.createMany({ data: largeDataset });

      const response = await request(app).get('/api/employees?page=1&limit=50');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(50);
      expect(response.body.pagination.total).toBe(100);
    });
  });
});

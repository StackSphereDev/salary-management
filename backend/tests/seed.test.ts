import { describe, it, expect, beforeEach } from 'vitest';
import prisma from '../src/config/database';

describe('Employee Seed Generation', () => {
  beforeEach(async () => {
    await prisma.employee.deleteMany({});
  });

  describe('Employee Count', () => {
    it('should generate exactly 10,000 employees', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();

      expect(employees).toHaveLength(10000);
    });
  });

  describe('Email Uniqueness', () => {
    it('should generate unique emails for all employees', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();
      const emails = employees.map((emp) => emp.email);
      const uniqueEmails = new Set(emails);

      expect(uniqueEmails.size).toBe(10000);
    });

    it('should generate valid email format', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      employees.forEach((emp) => {
        expect(emp.email).toMatch(emailRegex);
      });
    });

    it('should not have duplicate emails when checking case-insensitively', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();
      const lowercaseEmails = employees.map((emp) => emp.email.toLowerCase());
      const uniqueLowercaseEmails = new Set(lowercaseEmails);

      expect(uniqueLowercaseEmails.size).toBe(10000);
    });
  });

  describe('Name Generation', () => {
    it('should combine first and last names in fullName field', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();

      employees.forEach((emp) => {
        expect(emp.fullName).toBeTruthy();
        expect(emp.fullName.split(' ').length).toBeGreaterThanOrEqual(2);
        expect(emp.fullName).not.toContain('undefined');
        expect(emp.fullName).not.toContain('null');
      });
    });

    it('should generate fullName with proper capitalization', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();

      employees.forEach((emp) => {
        const nameParts = emp.fullName.split(' ');
        nameParts.forEach((part) => {
          expect(part[0]).toBe(part[0].toUpperCase());
        });
      });
    });

    it('should not have empty or whitespace-only names', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();

      employees.forEach((emp) => {
        expect(emp.fullName.trim()).toBeTruthy();
        expect(emp.fullName.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Salary Range Validation', () => {
    it('should generate salaries within valid range', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();
      const minSalary = 30000;
      const maxSalary = 250000;

      employees.forEach((emp) => {
        expect(emp.salary).toBeGreaterThanOrEqual(minSalary);
        expect(emp.salary).toBeLessThanOrEqual(maxSalary);
      });
    });

    it('should generate positive salary values', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();

      employees.forEach((emp) => {
        expect(emp.salary).toBeGreaterThan(0);
      });
    });

    it('should generate numeric salary values', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();

      employees.forEach((emp) => {
        expect(typeof emp.salary).toBe('number');
        expect(Number.isFinite(emp.salary)).toBe(true);
        expect(Number.isNaN(emp.salary)).toBe(false);
      });
    });

    it('should have salary distribution across different ranges', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();
      const salaryRanges = {
        low: 0,
        mid: 0,
        high: 0,
      };

      employees.forEach((emp) => {
        if (emp.salary < 80000) salaryRanges.low++;
        else if (emp.salary < 150000) salaryRanges.mid++;
        else salaryRanges.high++;
      });

      expect(salaryRanges.low).toBeGreaterThan(0);
      expect(salaryRanges.mid).toBeGreaterThan(0);
      expect(salaryRanges.high).toBeGreaterThan(0);
    });
  });

  describe('Deterministic Random Generation', () => {
    it('should generate identical data when using the same seed', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees1 = generateEmployees(12345);
      const employees2 = generateEmployees(12345);

      expect(employees1).toHaveLength(employees2.length);

      for (let i = 0; i < employees1.length; i++) {
        expect(employees1[i].fullName).toBe(employees2[i].fullName);
        expect(employees1[i].email).toBe(employees2[i].email);
        expect(employees1[i].salary).toBe(employees2[i].salary);
        expect(employees1[i].department).toBe(employees2[i].department);
        expect(employees1[i].jobTitle).toBe(employees2[i].jobTitle);
        expect(employees1[i].country).toBe(employees2[i].country);
      }
    });

    it('should generate different data when using different seeds', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees1 = generateEmployees(12345);
      const employees2 = generateEmployees(67890);

      let differentCount = 0;
      for (let i = 0; i < Math.min(100, employees1.length); i++) {
        if (
          employees1[i].fullName !== employees2[i].fullName ||
          employees1[i].email !== employees2[i].email ||
          employees1[i].salary !== employees2[i].salary
        ) {
          differentCount++;
        }
      }

      expect(differentCount).toBeGreaterThan(90);
    });

    it('should be reproducible across multiple runs with same seed', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const seed = 99999;
      const runs = 5;
      const results = [];

      for (let i = 0; i < runs; i++) {
        results.push(generateEmployees(seed));
      }

      for (let i = 1; i < runs; i++) {
        expect(results[i][0].fullName).toBe(results[0][0].fullName);
        expect(results[i][0].email).toBe(results[0][0].email);
        expect(results[i][100].salary).toBe(results[0][100].salary);
        expect(results[i][500].department).toBe(results[0][500].department);
      }
    });
  });

  describe('Required Fields', () => {
    it('should populate all required Employee fields', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();
      const requiredFields = [
        'fullName',
        'email',
        'department',
        'jobTitle',
        'country',
        'salary',
        'currency',
        'joiningDate',
        'employmentType',
        'status',
      ];

      employees.forEach((emp) => {
        requiredFields.forEach((field) => {
          expect(emp).toHaveProperty(field);
          expect(emp[field as keyof typeof emp]).toBeTruthy();
        });
      });
    });

    it('should have valid department values', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();
      const validDepartments = [
        'Engineering',
        'Sales',
        'Marketing',
        'HR',
        'Finance',
        'Operations',
        'Product',
        'Customer Support',
        'Legal',
        'IT',
      ];

      employees.forEach((emp) => {
        expect(validDepartments).toContain(emp.department);
      });
    });

    it('should have valid employment type values', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();
      const validTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'];

      employees.forEach((emp) => {
        expect(validTypes).toContain(emp.employmentType);
      });
    });

    it('should have valid status values', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();
      const validStatuses = ['ACTIVE', 'INACTIVE', 'ON_LEAVE'];

      employees.forEach((emp) => {
        expect(validStatuses).toContain(emp.status);
      });
    });

    it('should have valid currency values', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();

      employees.forEach((emp) => {
        expect(emp.currency).toBeTruthy();
        expect(emp.currency.length).toBe(3);
        expect(emp.currency).toMatch(/^[A-Z]{3}$/);
      });
    });

    it('should have valid joiningDate values', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();
      const now = new Date();
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(now.getFullYear() - 5);

      employees.forEach((emp) => {
        expect(emp.joiningDate).toBeInstanceOf(Date);
        expect(emp.joiningDate.getTime()).toBeLessThanOrEqual(now.getTime());
        expect(emp.joiningDate.getTime()).toBeGreaterThanOrEqual(fiveYearsAgo.getTime());
      });
    });
  });

  describe('Data Distribution', () => {
    it('should have reasonable distribution across departments', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();
      const departmentCounts = new Map<string, number>();

      employees.forEach((emp) => {
        departmentCounts.set(emp.department, (departmentCounts.get(emp.department) || 0) + 1);
      });

      departmentCounts.forEach((count, dept) => {
        expect(count).toBeGreaterThan(0);
        expect(count).toBeLessThan(employees.length);
      });
    });

    it('should have reasonable distribution across countries', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();
      const countryCounts = new Map<string, number>();

      employees.forEach((emp) => {
        countryCounts.set(emp.country, (countryCounts.get(emp.country) || 0) + 1);
      });

      expect(countryCounts.size).toBeGreaterThan(1);
      countryCounts.forEach((count, country) => {
        expect(count).toBeGreaterThan(0);
      });
    });

    it('should have majority of employees with ACTIVE status', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();
      const activeCount = employees.filter((emp) => emp.status === 'ACTIVE').length;

      expect(activeCount).toBeGreaterThan(employees.length * 0.7);
    });
  });

  describe('Database Seeding', () => {
    it('should successfully seed database with generated employees', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();

      await prisma.employee.createMany({
        data: employees,
      });

      const count = await prisma.employee.count();
      expect(count).toBe(10000);
    });

    it('should maintain email uniqueness in database', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const employees = generateEmployees();

      await prisma.employee.createMany({
        data: employees,
      });

      const allEmployees = await prisma.employee.findMany();
      const emails = allEmployees.map((emp) => emp.email);
      const uniqueEmails = new Set(emails);

      expect(uniqueEmails.size).toBe(allEmployees.length);
    });
  });

  describe('Performance', () => {
    it('should generate 10k employees in reasonable time', async () => {
      const { generateEmployees } = await import('../prisma/seed');

      const startTime = Date.now();
      const employees = generateEmployees();
      const endTime = Date.now();

      expect(employees).toHaveLength(10000);
      expect(endTime - startTime).toBeLessThan(5000);
    });
  });
});

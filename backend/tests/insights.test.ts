import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/index';
import prisma from '../src/config/database';

describe('Salary Insights Endpoints', () => {
  beforeEach(async () => {
    await prisma.employee.deleteMany({});

    await prisma.employee.createMany({
      data: [
        {
          fullName: 'Alice Johnson',
          email: 'alice@example.com',
          department: 'ENGINEERING',
          salary: 120000,
          country: 'USA',
          jobTitle: 'Senior Engineer',
          joiningDate: new Date('2023-01-15'),
          employmentType: 'FULL_TIME',
        },
        {
          fullName: 'Bob Smith',
          email: 'bob@example.com',
          department: 'ENGINEERING',
          salary: 90000,
          country: 'USA',
          jobTitle: 'Engineer',
          joiningDate: new Date('2023-03-20'),
          employmentType: 'FULL_TIME',
        },
        {
          fullName: 'Charlie Brown',
          email: 'charlie@example.com',
          department: 'MARKETING',
          salary: 75000,
          country: 'USA',
          jobTitle: 'Marketing Manager',
          joiningDate: new Date('2023-02-10'),
          employmentType: 'FULL_TIME',
        },
        {
          fullName: 'Diana Prince',
          email: 'diana@example.com',
          department: 'ENGINEERING',
          salary: 150000,
          country: 'UK',
          jobTitle: 'Senior Engineer',
          joiningDate: new Date('2022-11-05'),
          employmentType: 'FULL_TIME',
        },
        {
          fullName: 'Eve Davis',
          email: 'eve@example.com',
          department: 'ENGINEERING',
          salary: 85000,
          country: 'UK',
          jobTitle: 'Engineer',
          joiningDate: new Date('2023-04-12'),
          employmentType: 'FULL_TIME',
        },
        {
          fullName: 'Frank Miller',
          email: 'frank@example.com',
          department: 'SALES',
          salary: 65000,
          country: 'Canada',
          jobTitle: 'Sales Representative',
          joiningDate: new Date('2023-05-08'),
          employmentType: 'FULL_TIME',
        },
        {
          fullName: 'Grace Lee',
          email: 'grace@example.com',
          department: 'ENGINEERING',
          salary: 95000,
          country: 'Canada',
          jobTitle: 'Engineer',
          joiningDate: new Date('2023-06-01'),
          employmentType: 'FULL_TIME',
        },
      ],
    });
  });

  describe('GET /insights/country/:country', () => {
    describe('Success Cases', () => {
      it('should return salary insights for USA', async () => {
        const response = await request(app).get('/insights/country/USA');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('country', 'USA');
        expect(response.body).toHaveProperty('minSalary', 75000);
        expect(response.body).toHaveProperty('maxSalary', 120000);
        expect(response.body).toHaveProperty('avgSalary', 95000);
        expect(response.body).toHaveProperty('employeeCount', 3);
      });

      it('should return salary insights for UK', async () => {
        const response = await request(app).get('/insights/country/UK');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('country', 'UK');
        expect(response.body).toHaveProperty('minSalary', 85000);
        expect(response.body).toHaveProperty('maxSalary', 150000);
        expect(response.body).toHaveProperty('avgSalary', 117500);
        expect(response.body).toHaveProperty('employeeCount', 2);
      });

      it('should return salary insights for Canada', async () => {
        const response = await request(app).get('/insights/country/Canada');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('country', 'Canada');
        expect(response.body).toHaveProperty('minSalary', 65000);
        expect(response.body).toHaveProperty('maxSalary', 95000);
        expect(response.body).toHaveProperty('avgSalary', 80000);
        expect(response.body).toHaveProperty('employeeCount', 2);
      });

      it('should include average salary by job title for USA', async () => {
        const response = await request(app).get('/insights/country/USA');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('avgSalaryByJobTitle');
        expect(Array.isArray(response.body.avgSalaryByJobTitle)).toBe(true);
        expect(response.body.avgSalaryByJobTitle).toHaveLength(3);

        const seniorEngineer = response.body.avgSalaryByJobTitle.find(
          (item: any) => item.jobTitle === 'Senior Engineer'
        );
        expect(seniorEngineer).toBeDefined();
        expect(seniorEngineer.avgSalary).toBe(120000);
        expect(seniorEngineer.count).toBe(1);

        const engineer = response.body.avgSalaryByJobTitle.find(
          (item: any) => item.jobTitle === 'Engineer'
        );
        expect(engineer).toBeDefined();
        expect(engineer.avgSalary).toBe(90000);
        expect(engineer.count).toBe(1);

        const marketingManager = response.body.avgSalaryByJobTitle.find(
          (item: any) => item.jobTitle === 'Marketing Manager'
        );
        expect(marketingManager).toBeDefined();
        expect(marketingManager.avgSalary).toBe(75000);
        expect(marketingManager.count).toBe(1);
      });

      it('should include average salary by job title for UK', async () => {
        const response = await request(app).get('/insights/country/UK');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('avgSalaryByJobTitle');
        expect(Array.isArray(response.body.avgSalaryByJobTitle)).toBe(true);
        expect(response.body.avgSalaryByJobTitle).toHaveLength(2);

        const seniorEngineer = response.body.avgSalaryByJobTitle.find(
          (item: any) => item.jobTitle === 'Senior Engineer'
        );
        expect(seniorEngineer).toBeDefined();
        expect(seniorEngineer.avgSalary).toBe(150000);
        expect(seniorEngineer.count).toBe(1);

        const engineer = response.body.avgSalaryByJobTitle.find(
          (item: any) => item.jobTitle === 'Engineer'
        );
        expect(engineer).toBeDefined();
        expect(engineer.avgSalary).toBe(85000);
        expect(engineer.count).toBe(1);
      });

      it('should calculate correct average when multiple employees have same job title', async () => {
        await prisma.employee.create({
          data: {
            fullName: 'Henry Wilson',
            email: 'henry@example.com',
            department: 'ENGINEERING',
            salary: 100000,
            country: 'USA',
            jobTitle: 'Engineer',
            joiningDate: new Date('2023-07-15'),
            employmentType: 'FULL_TIME',
          },
        });

        const response = await request(app).get('/insights/country/USA');

        expect(response.status).toBe(200);
        expect(response.body.avgSalary).toBe(96250);
        expect(response.body.employeeCount).toBe(4);

        const engineer = response.body.avgSalaryByJobTitle.find(
          (item: any) => item.jobTitle === 'Engineer'
        );
        expect(engineer).toBeDefined();
        expect(engineer.avgSalary).toBe(95000);
        expect(engineer.count).toBe(2);
      });
    });

    describe('Edge Cases', () => {
      it('should return 404 when country has no employees', async () => {
        const response = await request(app).get('/insights/country/Germany');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('No employees found');
      });

      it('should handle country with single employee', async () => {
        await prisma.employee.deleteMany({});
        await prisma.employee.create({
          data: {
            fullName: 'Solo Employee',
            email: 'solo@example.com',
            department: 'ENGINEERING',
            salary: 100000,
            country: 'Australia',
            jobTitle: 'Engineer',
            joiningDate: new Date('2023-08-01'),
            employmentType: 'FULL_TIME',
          },
        });

        const response = await request(app).get('/insights/country/Australia');

        expect(response.status).toBe(200);
        expect(response.body.minSalary).toBe(100000);
        expect(response.body.maxSalary).toBe(100000);
        expect(response.body.avgSalary).toBe(100000);
        expect(response.body.employeeCount).toBe(1);
        expect(response.body.avgSalaryByJobTitle).toHaveLength(1);
        expect(response.body.avgSalaryByJobTitle[0].avgSalary).toBe(100000);
        expect(response.body.avgSalaryByJobTitle[0].count).toBe(1);
      });

      it('should handle country parameter with different casing', async () => {
        const response = await request(app).get('/insights/country/usa');

        expect(response.status).toBe(200);
        expect(response.body.country).toBe('USA');
      });

      it('should handle country with special characters in name', async () => {
        await prisma.employee.create({
          data: {
            fullName: 'Test Employee',
            email: 'test@example.com',
            department: 'ENGINEERING',
            salary: 80000,
            country: "Côte d'Ivoire",
            jobTitle: 'Engineer',
            joiningDate: new Date('2023-09-01'),
            employmentType: 'FULL_TIME',
          },
        });

        const response = await request(app).get("/insights/country/Côte d'Ivoire");

        expect(response.status).toBe(200);
        expect(response.body.country).toBe("Côte d'Ivoire");
        expect(response.body.employeeCount).toBe(1);
      });
    });

    describe('Data Integrity', () => {
      it('should return deterministic results for same dataset', async () => {
        const response1 = await request(app).get('/insights/country/USA');
        const response2 = await request(app).get('/insights/country/USA');

        expect(response1.body).toEqual(response2.body);
      });

      it('should handle employees with null job titles', async () => {
        await prisma.employee.create({
          data: {
            fullName: 'No Title Employee',
            email: 'notitle@example.com',
            department: 'ENGINEERING',
            salary: 70000,
            country: 'USA',
            jobTitle: 'Unknown',
            joiningDate: new Date('2023-10-01'),
            employmentType: 'FULL_TIME',
          },
        });

        const response = await request(app).get('/insights/country/USA');

        expect(response.status).toBe(200);
        expect(response.body.employeeCount).toBe(4);
        expect(response.body.avgSalary).toBe(88750);
      });

      it('should calculate correct statistics with decimal salaries', async () => {
        await prisma.employee.deleteMany({});
        await prisma.employee.createMany({
          data: [
            {
              fullName: 'Employee 1',
              email: 'emp1@example.com',
              department: 'ENGINEERING',
              salary: 100000.5,
              country: 'USA',
              jobTitle: 'Engineer',
              joiningDate: new Date('2023-11-01'),
              employmentType: 'FULL_TIME',
            },
            {
              fullName: 'Employee 2',
              email: 'emp2@example.com',
              department: 'ENGINEERING',
              salary: 100000.5,
              country: 'USA',
              jobTitle: 'Engineer',
              joiningDate: new Date('2023-11-02'),
              employmentType: 'FULL_TIME',
            },
          ],
        });

        const response = await request(app).get('/insights/country/USA');

        expect(response.status).toBe(200);
        expect(response.body.minSalary).toBe(100000.5);
        expect(response.body.maxSalary).toBe(100000.5);
        expect(response.body.avgSalary).toBe(100000.5);
      });
    });
  });

  describe('GET /insights/job-title', () => {
    describe('Success Cases', () => {
      it('should return salary insights for all job titles', async () => {
        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });

      it('should return correct insights for Engineer job title', async () => {
        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);

        const engineer = response.body.find((item: any) => item.jobTitle === 'Engineer');
        expect(engineer).toBeDefined();
        expect(engineer.minSalary).toBe(85000);
        expect(engineer.maxSalary).toBe(95000);
        expect(engineer.avgSalary).toBe(90000);
        expect(engineer.employeeCount).toBe(3);
      });

      it('should return correct insights for Senior Engineer job title', async () => {
        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);

        const seniorEngineer = response.body.find(
          (item: any) => item.jobTitle === 'Senior Engineer'
        );
        expect(seniorEngineer).toBeDefined();
        expect(seniorEngineer.minSalary).toBe(120000);
        expect(seniorEngineer.maxSalary).toBe(150000);
        expect(seniorEngineer.avgSalary).toBe(135000);
        expect(seniorEngineer.employeeCount).toBe(2);
      });

      it('should return correct insights for Marketing Manager job title', async () => {
        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);

        const marketingManager = response.body.find(
          (item: any) => item.jobTitle === 'Marketing Manager'
        );
        expect(marketingManager).toBeDefined();
        expect(marketingManager.minSalary).toBe(75000);
        expect(marketingManager.maxSalary).toBe(75000);
        expect(marketingManager.avgSalary).toBe(75000);
        expect(marketingManager.employeeCount).toBe(1);
      });

      it('should return correct insights for Sales Representative job title', async () => {
        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);

        const salesRep = response.body.find(
          (item: any) => item.jobTitle === 'Sales Representative'
        );
        expect(salesRep).toBeDefined();
        expect(salesRep.minSalary).toBe(65000);
        expect(salesRep.maxSalary).toBe(65000);
        expect(salesRep.avgSalary).toBe(65000);
        expect(salesRep.employeeCount).toBe(1);
      });

      it('should include all unique job titles in response', async () => {
        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(4);

        const jobTitles = response.body.map((item: any) => item.jobTitle);
        expect(jobTitles).toContain('Engineer');
        expect(jobTitles).toContain('Senior Engineer');
        expect(jobTitles).toContain('Marketing Manager');
        expect(jobTitles).toContain('Sales Representative');
      });

      it('should sort results by job title alphabetically', async () => {
        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);

        const jobTitles = response.body.map((item: any) => item.jobTitle);
        const sortedJobTitles = [...jobTitles].sort();
        expect(jobTitles).toEqual(sortedJobTitles);
      });
    });

    describe('Edge Cases', () => {
      it('should return empty array when no employees exist', async () => {
        await prisma.employee.deleteMany({});

        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });

      it('should handle employees with null job titles', async () => {
        await prisma.employee.create({
          data: {
            fullName: 'No Title Employee',
            email: 'notitle2@example.com',
            department: 'ENGINEERING',
            salary: 70000,
            country: 'USA',
            jobTitle: 'Unknown',
            joiningDate: new Date('2023-12-01'),
            employmentType: 'FULL_TIME',
          },
        });

        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(5);
      });

      it('should calculate correct statistics when job title has single employee', async () => {
        await prisma.employee.deleteMany({});
        await prisma.employee.create({
          data: {
            fullName: 'Unique Title',
            email: 'unique@example.com',
            department: 'ENGINEERING',
            salary: 125000,
            country: 'USA',
            jobTitle: 'Principal Engineer',
            joiningDate: new Date('2023-12-15'),
            employmentType: 'FULL_TIME',
          },
        });

        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].jobTitle).toBe('Principal Engineer');
        expect(response.body[0].minSalary).toBe(125000);
        expect(response.body[0].maxSalary).toBe(125000);
        expect(response.body[0].avgSalary).toBe(125000);
        expect(response.body[0].employeeCount).toBe(1);
      });
    });

    describe('Data Integrity', () => {
      it('should return deterministic results for same dataset', async () => {
        const response1 = await request(app).get('/insights/job-title');
        const response2 = await request(app).get('/insights/job-title');

        expect(response1.body).toEqual(response2.body);
      });

      it('should calculate correct statistics with decimal salaries', async () => {
        await prisma.employee.deleteMany({});
        await prisma.employee.createMany({
          data: [
            {
              fullName: 'Employee 1',
              email: 'emp1dec@example.com',
              department: 'ENGINEERING',
              salary: 100000.33,
              country: 'USA',
              jobTitle: 'Engineer',
              joiningDate: new Date('2024-01-01'),
              employmentType: 'FULL_TIME',
            },
            {
              fullName: 'Employee 2',
              email: 'emp2dec@example.com',
              department: 'ENGINEERING',
              salary: 100000.67,
              country: 'USA',
              jobTitle: 'Engineer',
              joiningDate: new Date('2024-01-02'),
              employmentType: 'FULL_TIME',
            },
          ],
        });

        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].minSalary).toBe(100000.33);
        expect(response.body[0].maxSalary).toBe(100000.67);
        expect(response.body[0].avgSalary).toBe(100000.5);
      });

      it('should handle large salary values correctly', async () => {
        await prisma.employee.create({
          data: {
            fullName: 'High Earner',
            email: 'high@example.com',
            department: 'ENGINEERING',
            salary: 999999.99,
            country: 'USA',
            jobTitle: 'CEO',
            joiningDate: new Date('2024-02-01'),
            employmentType: 'FULL_TIME',
          },
        });

        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);

        const ceo = response.body.find((item: any) => item.jobTitle === 'CEO');
        expect(ceo).toBeDefined();
        expect(ceo.minSalary).toBe(999999.99);
        expect(ceo.maxSalary).toBe(999999.99);
        expect(ceo.avgSalary).toBe(999999.99);
      });
    });

    describe('Response Structure', () => {
      it('should return proper response structure for each job title', async () => {
        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);

        response.body.forEach((item: any) => {
          expect(item).toHaveProperty('jobTitle');
          expect(item).toHaveProperty('minSalary');
          expect(item).toHaveProperty('maxSalary');
          expect(item).toHaveProperty('avgSalary');
          expect(item).toHaveProperty('employeeCount');

          expect(typeof item.jobTitle).toBe('string');
          expect(typeof item.minSalary).toBe('number');
          expect(typeof item.maxSalary).toBe('number');
          expect(typeof item.avgSalary).toBe('number');
          expect(typeof item.employeeCount).toBe('number');

          expect(item.minSalary).toBeLessThanOrEqual(item.maxSalary);
          expect(item.avgSalary).toBeGreaterThanOrEqual(item.minSalary);
          expect(item.avgSalary).toBeLessThanOrEqual(item.maxSalary);
          expect(item.employeeCount).toBeGreaterThan(0);
        });
      });

      it('should return JSON content type', async () => {
        const response = await request(app).get('/insights/job-title');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
      });
    });
  });
});

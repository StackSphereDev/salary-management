import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index';

describe('Employee Validators', () => {
  describe('createEmployeeValidator - Field Length Validation', () => {
    it('should reject fullName shorter than 2 characters', async () => {
      const response = await request(app).post('/api/employees').send({
        fullName: 'A',
        email: 'test@example.com',
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000,
        joiningDate: '2023-01-01',
        employmentType: 'FULL_TIME',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Full name');
    });

    it('should reject fullName longer than 100 characters', async () => {
      const response = await request(app)
        .post('/api/employees')
        .send({
          fullName: 'A'.repeat(101),
          email: 'test@example.com',
          department: 'Engineering',
          jobTitle: 'Engineer',
          country: 'USA',
          salary: 50000,
          joiningDate: '2023-01-01',
          employmentType: 'FULL_TIME',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Full name');
    });

    it('should accept fullName at minimum length (2 characters)', async () => {
      const response = await request(app).post('/api/employees').send({
        fullName: 'AB',
        email: 'test@example.com',
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000,
        joiningDate: '2023-01-01',
        employmentType: 'FULL_TIME',
      });

      expect(response.status).toBe(201);
    });

    it('should accept fullName at maximum length (100 characters)', async () => {
      const response = await request(app)
        .post('/api/employees')
        .send({
          fullName: 'A'.repeat(100),
          email: 'test100@example.com',
          department: 'Engineering',
          jobTitle: 'Engineer',
          country: 'USA',
          salary: 50000,
          joiningDate: '2023-01-01',
          employmentType: 'FULL_TIME',
        });

      expect(response.status).toBe(201);
    });

    it('should reject jobTitle shorter than 2 characters', async () => {
      const response = await request(app).post('/api/employees').send({
        fullName: 'John Doe',
        email: 'test@example.com',
        department: 'Engineering',
        jobTitle: 'E',
        country: 'USA',
        salary: 50000,
        joiningDate: '2023-01-01',
        employmentType: 'FULL_TIME',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Job title');
    });

    it('should reject jobTitle longer than 100 characters', async () => {
      const response = await request(app)
        .post('/api/employees')
        .send({
          fullName: 'John Doe',
          email: 'test@example.com',
          department: 'Engineering',
          jobTitle: 'E'.repeat(101),
          country: 'USA',
          salary: 50000,
          joiningDate: '2023-01-01',
          employmentType: 'FULL_TIME',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Job title');
    });

    it('should reject country shorter than 2 characters', async () => {
      const response = await request(app).post('/api/employees').send({
        fullName: 'John Doe',
        email: 'test@example.com',
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'U',
        salary: 50000,
        joiningDate: '2023-01-01',
        employmentType: 'FULL_TIME',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Country');
    });

    it('should reject country longer than 100 characters', async () => {
      const response = await request(app)
        .post('/api/employees')
        .send({
          fullName: 'John Doe',
          email: 'test@example.com',
          department: 'Engineering',
          jobTitle: 'Engineer',
          country: 'C'.repeat(101),
          salary: 50000,
          joiningDate: '2023-01-01',
          employmentType: 'FULL_TIME',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Country');
    });
  });

  describe('createEmployeeValidator - Department Validation', () => {
    it('should accept valid departments', async () => {
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

      for (const dept of validDepartments) {
        const response = await request(app)
          .post('/api/employees')
          .send({
            fullName: `Test Employee ${dept}`,
            email: `test-${dept.toLowerCase()}@example.com`,
            department: dept,
            jobTitle: 'Employee',
            country: 'USA',
            salary: 50000,
            joiningDate: '2023-01-01',
            employmentType: 'FULL_TIME',
          });

        expect(response.status).toBe(201);
      }
    });

    it('should reject invalid department', async () => {
      const response = await request(app).post('/api/employees').send({
        fullName: 'John Doe',
        email: 'test@example.com',
        department: 'InvalidDepartment',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000,
        joiningDate: '2023-01-01',
        employmentType: 'FULL_TIME',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Department');
    });
  });

  describe('createEmployeeValidator - Employment Type Validation', () => {
    it('should accept valid employment types', async () => {
      const validTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'];

      for (const type of validTypes) {
        const response = await request(app)
          .post('/api/employees')
          .send({
            fullName: `Test Employee ${type}`,
            email: `test-${type.toLowerCase()}@example.com`,
            department: 'Engineering',
            jobTitle: 'Employee',
            country: 'USA',
            salary: 50000,
            joiningDate: '2023-01-01',
            employmentType: type,
          });

        expect(response.status).toBe(201);
      }
    });

    it('should reject invalid employment type', async () => {
      const response = await request(app).post('/api/employees').send({
        fullName: 'John Doe',
        email: 'test@example.com',
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000,
        joiningDate: '2023-01-01',
        employmentType: 'INVALID_TYPE',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Employment type');
    });
  });

  describe('createEmployeeValidator - Currency Validation', () => {
    it('should accept valid currencies', async () => {
      const validCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'];

      for (const currency of validCurrencies) {
        const response = await request(app)
          .post('/api/employees')
          .send({
            fullName: `Test Employee ${currency}`,
            email: `test-${currency.toLowerCase()}@example.com`,
            department: 'Engineering',
            jobTitle: 'Employee',
            country: 'USA',
            salary: 50000,
            currency,
            joiningDate: '2023-01-01',
            employmentType: 'FULL_TIME',
          });

        expect(response.status).toBe(201);
      }
    });

    it('should reject invalid currency', async () => {
      const response = await request(app).post('/api/employees').send({
        fullName: 'John Doe',
        email: 'test@example.com',
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000,
        currency: 'XYZ',
        joiningDate: '2023-01-01',
        employmentType: 'FULL_TIME',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Currency');
    });
  });

  describe('createEmployeeValidator - Date Validation', () => {
    it('should accept valid ISO8601 date', async () => {
      const response = await request(app).post('/api/employees').send({
        fullName: 'John Doe',
        email: 'test@example.com',
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000,
        joiningDate: '2023-06-15T10:30:00Z',
        employmentType: 'FULL_TIME',
      });

      expect(response.status).toBe(201);
    });

    it('should reject invalid date format', async () => {
      const response = await request(app).post('/api/employees').send({
        fullName: 'John Doe',
        email: 'test@example.com',
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000,
        joiningDate: '15/06/2023',
        employmentType: 'FULL_TIME',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Joining date');
    });

    it('should reject non-date string', async () => {
      const response = await request(app).post('/api/employees').send({
        fullName: 'John Doe',
        email: 'test@example.com',
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000,
        joiningDate: 'not-a-date',
        employmentType: 'FULL_TIME',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Joining date');
    });
  });

  describe('createEmployeeValidator - Status Validation', () => {
    it('should accept valid status values', async () => {
      const validStatuses = ['ACTIVE', 'INACTIVE', 'ON_LEAVE'];

      for (const status of validStatuses) {
        const response = await request(app)
          .post('/api/employees')
          .send({
            fullName: `Test Employee ${status}`,
            email: `test-${status.toLowerCase()}@example.com`,
            department: 'Engineering',
            jobTitle: 'Employee',
            country: 'USA',
            salary: 50000,
            joiningDate: '2023-01-01',
            employmentType: 'FULL_TIME',
            status,
          });

        expect(response.status).toBe(201);
      }
    });

    it('should reject invalid status', async () => {
      const response = await request(app).post('/api/employees').send({
        fullName: 'John Doe',
        email: 'test@example.com',
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000,
        joiningDate: '2023-01-01',
        employmentType: 'FULL_TIME',
        status: 'INVALID_STATUS',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Status');
    });

    it('should default to ACTIVE when status not provided', async () => {
      const response = await request(app).post('/api/employees').send({
        fullName: 'John Doe',
        email: 'test-default@example.com',
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000,
        joiningDate: '2023-01-01',
        employmentType: 'FULL_TIME',
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });
  });

  describe('listEmployeesValidator - Query Parameter Validation', () => {
    it('should reject page less than 1', async () => {
      const response = await request(app).get('/api/employees?page=0');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Page');
    });

    it('should reject negative page', async () => {
      const response = await request(app).get('/api/employees?page=-5');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Page');
    });

    it('should reject limit less than 1', async () => {
      const response = await request(app).get('/api/employees?limit=0');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Page size');
    });

    it('should reject limit greater than 100', async () => {
      const response = await request(app).get('/api/employees?limit=101');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Page size');
    });

    it('should accept limit at boundary (100)', async () => {
      const response = await request(app).get('/api/employees?limit=100');

      expect(response.status).toBe(200);
    });

    it('should reject invalid sortBy field', async () => {
      const response = await request(app).get('/api/employees?sortBy=invalidField');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid sort field');
    });

    it('should accept valid sortBy fields', async () => {
      const validFields = [
        'fullName',
        'email',
        'department',
        'salary',
        'joiningDate',
        'createdAt',
        'country',
        'status',
        'name',
      ];

      for (const field of validFields) {
        const response = await request(app).get(`/api/employees?sortBy=${field}`);
        expect(response.status).toBe(200);
      }
    });

    it('should reject invalid order value', async () => {
      const response = await request(app).get('/api/employees?sortBy=salary&order=invalid');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Sort order');
    });

    it('should accept valid order values', async () => {
      const response1 = await request(app).get('/api/employees?sortBy=salary&order=asc');
      expect(response1.status).toBe(200);

      const response2 = await request(app).get('/api/employees?sortBy=salary&order=desc');
      expect(response2.status).toBe(200);
    });

    it('should reject search term longer than 100 characters', async () => {
      const response = await request(app).get(`/api/employees?search=${'a'.repeat(101)}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Search term');
    });

    it('should accept search term at maximum length (100)', async () => {
      const response = await request(app).get(`/api/employees?search=${'a'.repeat(100)}`);

      expect(response.status).toBe(200);
    });

    it('should reject negative minSalary', async () => {
      const response = await request(app).get('/api/employees?minSalary=-1000');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Minimum salary');
    });

    it('should reject negative maxSalary', async () => {
      const response = await request(app).get('/api/employees?maxSalary=-1000');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Maximum salary');
    });

    it('should accept zero as minSalary', async () => {
      const response = await request(app).get('/api/employees?minSalary=0');

      expect(response.status).toBe(200);
    });

    it('should accept decimal salary values', async () => {
      const response = await request(app).get(
        '/api/employees?minSalary=50000.50&maxSalary=100000.99'
      );

      expect(response.status).toBe(200);
    });
  });

  describe('employeeIdValidator - ID Parameter Validation', () => {
    it('should reject empty ID', async () => {
      const response = await request(app).get('/api/employees/ ');

      expect(response.status).toBe(404);
    });

    it('should reject ID with special characters (hyphen)', async () => {
      const response = await request(app).put('/api/employees/invalid-id').send({
        fullName: 'Test',
        email: 'test@example.com',
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000,
        joiningDate: '2023-01-01',
        employmentType: 'FULL_TIME',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('id');
    });

    it('should reject negative ID', async () => {
      const response = await request(app).delete('/api/employees/-123');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('id');
    });

    it('should reject zero as ID', async () => {
      const response = await request(app).delete('/api/employees/0');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('id');
    });

    it('should accept numeric ID', async () => {
      const response = await request(app).get('/api/employees/999999');

      expect([200, 404]).toContain(response.status);
    });

    it('should accept cuid format ID', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        fullName: 'Test Employee',
        email: 'cuid-test@example.com',
        department: 'Engineering',
        jobTitle: 'Engineer',
        country: 'USA',
        salary: 50000,
        joiningDate: '2023-01-01',
        employmentType: 'FULL_TIME',
      });

      const employeeId = createResponse.body.id;
      const response = await request(app).get(`/api/employees/${employeeId}`);

      expect([200, 404]).toContain(response.status);
    });
  });
});

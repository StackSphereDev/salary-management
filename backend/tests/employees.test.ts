import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index';

describe('POST /employees', () => {
  describe('Validation - Required Fields', () => {
    it('should return 400 when name is missing', async () => {
      const response = await request(app).post('/employees').send({
        email: 'john.doe@example.com',
        department: 'Engineering',
        salary: 75000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('name');
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app).post('/employees').send({
        name: 'John Doe',
        department: 'Engineering',
        salary: 75000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('email');
    });

    it('should return 400 when department is missing', async () => {
      const response = await request(app).post('/employees').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        salary: 75000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('department');
    });

    it('should return 400 when salary is missing', async () => {
      const response = await request(app).post('/employees').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        department: 'Engineering',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('salary');
    });

    it('should return 400 when all fields are missing', async () => {
      const response = await request(app).post('/employees').send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Validation - Email Format', () => {
    it('should return 400 when email format is invalid - missing @', async () => {
      const response = await request(app).post('/employees').send({
        name: 'John Doe',
        email: 'invalidemail.com',
        department: 'Engineering',
        salary: 75000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('email');
    });

    it('should return 400 when email format is invalid - missing domain', async () => {
      const response = await request(app).post('/employees').send({
        name: 'John Doe',
        email: 'john.doe@',
        department: 'Engineering',
        salary: 75000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('email');
    });

    it('should return 400 when email format is invalid - missing local part', async () => {
      const response = await request(app).post('/employees').send({
        name: 'John Doe',
        email: '@example.com',
        department: 'Engineering',
        salary: 75000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('email');
    });

    it('should return 400 when email is empty string', async () => {
      const response = await request(app).post('/employees').send({
        name: 'John Doe',
        email: '',
        department: 'Engineering',
        salary: 75000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('email');
    });
  });

  describe('Validation - Salary', () => {
    it('should return 400 when salary is 0', async () => {
      const response = await request(app).post('/employees').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        department: 'Engineering',
        salary: 0,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('salary');
    });

    it('should return 400 when salary is negative', async () => {
      const response = await request(app).post('/employees').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        department: 'Engineering',
        salary: -5000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('salary');
    });

    it('should return 400 when salary is not a number', async () => {
      const response = await request(app).post('/employees').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        department: 'Engineering',
        salary: 'invalid',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('salary');
    });
  });

  describe('Success Cases', () => {
    it('should return 201 when employee is created successfully', async () => {
      const validEmployee = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        department: 'Marketing',
        salary: 65000,
      };

      const response = await request(app).post('/employees').send(validEmployee);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', validEmployee.name);
      expect(response.body).toHaveProperty('email', validEmployee.email);
      expect(response.body).toHaveProperty('department', validEmployee.department);
      expect(response.body).toHaveProperty('salary', validEmployee.salary);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return 201 with minimum valid salary (0.01)', async () => {
      const validEmployee = {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        department: 'Sales',
        salary: 0.01,
      };

      const response = await request(app).post('/employees').send(validEmployee);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('salary', validEmployee.salary);
    });

    it('should return 201 with large salary value', async () => {
      const validEmployee = {
        name: 'Alice Williams',
        email: 'alice.williams@example.com',
        department: 'Executive',
        salary: 500000,
      };

      const response = await request(app).post('/employees').send(validEmployee);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('salary', validEmployee.salary);
    });
  });

  describe('Error Response Structure', () => {
    it('should return proper error response structure', async () => {
      const response = await request(app).post('/employees').send({
        name: 'Test User',
        email: 'invalid-email',
        department: 'IT',
        salary: -100,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(typeof (response.body as { error: string }).error).toBe('string');
    });

    it('should return JSON content type for errors', async () => {
      const response = await request(app).post('/employees').send({});

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});

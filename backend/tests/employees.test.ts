import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index';

describe('POST /employees', () => {
  describe('Validation - Required Fields', () => {
    it('should return 400 when name is missing', async () => {
      const response = await request(app).post('/api/employees').send({
        email: 'john.doe@example.com',
        department: 'Engineering',
        salary: 75000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('name');
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app).post('/api/employees').send({
        name: 'John Doe',
        department: 'Engineering',
        salary: 75000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('email');
    });

    it('should return 400 when department is missing', async () => {
      const response = await request(app).post('/api/employees').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        salary: 75000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('department');
    });

    it('should return 400 when salary is missing', async () => {
      const response = await request(app).post('/api/employees').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        department: 'Engineering',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('salary');
    });

    it('should return 400 when all fields are missing', async () => {
      const response = await request(app).post('/api/employees').send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Validation - Email Format', () => {
    it('should return 400 when email format is invalid - missing @', async () => {
      const response = await request(app).post('/api/employees').send({
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
      const response = await request(app).post('/api/employees').send({
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
      const response = await request(app).post('/api/employees').send({
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
      const response = await request(app).post('/api/employees').send({
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
      const response = await request(app).post('/api/employees').send({
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
      const response = await request(app).post('/api/employees').send({
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
      const response = await request(app).post('/api/employees').send({
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

      const response = await request(app).post('/api/employees').send(validEmployee);

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

      const response = await request(app).post('/api/employees').send(validEmployee);

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

      const response = await request(app).post('/api/employees').send(validEmployee);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('salary', validEmployee.salary);
    });
  });

  describe('Error Response Structure', () => {
    it('should return proper error response structure', async () => {
      const response = await request(app).post('/api/employees').send({
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
      const response = await request(app).post('/api/employees').send({});

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});

describe('GET /api/employees', () => {
  describe('Response Format', () => {
    it('should return deterministic response format with required fields', async () => {
      const response = await request(app).get('/api/employees');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);

      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('totalPages');
    });

    it('should return employees with all required fields', async () => {
      await request(app).post('/api/employees').send({
        name: 'Test Employee',
        email: 'test@example.com',
        department: 'Engineering',
        salary: 75000,
        country: 'USA',
      });

      const response = await request(app).get('/api/employees');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);

      const employee = response.body.data[0];
      expect(employee).toHaveProperty('id');
      expect(employee).toHaveProperty('name');
      expect(employee).toHaveProperty('email');
      expect(employee).toHaveProperty('department');
      expect(employee).toHaveProperty('salary');
      expect(employee).toHaveProperty('country');
      expect(employee).toHaveProperty('createdAt');
    });
  });

  describe('Pagination', () => {
    it('should return first page with default limit', async () => {
      for (let i = 1; i <= 15; i++) {
        await request(app)
          .post('/api/employees')
          .send({
            name: `Employee ${i}`,
            email: `employee${i}@example.com`,
            department: 'Engineering',
            salary: 50000 + i * 1000,
          });
      }

      const response = await request(app).get('/api/employees');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(10);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
      expect(response.body.pagination.total).toBe(15);
      expect(response.body.pagination.totalPages).toBe(2);
    });

    it('should return specific page when page parameter is provided', async () => {
      for (let i = 1; i <= 25; i++) {
        await request(app)
          .post('/api/employees')
          .send({
            name: `Employee ${i}`,
            email: `employee${i}@example.com`,
            department: 'Engineering',
            salary: 50000,
          });
      }

      const response = await request(app).get('/api/employees?page=2');

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(2);
      expect(response.body.data.length).toBe(10);
    });

    it('should respect custom limit parameter', async () => {
      for (let i = 1; i <= 30; i++) {
        await request(app)
          .post('/api/employees')
          .send({
            name: `Employee ${i}`,
            email: `employee${i}@example.com`,
            department: 'Engineering',
            salary: 50000,
          });
      }

      const response = await request(app).get('/api/employees?limit=5');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(5);
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.pagination.totalPages).toBe(6);
    });

    it('should handle page and limit together', async () => {
      for (let i = 1; i <= 20; i++) {
        await request(app)
          .post('/api/employees')
          .send({
            name: `Employee ${i}`,
            email: `employee${i}@example.com`,
            department: 'Engineering',
            salary: 50000,
          });
      }

      const response = await request(app).get('/api/employees?page=3&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(3);
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.data.length).toBe(5);
    });

    it('should return empty array for page beyond total pages', async () => {
      await request(app).post('/api/employees').send({
        name: 'Single Employee',
        email: 'single@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/api/employees?page=10');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.page).toBe(10);
    });

    it('should handle invalid page parameter gracefully', async () => {
      const response = await request(app).get('/api/employees?page=invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid limit parameter gracefully', async () => {
      const response = await request(app).get('/api/employees?limit=invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject negative page numbers', async () => {
      const response = await request(app).get('/api/employees?page=-1');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject zero or negative limit', async () => {
      const response = await request(app).get('/api/employees?limit=0');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Sorting', () => {
    it('should sort by name in ascending order', async () => {
      await request(app).post('/api/employees').send({
        name: 'Charlie',
        email: 'charlie@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/api/employees').send({
        name: 'Alice',
        email: 'alice@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/api/employees').send({
        name: 'Bob',
        email: 'bob@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/api/employees?sortBy=name&order=asc');

      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toBe('Alice');
      expect(response.body.data[1].name).toBe('Bob');
      expect(response.body.data[2].name).toBe('Charlie');
    });

    it('should sort by name in descending order', async () => {
      await request(app).post('/api/employees').send({
        name: 'Alice',
        email: 'alice@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/api/employees').send({
        name: 'Charlie',
        email: 'charlie@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/api/employees').send({
        name: 'Bob',
        email: 'bob@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/api/employees?sortBy=name&order=desc');

      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toBe('Charlie');
      expect(response.body.data[1].name).toBe('Bob');
      expect(response.body.data[2].name).toBe('Alice');
    });

    it('should sort by salary in ascending order', async () => {
      await request(app).post('/api/employees').send({
        name: 'Employee 1',
        email: 'emp1@example.com',
        department: 'Engineering',
        salary: 70000,
      });
      await request(app).post('/api/employees').send({
        name: 'Employee 2',
        email: 'emp2@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/api/employees').send({
        name: 'Employee 3',
        email: 'emp3@example.com',
        department: 'Engineering',
        salary: 60000,
      });

      const response = await request(app).get('/api/employees?sortBy=salary&order=asc');

      expect(response.status).toBe(200);
      expect(response.body.data[0].salary).toBe(50000);
      expect(response.body.data[1].salary).toBe(60000);
      expect(response.body.data[2].salary).toBe(70000);
    });

    it('should sort by salary in descending order', async () => {
      await request(app).post('/api/employees').send({
        name: 'Employee 1',
        email: 'emp1@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/api/employees').send({
        name: 'Employee 2',
        email: 'emp2@example.com',
        department: 'Engineering',
        salary: 70000,
      });
      await request(app).post('/api/employees').send({
        name: 'Employee 3',
        email: 'emp3@example.com',
        department: 'Engineering',
        salary: 60000,
      });

      const response = await request(app).get('/api/employees?sortBy=salary&order=desc');

      expect(response.status).toBe(200);
      expect(response.body.data[0].salary).toBe(70000);
      expect(response.body.data[1].salary).toBe(60000);
      expect(response.body.data[2].salary).toBe(50000);
    });

    it('should default to ascending order when order is not specified', async () => {
      await request(app).post('/api/employees').send({
        name: 'Zoe',
        email: 'zoe@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/api/employees').send({
        name: 'Adam',
        email: 'adam@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/api/employees?sortBy=name');

      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toBe('Adam');
      expect(response.body.data[1].name).toBe('Zoe');
    });

    it('should reject invalid sortBy field', async () => {
      const response = await request(app).get('/api/employees?sortBy=invalidField');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid order value', async () => {
      const response = await request(app).get('/api/employees?sortBy=name&order=invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Search by Name', () => {
    it('should search employees by exact name match', async () => {
      await request(app).post('/api/employees').send({
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/api/employees').send({
        name: 'Jane Smith',
        email: 'jane@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/api/employees?search=John Doe');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('John Doe');
    });

    it('should search employees by partial name match (case-insensitive)', async () => {
      await request(app).post('/api/employees').send({
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/api/employees').send({
        name: 'Johnny Walker',
        email: 'johnny@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/api/employees').send({
        name: 'Jane Smith',
        email: 'jane@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/api/employees?search=john');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data.some((e: any) => e.name === 'John Doe')).toBe(true);
      expect(response.body.data.some((e: any) => e.name === 'Johnny Walker')).toBe(true);
    });

    it('should return empty array when search matches no employees', async () => {
      await request(app).post('/api/employees').send({
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/api/employees?search=NonExistent');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should handle search with special characters', async () => {
      await request(app).post('/api/employees').send({
        name: "O'Brien",
        email: 'obrien@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get("/api/employees?search=O'Brien");

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe("O'Brien");
    });

    it('should combine search with pagination', async () => {
      for (let i = 1; i <= 15; i++) {
        await request(app)
          .post('/api/employees')
          .send({
            name: `John ${i}`,
            email: `john${i}@example.com`,
            department: 'Engineering',
            salary: 50000,
          });
      }

      const response = await request(app).get('/api/employees?search=John&limit=5&page=2');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(5);
      expect(response.body.pagination.page).toBe(2);
      expect(response.body.pagination.total).toBe(15);
    });
  });

  describe('Filter by Country', () => {
    it('should filter employees by country', async () => {
      await request(app).post('/api/employees').send({
        name: 'US Employee',
        email: 'us@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'USA',
      });
      await request(app).post('/api/employees').send({
        name: 'UK Employee',
        email: 'uk@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'UK',
      });
      await request(app).post('/api/employees').send({
        name: 'Canada Employee',
        email: 'ca@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'Canada',
      });

      const response = await request(app).get('/api/employees?country=USA');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].country).toBe('USA');
    });

    it('should return empty array when no employees match country filter', async () => {
      await request(app).post('/api/employees').send({
        name: 'US Employee',
        email: 'us@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'USA',
      });

      const response = await request(app).get('/api/employees?country=Germany');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should combine country filter with pagination', async () => {
      for (let i = 1; i <= 15; i++) {
        await request(app)
          .post('/api/employees')
          .send({
            name: `US Employee ${i}`,
            email: `us${i}@example.com`,
            department: 'Engineering',
            salary: 50000,
            country: 'USA',
          });
      }
      await request(app).post('/api/employees').send({
        name: 'UK Employee',
        email: 'uk@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'UK',
      });

      const response = await request(app).get('/api/employees?country=USA&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(10);
      expect(response.body.pagination.total).toBe(15);
    });
  });

  describe('Filter by Department', () => {
    it('should filter employees by department', async () => {
      await request(app).post('/api/employees').send({
        name: 'Engineer 1',
        email: 'eng1@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/api/employees').send({
        name: 'Marketer 1',
        email: 'mkt1@example.com',
        department: 'Marketing',
        salary: 50000,
      });
      await request(app).post('/api/employees').send({
        name: 'Sales 1',
        email: 'sales1@example.com',
        department: 'Sales',
        salary: 50000,
      });

      const response = await request(app).get('/api/employees?department=Engineering');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].department).toBe('Engineering');
    });

    it('should return empty array when no employees match department filter', async () => {
      await request(app).post('/api/employees').send({
        name: 'Engineer 1',
        email: 'eng1@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/api/employees?department=HR');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should combine department filter with pagination', async () => {
      for (let i = 1; i <= 20; i++) {
        await request(app)
          .post('/api/employees')
          .send({
            name: `Engineer ${i}`,
            email: `eng${i}@example.com`,
            department: 'Engineering',
            salary: 50000,
          });
      }
      await request(app).post('/api/employees').send({
        name: 'Marketer 1',
        email: 'mkt1@example.com',
        department: 'Marketing',
        salary: 50000,
      });

      const response = await request(app).get(
        '/api/employees?department=Engineering&limit=5&page=2'
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(5);
      expect(response.body.pagination.page).toBe(2);
      expect(response.body.pagination.total).toBe(20);
    });
  });

  describe('Combined Filters', () => {
    it('should combine search, country filter, and department filter', async () => {
      await request(app).post('/api/employees').send({
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'USA',
      });
      await request(app).post('/api/employees').send({
        name: 'John Smith',
        email: 'johnsmith@example.com',
        department: 'Marketing',
        salary: 50000,
        country: 'USA',
      });
      await request(app).post('/api/employees').send({
        name: 'John Walker',
        email: 'johnwalker@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'UK',
      });

      const response = await request(app).get(
        '/api/employees?search=John&department=Engineering&country=USA'
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('John Doe');
    });

    it('should combine all filters with sorting and pagination', async () => {
      for (let i = 1; i <= 15; i++) {
        await request(app)
          .post('/api/employees')
          .send({
            name: `Engineer ${i}`,
            email: `eng${i}@example.com`,
            department: 'Engineering',
            salary: 50000 + i * 1000,
            country: 'USA',
          });
      }
      await request(app).post('/api/employees').send({
        name: 'Engineer 99',
        email: 'eng99@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'UK',
      });

      const response = await request(app).get(
        '/api/employees?search=Engineer&department=Engineering&country=USA&sortBy=salary&order=desc&limit=5&page=1'
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(5);
      expect(response.body.pagination.total).toBe(15);
      expect(response.body.data[0].salary).toBeGreaterThan(response.body.data[1].salary);
    });

    it('should return empty array when combined filters match nothing', async () => {
      await request(app).post('/api/employees').send({
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'USA',
      });

      const response = await request(app).get(
        '/api/employees?search=Jane&department=Engineering&country=USA'
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should return empty array when no employees exist', async () => {
      const response = await request(app).get('/api/employees');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
      expect(response.body.pagination.totalPages).toBe(0);
    });

    it('should handle empty search string', async () => {
      await request(app).post('/api/employees').send({
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/api/employees?search=');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should maintain consistent response structure across all queries', async () => {
      const responses = await Promise.all([
        request(app).get('/api/employees'),
        request(app).get('/api/employees?page=1'),
        request(app).get('/api/employees?search=test'),
        request(app).get('/api/employees?department=Engineering'),
        request(app).get('/api/employees?country=USA'),
        request(app).get('/api/employees?sortBy=name&order=asc'),
      ]);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('pagination');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.pagination).toHaveProperty('page');
        expect(response.body.pagination).toHaveProperty('limit');
        expect(response.body.pagination).toHaveProperty('total');
        expect(response.body.pagination).toHaveProperty('totalPages');
      });
    });
  });
});

describe('PUT /employees/:id', () => {
  describe('Validation - Required Fields', () => {
    it('should return 400 when name is missing', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const response = await request(app).put(`/api/employees/${employeeId}`).send({
        email: 'updated@example.com',
        department: 'Marketing',
        salary: 80000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('name');
    });

    it('should return 400 when email is missing', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const response = await request(app).put(`/api/employees/${employeeId}`).send({
        name: 'Updated Name',
        department: 'Marketing',
        salary: 80000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('email');
    });

    it('should return 400 when department is missing', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const response = await request(app).put(`/api/employees/${employeeId}`).send({
        name: 'Updated Name',
        email: 'updated@example.com',
        salary: 80000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('department');
    });

    it('should return 400 when salary is missing', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const response = await request(app).put(`/api/employees/${employeeId}`).send({
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('salary');
    });

    it('should return 400 when all fields are missing', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const response = await request(app).put(`/api/employees/${employeeId}`).send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Validation - Email Format', () => {
    it('should return 400 when email format is invalid - missing @', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const response = await request(app).put(`/api/employees/${employeeId}`).send({
        name: 'Updated Name',
        email: 'invalidemail.com',
        department: 'Marketing',
        salary: 80000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('email');
    });

    it('should return 400 when email format is invalid - missing domain', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const response = await request(app).put(`/api/employees/${employeeId}`).send({
        name: 'Updated Name',
        email: 'updated@',
        department: 'Marketing',
        salary: 80000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('email');
    });

    it('should return 400 when email is empty string', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const response = await request(app).put(`/api/employees/${employeeId}`).send({
        name: 'Updated Name',
        email: '',
        department: 'Marketing',
        salary: 80000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('email');
    });
  });

  describe('Validation - Salary', () => {
    it('should return 400 when salary is 0', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const response = await request(app).put(`/api/employees/${employeeId}`).send({
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
        salary: 0,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('salary');
    });

    it('should return 400 when salary is negative', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const response = await request(app).put(`/api/employees/${employeeId}`).send({
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
        salary: -5000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('salary');
    });

    it('should return 400 when salary is not a number', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const response = await request(app).put(`/api/employees/${employeeId}`).send({
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
        salary: 'invalid',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('salary');
    });
  });

  describe('Validation - ID Parameter', () => {
    it('should return 400 when ID is not a valid number', async () => {
      const response = await request(app).put('/api/employees/invalid-id').send({
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
        salary: 80000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('id');
    });

    it('should return 400 when ID is negative', async () => {
      const response = await request(app).put('/api/employees/-1').send({
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
        salary: 80000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('id');
    });

    it('should return 400 when ID is zero', async () => {
      const response = await request(app).put('/api/employees/0').send({
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
        salary: 80000,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('id');
    });
  });

  describe('Not Found Handling', () => {
    it('should return 404 when employee does not exist', async () => {
      const response = await request(app).put('/api/employees/999999').send({
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
        salary: 80000,
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('not found');
    });

    it('should return 404 with proper error structure', async () => {
      const response = await request(app).put('/api/employees/999999').send({
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
        salary: 80000,
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(typeof (response.body as { error: string }).error).toBe('string');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Success Cases', () => {
    it('should return 200 and update employee successfully', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
        salary: 85000,
      };

      const response = await request(app).put(`/api/employees/${employeeId}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', employeeId);
      expect(response.body).toHaveProperty('name', updateData.name);
      expect(response.body).toHaveProperty('email', updateData.email);
      expect(response.body).toHaveProperty('department', updateData.department);
      expect(response.body).toHaveProperty('salary', updateData.salary);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should update employee with minimum valid salary', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
        salary: 0.01,
      };

      const response = await request(app).put(`/api/employees/${employeeId}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('salary', updateData.salary);
    });

    it('should update employee with optional country field', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
        country: 'USA',
      });
      const employeeId = createResponse.body.id;

      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
        salary: 85000,
        country: 'Canada',
      };

      const response = await request(app).put(`/api/employees/${employeeId}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('country', updateData.country);
    });

    it('should persist updated data when fetching employee', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
        salary: 85000,
      };

      await request(app).put(`/api/employees/${employeeId}`).send(updateData);

      const getResponse = await request(app).get('/api/employees');
      const updatedEmployee = getResponse.body.data.find((e: any) => e.id === employeeId);

      expect(updatedEmployee).toBeDefined();
      expect(updatedEmployee.name).toBe(updateData.name);
      expect(updatedEmployee.email).toBe(updateData.email);
      expect(updatedEmployee.department).toBe(updateData.department);
      expect(updatedEmployee.salary).toBe(updateData.salary);
    });

    it('should return JSON content type for success response', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Original Name',
        email: 'original@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const response = await request(app).put(`/api/employees/${employeeId}`).send({
        name: 'Updated Name',
        email: 'updated@example.com',
        department: 'Marketing',
        salary: 85000,
      });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});

describe('DELETE /employees/:id', () => {
  describe('Validation - ID Parameter', () => {
    it('should return 400 when ID is not a valid number', async () => {
      const response = await request(app).delete('/api/employees/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('id');
    });

    it('should return 400 when ID is negative', async () => {
      const response = await request(app).delete('/api/employees/-1');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('id');
    });

    it('should return 400 when ID is zero', async () => {
      const response = await request(app).delete('/api/employees/0');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('id');
    });
  });

  describe('Not Found Handling', () => {
    it('should return 404 when employee does not exist', async () => {
      const response = await request(app).delete('/api/employees/999999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect((response.body as { error: string }).error).toContain('not found');
    });

    it('should return 404 with proper error structure', async () => {
      const response = await request(app).delete('/api/employees/999999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(typeof (response.body as { error: string }).error).toBe('string');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Success Cases', () => {
    it('should return 204 when employee is deleted successfully', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'To Be Deleted',
        email: 'delete@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const response = await request(app).delete(`/api/employees/${employeeId}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should remove employee from database after deletion', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'To Be Deleted',
        email: 'delete@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      await request(app).delete(`/api/employees/${employeeId}`);

      const getResponse = await request(app).get('/api/employees');
      const deletedEmployee = getResponse.body.data.find((e: any) => e.id === employeeId);

      expect(deletedEmployee).toBeUndefined();
    });

    it('should return 404 when trying to delete the same employee twice', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'To Be Deleted',
        email: 'delete@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const firstDelete = await request(app).delete(`/api/employees/${employeeId}`);
      expect(firstDelete.status).toBe(204);

      const secondDelete = await request(app).delete(`/api/employees/${employeeId}`);
      expect(secondDelete.status).toBe(404);
      expect(secondDelete.body).toHaveProperty('error');
    });

    it('should not affect other employees when deleting one', async () => {
      const employee1 = await request(app).post('/api/employees').send({
        name: 'Employee 1',
        email: 'emp1@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employee2 = await request(app).post('/api/employees').send({
        name: 'Employee 2',
        email: 'emp2@example.com',
        department: 'Marketing',
        salary: 65000,
      });

      await request(app).delete(`/api/employees/${employee1.body.id}`);

      const getResponse = await request(app).get('/api/employees');
      const remainingEmployee = getResponse.body.data.find((e: any) => e.id === employee2.body.id);

      expect(remainingEmployee).toBeDefined();
      expect(remainingEmployee.name).toBe('Employee 2');
    });

    it('should handle deletion with deterministic behavior', async () => {
      const createResponse = await request(app).post('/api/employees').send({
        name: 'Deterministic Delete',
        email: 'deterministic@example.com',
        department: 'Engineering',
        salary: 75000,
      });
      const employeeId = createResponse.body.id;

      const beforeCount = (await request(app).get('/api/employees')).body.pagination.total;

      await request(app).delete(`/api/employees/${employeeId}`);

      const afterCount = (await request(app).get('/api/employees')).body.pagination.total;

      expect(afterCount).toBe(beforeCount - 1);
    });
  });
});

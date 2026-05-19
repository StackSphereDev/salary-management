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

describe('GET /employees', () => {
  describe('Response Format', () => {
    it('should return deterministic response format with required fields', async () => {
      const response = await request(app).get('/employees');

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
      await request(app).post('/employees').send({
        name: 'Test Employee',
        email: 'test@example.com',
        department: 'Engineering',
        salary: 75000,
        country: 'USA',
      });

      const response = await request(app).get('/employees');

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
          .post('/employees')
          .send({
            name: `Employee ${i}`,
            email: `employee${i}@example.com`,
            department: 'Engineering',
            salary: 50000 + i * 1000,
          });
      }

      const response = await request(app).get('/employees');

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
          .post('/employees')
          .send({
            name: `Employee ${i}`,
            email: `employee${i}@example.com`,
            department: 'Engineering',
            salary: 50000,
          });
      }

      const response = await request(app).get('/employees?page=2');

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(2);
      expect(response.body.data.length).toBe(10);
    });

    it('should respect custom limit parameter', async () => {
      for (let i = 1; i <= 30; i++) {
        await request(app)
          .post('/employees')
          .send({
            name: `Employee ${i}`,
            email: `employee${i}@example.com`,
            department: 'Engineering',
            salary: 50000,
          });
      }

      const response = await request(app).get('/employees?limit=5');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(5);
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.pagination.totalPages).toBe(6);
    });

    it('should handle page and limit together', async () => {
      for (let i = 1; i <= 20; i++) {
        await request(app)
          .post('/employees')
          .send({
            name: `Employee ${i}`,
            email: `employee${i}@example.com`,
            department: 'Engineering',
            salary: 50000,
          });
      }

      const response = await request(app).get('/employees?page=3&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(3);
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.data.length).toBe(5);
    });

    it('should return empty array for page beyond total pages', async () => {
      await request(app).post('/employees').send({
        name: 'Single Employee',
        email: 'single@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/employees?page=10');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.page).toBe(10);
    });

    it('should handle invalid page parameter gracefully', async () => {
      const response = await request(app).get('/employees?page=invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid limit parameter gracefully', async () => {
      const response = await request(app).get('/employees?limit=invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject negative page numbers', async () => {
      const response = await request(app).get('/employees?page=-1');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject zero or negative limit', async () => {
      const response = await request(app).get('/employees?limit=0');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Sorting', () => {
    it('should sort by name in ascending order', async () => {
      await request(app).post('/employees').send({
        name: 'Charlie',
        email: 'charlie@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/employees').send({
        name: 'Alice',
        email: 'alice@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/employees').send({
        name: 'Bob',
        email: 'bob@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/employees?sortBy=name&order=asc');

      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toBe('Alice');
      expect(response.body.data[1].name).toBe('Bob');
      expect(response.body.data[2].name).toBe('Charlie');
    });

    it('should sort by name in descending order', async () => {
      await request(app).post('/employees').send({
        name: 'Alice',
        email: 'alice@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/employees').send({
        name: 'Charlie',
        email: 'charlie@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/employees').send({
        name: 'Bob',
        email: 'bob@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/employees?sortBy=name&order=desc');

      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toBe('Charlie');
      expect(response.body.data[1].name).toBe('Bob');
      expect(response.body.data[2].name).toBe('Alice');
    });

    it('should sort by salary in ascending order', async () => {
      await request(app).post('/employees').send({
        name: 'Employee 1',
        email: 'emp1@example.com',
        department: 'Engineering',
        salary: 70000,
      });
      await request(app).post('/employees').send({
        name: 'Employee 2',
        email: 'emp2@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/employees').send({
        name: 'Employee 3',
        email: 'emp3@example.com',
        department: 'Engineering',
        salary: 60000,
      });

      const response = await request(app).get('/employees?sortBy=salary&order=asc');

      expect(response.status).toBe(200);
      expect(response.body.data[0].salary).toBe(50000);
      expect(response.body.data[1].salary).toBe(60000);
      expect(response.body.data[2].salary).toBe(70000);
    });

    it('should sort by salary in descending order', async () => {
      await request(app).post('/employees').send({
        name: 'Employee 1',
        email: 'emp1@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/employees').send({
        name: 'Employee 2',
        email: 'emp2@example.com',
        department: 'Engineering',
        salary: 70000,
      });
      await request(app).post('/employees').send({
        name: 'Employee 3',
        email: 'emp3@example.com',
        department: 'Engineering',
        salary: 60000,
      });

      const response = await request(app).get('/employees?sortBy=salary&order=desc');

      expect(response.status).toBe(200);
      expect(response.body.data[0].salary).toBe(70000);
      expect(response.body.data[1].salary).toBe(60000);
      expect(response.body.data[2].salary).toBe(50000);
    });

    it('should default to ascending order when order is not specified', async () => {
      await request(app).post('/employees').send({
        name: 'Zoe',
        email: 'zoe@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/employees').send({
        name: 'Adam',
        email: 'adam@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/employees?sortBy=name');

      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toBe('Adam');
      expect(response.body.data[1].name).toBe('Zoe');
    });

    it('should reject invalid sortBy field', async () => {
      const response = await request(app).get('/employees?sortBy=invalidField');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid order value', async () => {
      const response = await request(app).get('/employees?sortBy=name&order=invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Search by Name', () => {
    it('should search employees by exact name match', async () => {
      await request(app).post('/employees').send({
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/employees').send({
        name: 'Jane Smith',
        email: 'jane@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/employees?search=John Doe');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('John Doe');
    });

    it('should search employees by partial name match (case-insensitive)', async () => {
      await request(app).post('/employees').send({
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/employees').send({
        name: 'Johnny Walker',
        email: 'johnny@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/employees').send({
        name: 'Jane Smith',
        email: 'jane@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/employees?search=john');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data.some((e: any) => e.name === 'John Doe')).toBe(true);
      expect(response.body.data.some((e: any) => e.name === 'Johnny Walker')).toBe(true);
    });

    it('should return empty array when search matches no employees', async () => {
      await request(app).post('/employees').send({
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/employees?search=NonExistent');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should handle search with special characters', async () => {
      await request(app).post('/employees').send({
        name: "O'Brien",
        email: 'obrien@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get("/employees?search=O'Brien");

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe("O'Brien");
    });

    it('should combine search with pagination', async () => {
      for (let i = 1; i <= 15; i++) {
        await request(app)
          .post('/employees')
          .send({
            name: `John ${i}`,
            email: `john${i}@example.com`,
            department: 'Engineering',
            salary: 50000,
          });
      }

      const response = await request(app).get('/employees?search=John&limit=5&page=2');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(5);
      expect(response.body.pagination.page).toBe(2);
      expect(response.body.pagination.total).toBe(15);
    });
  });

  describe('Filter by Country', () => {
    it('should filter employees by country', async () => {
      await request(app).post('/employees').send({
        name: 'US Employee',
        email: 'us@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'USA',
      });
      await request(app).post('/employees').send({
        name: 'UK Employee',
        email: 'uk@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'UK',
      });
      await request(app).post('/employees').send({
        name: 'Canada Employee',
        email: 'ca@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'Canada',
      });

      const response = await request(app).get('/employees?country=USA');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].country).toBe('USA');
    });

    it('should return empty array when no employees match country filter', async () => {
      await request(app).post('/employees').send({
        name: 'US Employee',
        email: 'us@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'USA',
      });

      const response = await request(app).get('/employees?country=Germany');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should combine country filter with pagination', async () => {
      for (let i = 1; i <= 15; i++) {
        await request(app)
          .post('/employees')
          .send({
            name: `US Employee ${i}`,
            email: `us${i}@example.com`,
            department: 'Engineering',
            salary: 50000,
            country: 'USA',
          });
      }
      await request(app).post('/employees').send({
        name: 'UK Employee',
        email: 'uk@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'UK',
      });

      const response = await request(app).get('/employees?country=USA&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(10);
      expect(response.body.pagination.total).toBe(15);
    });
  });

  describe('Filter by Department', () => {
    it('should filter employees by department', async () => {
      await request(app).post('/employees').send({
        name: 'Engineer 1',
        email: 'eng1@example.com',
        department: 'Engineering',
        salary: 50000,
      });
      await request(app).post('/employees').send({
        name: 'Marketer 1',
        email: 'mkt1@example.com',
        department: 'Marketing',
        salary: 50000,
      });
      await request(app).post('/employees').send({
        name: 'Sales 1',
        email: 'sales1@example.com',
        department: 'Sales',
        salary: 50000,
      });

      const response = await request(app).get('/employees?department=Engineering');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].department).toBe('Engineering');
    });

    it('should return empty array when no employees match department filter', async () => {
      await request(app).post('/employees').send({
        name: 'Engineer 1',
        email: 'eng1@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/employees?department=HR');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should combine department filter with pagination', async () => {
      for (let i = 1; i <= 20; i++) {
        await request(app)
          .post('/employees')
          .send({
            name: `Engineer ${i}`,
            email: `eng${i}@example.com`,
            department: 'Engineering',
            salary: 50000,
          });
      }
      await request(app).post('/employees').send({
        name: 'Marketer 1',
        email: 'mkt1@example.com',
        department: 'Marketing',
        salary: 50000,
      });

      const response = await request(app).get('/employees?department=Engineering&limit=5&page=2');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(5);
      expect(response.body.pagination.page).toBe(2);
      expect(response.body.pagination.total).toBe(20);
    });
  });

  describe('Combined Filters', () => {
    it('should combine search, country filter, and department filter', async () => {
      await request(app).post('/employees').send({
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'USA',
      });
      await request(app).post('/employees').send({
        name: 'John Smith',
        email: 'johnsmith@example.com',
        department: 'Marketing',
        salary: 50000,
        country: 'USA',
      });
      await request(app).post('/employees').send({
        name: 'John Walker',
        email: 'johnwalker@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'UK',
      });

      const response = await request(app).get(
        '/employees?search=John&department=Engineering&country=USA'
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('John Doe');
    });

    it('should combine all filters with sorting and pagination', async () => {
      for (let i = 1; i <= 15; i++) {
        await request(app)
          .post('/employees')
          .send({
            name: `Engineer ${i}`,
            email: `eng${i}@example.com`,
            department: 'Engineering',
            salary: 50000 + i * 1000,
            country: 'USA',
          });
      }
      await request(app).post('/employees').send({
        name: 'Engineer 99',
        email: 'eng99@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'UK',
      });

      const response = await request(app).get(
        '/employees?search=Engineer&department=Engineering&country=USA&sortBy=salary&order=desc&limit=5&page=1'
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(5);
      expect(response.body.pagination.total).toBe(15);
      expect(response.body.data[0].salary).toBeGreaterThan(response.body.data[1].salary);
    });

    it('should return empty array when combined filters match nothing', async () => {
      await request(app).post('/employees').send({
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        salary: 50000,
        country: 'USA',
      });

      const response = await request(app).get(
        '/employees?search=Jane&department=Engineering&country=USA'
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should return empty array when no employees exist', async () => {
      const response = await request(app).get('/employees');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
      expect(response.body.pagination.totalPages).toBe(0);
    });

    it('should handle empty search string', async () => {
      await request(app).post('/employees').send({
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        salary: 50000,
      });

      const response = await request(app).get('/employees?search=');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should maintain consistent response structure across all queries', async () => {
      const responses = await Promise.all([
        request(app).get('/employees'),
        request(app).get('/employees?page=1'),
        request(app).get('/employees?search=test'),
        request(app).get('/employees?department=Engineering'),
        request(app).get('/employees?country=USA'),
        request(app).get('/employees?sortBy=name&order=asc'),
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

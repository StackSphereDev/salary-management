import {
  EmployeeRepository,
  EmployeeEntity,
  EmployeeListEntity,
  FindManyOptions,
} from '../repositories/employee.repository';
import { CreateEmployeeInput } from '../schemas/employee.schema';
import { EmployeeResponse, ListEmployeesQuery, PaginatedResponse } from '../types/api.types';
import { DatabaseError } from '../utils/error-handler';
import { Prisma } from '@prisma/client';

export interface EmployeeListResponse {
  id: string;
  name: string;
  email: string;
  department: string;
  jobTitle: string;
  country: string;
  salary: number;
  currency: string;
  employmentType: string;
  status: string;
  joiningDate: Date;
  createdAt: Date;
}

export class EmployeeService {
  private repository: EmployeeRepository;

  constructor(repository?: EmployeeRepository) {
    this.repository = repository || new EmployeeRepository();
  }

  async createEmployee(data: CreateEmployeeInput): Promise<EmployeeResponse> {
    try {
      const employee = await this.repository.create(data);
      return this.mapToResponse(employee);
    } catch (error) {
      throw new DatabaseError(error instanceof Error ? error.message : 'Failed to create employee');
    }
  }

  async listEmployees(query: ListEmployeesQuery): Promise<PaginatedResponse<EmployeeListResponse>> {
    try {
      const page = query.page || 1;
      const limit = Math.min(query.limit || 10, 100);
      const skip = (page - 1) * limit;

      const where = this.buildWhereClause(query);
      const orderBy = this.buildOrderByClause(query.sortBy, query.order);

      const options: FindManyOptions = {
        skip,
        take: limit,
        where,
        orderBy,
      };

      const { employees, total } = await this.repository.findMany(options);

      return {
        data: employees.map((emp) => this.mapToListResponse(emp)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 0,
        },
      };
    } catch (error) {
      throw new DatabaseError(error instanceof Error ? error.message : 'Failed to list employees');
    }
  }

  private buildWhereClause(query: ListEmployeesQuery): Prisma.EmployeeWhereInput {
    const where: Prisma.EmployeeWhereInput = {};

    if (query.department) {
      where.department = query.department;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.employmentType) {
      where.employmentType = query.employmentType;
    }

    if (query.country) {
      where.country = query.country;
    }

    if (query.minSalary !== undefined || query.maxSalary !== undefined) {
      where.salary = {};
      if (query.minSalary !== undefined) {
        where.salary.gte = query.minSalary;
      }
      if (query.maxSalary !== undefined) {
        where.salary.lte = query.maxSalary;
      }
    }

    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search } },
        { email: { contains: query.search } },
        { jobTitle: { contains: query.search } },
      ];
    }

    return where;
  }

  private buildOrderByClause(
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Prisma.EmployeeOrderByWithRelationInput {
    const order = sortOrder || 'asc';
    let field = sortBy || 'createdAt';

    if (field === 'name') {
      field = 'fullName';
    }

    const validSortFields = [
      'fullName',
      'email',
      'department',
      'salary',
      'joiningDate',
      'createdAt',
      'country',
      'status',
    ];

    if (validSortFields.includes(field)) {
      return { [field]: order };
    }

    return { createdAt: 'asc' };
  }

  private mapToResponse(employee: EmployeeEntity): EmployeeResponse {
    return {
      id: employee.id,
      name: employee.fullName,
      email: employee.email,
      department: employee.department,
      salary: employee.salary,
      createdAt: employee.createdAt,
    };
  }

  private mapToListResponse(employee: EmployeeListEntity): EmployeeListResponse {
    return {
      id: employee.id,
      name: employee.fullName,
      email: employee.email,
      department: employee.department,
      jobTitle: employee.jobTitle,
      country: employee.country,
      salary: employee.salary,
      currency: employee.currency,
      employmentType: employee.employmentType,
      status: employee.status,
      joiningDate: employee.joiningDate,
      createdAt: employee.createdAt,
    };
  }
}

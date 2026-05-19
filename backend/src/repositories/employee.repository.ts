import prisma from '../config/database';
import { CreateEmployeeInput } from '../schemas/employee.schema';
import { Prisma } from '@prisma/client';

export interface EmployeeEntity {
  id: string;
  fullName: string;
  email: string;
  department: string;
  salary: number;
  createdAt: Date;
}

export interface EmployeeListEntity {
  id: string;
  fullName: string;
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

export interface FindManyOptions {
  skip: number;
  take: number;
  where?: Prisma.EmployeeWhereInput;
  orderBy?: Prisma.EmployeeOrderByWithRelationInput;
}

export interface FindManyResult {
  employees: EmployeeListEntity[];
  total: number;
}

export class EmployeeRepository {
  async create(data: CreateEmployeeInput): Promise<EmployeeEntity> {
    return await prisma.employee.create({
      data: {
        fullName: data.name,
        email: data.email,
        department: data.department,
        salary: data.salary,
        jobTitle: 'Default',
        country: data.country || 'US',
        joiningDate: new Date(),
        employmentType: 'FULL_TIME',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        department: true,
        salary: true,
        createdAt: true,
      },
    });
  }

  async findMany(options: FindManyOptions): Promise<FindManyResult> {
    const { skip, take, where, orderBy } = options;

    const [employees, total] = await prisma.$transaction([
      prisma.employee.findMany({
        skip,
        take,
        where,
        orderBy,
        select: {
          id: true,
          fullName: true,
          email: true,
          department: true,
          jobTitle: true,
          country: true,
          salary: true,
          currency: true,
          employmentType: true,
          status: true,
          joiningDate: true,
          createdAt: true,
        },
      }),
      prisma.employee.count({ where }),
    ]);

    return { employees, total };
  }
}

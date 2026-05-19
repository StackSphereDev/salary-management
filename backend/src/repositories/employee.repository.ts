import prisma from '../config/database';
import { CreateEmployeeInput } from '../schemas/employee.schema';
import { Prisma } from '@prisma/client';

export interface EmployeeEntity {
  id: string;
  fullName: string;
  email: string;
  department: string;
  salary: number;
  country: string;
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
        country: true,
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

  async findById(id: string): Promise<EmployeeEntity | null> {
    return await prisma.employee.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        department: true,
        salary: true,
        country: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, data: Partial<CreateEmployeeInput>): Promise<EmployeeEntity> {
    const updateData: Prisma.EmployeeUpdateInput = {};

    if (data.name !== undefined) {
      updateData.fullName = data.name;
    }
    if (data.email !== undefined) {
      updateData.email = data.email;
    }
    if (data.department !== undefined) {
      updateData.department = data.department;
    }
    if (data.salary !== undefined) {
      updateData.salary = data.salary;
    }
    if (data.country !== undefined) {
      updateData.country = data.country;
    }

    return await prisma.employee.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        department: true,
        salary: true,
        country: true,
        createdAt: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.employee.delete({
      where: { id },
    });
  }
}

import prisma from '../config/database';
import { CreateEmployeeInput } from '../schemas/employee.schema';

export interface EmployeeEntity {
  id: string;
  fullName: string;
  email: string;
  department: string;
  salary: number;
  createdAt: Date;
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
        country: 'US',
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
}

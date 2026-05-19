import { EmployeeRepository, EmployeeEntity } from '../repositories/employee.repository';
import { CreateEmployeeInput } from '../schemas/employee.schema';
import { EmployeeResponse } from '../types/api.types';
import { DatabaseError } from '../utils/error-handler';

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
}

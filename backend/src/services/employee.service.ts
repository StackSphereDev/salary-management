import { EmployeeRepository } from '../repositories/employee.repository';
import { CreateEmployeeInput } from '../schemas/employee.schema';

export class EmployeeService {
  private repository: EmployeeRepository;

  constructor() {
    this.repository = new EmployeeRepository();
  }

  async createEmployee(data: CreateEmployeeInput) {
    const employee = await this.repository.create(data);
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

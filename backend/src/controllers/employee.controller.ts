import { Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeInput } from '../schemas/employee.schema';
import { TypedRequestBody } from '../types/api.types';
import { handleError } from '../utils/error-handler';

export class EmployeeController {
  private service: EmployeeService;

  constructor(service?: EmployeeService) {
    this.service = service || new EmployeeService();
  }

  createEmployee = async (
    req: TypedRequestBody<CreateEmployeeInput>,
    res: Response
  ): Promise<Response> => {
    try {
      const employee = await this.service.createEmployee(req.body);
      return res.status(201).json(employee);
    } catch (error) {
      return handleError(error, res);
    }
  };
}

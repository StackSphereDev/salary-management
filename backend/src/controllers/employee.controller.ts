import { Response, Request } from 'express';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeInput, UpdateEmployeeInput } from '../schemas/employee.schema';
import { TypedRequestBody, ListEmployeesQuery } from '../types/api.types';
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

  listEmployees = async (req: Request, res: Response): Promise<Response> => {
    try {
      const query: ListEmployeesQuery = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        order: req.query.order as 'asc' | 'desc' | undefined,
        department: req.query.department as string | undefined,
        status: req.query.status as string | undefined,
        employmentType: req.query.employmentType as string | undefined,
        country: req.query.country as string | undefined,
        search: req.query.search as string | undefined,
        minSalary: req.query.minSalary ? parseFloat(req.query.minSalary as string) : undefined,
        maxSalary: req.query.maxSalary ? parseFloat(req.query.maxSalary as string) : undefined,
      };

      const result = await this.service.listEmployees(query);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(error, res);
    }
  };

  updateEmployee = async (
    req: TypedRequestBody<UpdateEmployeeInput>,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params;
      const employee = await this.service.updateEmployee(id, req.body);
      return res.status(200).json(employee);
    } catch (error) {
      return handleError(error, res);
    }
  };

  deleteEmployee = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      await this.service.deleteEmployee(id);
      return res.status(204).send();
    } catch (error) {
      return handleError(error, res);
    }
  };
}

import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { createEmployeeSchema } from '../schemas/employee.schema';
import { ZodError } from 'zod';

export class EmployeeController {
  private service: EmployeeService;

  constructor() {
    this.service = new EmployeeService();
  }

  createEmployee = async (req: Request, res: Response): Promise<Response> => {
    try {
      const validatedData = createEmployeeSchema.parse(req.body);
      const employee = await this.service.createEmployee(validatedData);
      return res.status(201).json(employee);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((e) => {
            const field = e.path.join('.');
            return field ? `${field}: ${e.message}` : e.message;
          })
          .join(', ');
        return res.status(400).json({ error: errorMessage });
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ error: errorMessage });
    }
  };
}

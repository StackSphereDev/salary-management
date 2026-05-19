import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createEmployeeSchema } from '../schemas/employee.schema';
import { listEmployeesValidator } from '../validators/employee.validator';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const employeeController = new EmployeeController();

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .join(', ');
    res.status(400).json({ error: errorMessages });
    return;
  }
  next();
};

router.get(
  '/employees',
  listEmployeesValidator,
  handleValidationErrors,
  (req: Request, res: Response) => {
    void employeeController.listEmployees(req, res);
  }
);

router.post('/employees', validateRequest(createEmployeeSchema), (req, res) => {
  void employeeController.createEmployee(req, res);
});

export default router;

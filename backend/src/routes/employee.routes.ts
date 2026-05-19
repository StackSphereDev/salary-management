import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createEmployeeSchema } from '../schemas/employee.schema';

const router = Router();
const employeeController = new EmployeeController();

router.post('/employees', validateRequest(createEmployeeSchema), (req, res) => {
  void employeeController.createEmployee(req, res);
});

export default router;

import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';

const router = Router();
const employeeController = new EmployeeController();

router.post('/employees', async (req, res) => {
  await employeeController.createEmployee(req, res);
});

export default router;

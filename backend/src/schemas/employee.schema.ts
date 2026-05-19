import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.string().min(1, 'email is required').email('Invalid email format'),
  department: z.string().min(1, 'department is required'),
  salary: z.number().positive('salary must be positive'),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

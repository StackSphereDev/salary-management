import { z } from 'zod';
import { Department, EmploymentType, EmployeeStatus, Currency } from '@/types';

export const employeeFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),

  department: z.nativeEnum(Department, {
    message: 'Please select a valid department',
  }),

  jobTitle: z
    .string()
    .min(2, 'Job title must be at least 2 characters')
    .max(100, 'Job title must not exceed 100 characters'),

  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country must not exceed 100 characters'),

  salary: z
    .number({ message: 'Salary must be a number' })
    .positive('Salary must be a positive number')
    .max(10000000, 'Salary must not exceed 10,000,000')
    .multipleOf(0.01, 'Salary can have at most 2 decimal places'),

  currency: z.nativeEnum(Currency, {
    message: 'Please select a valid currency',
  }),

  employmentType: z.nativeEnum(EmploymentType, {
    message: 'Please select a valid employment type',
  }),

  status: z.nativeEnum(EmployeeStatus, {
    message: 'Please select a valid status',
  }),

  joiningDate: z
    .string()
    .min(1, 'Joining date is required')
    .refine(
      (date) => {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
      },
      { message: 'Please enter a valid date' }
    )
    .refine(
      (date) => {
        const parsed = new Date(date);
        const now = new Date();
        return parsed <= now;
      },
      { message: 'Joining date cannot be in the future' }
    ),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;

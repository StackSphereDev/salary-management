import { z } from 'zod';
import {
  VALID_DEPARTMENTS,
  VALID_EMPLOYEE_STATUSES,
  VALID_EMPLOYMENT_TYPES,
} from '../types/employee.types';

export const salaryInsightsQuerySchema = z.object({
  department: z.enum(VALID_DEPARTMENTS as [string, ...string[]]).optional(),
  country: z.string().optional(),
  employmentType: z.enum(VALID_EMPLOYMENT_TYPES as [string, ...string[]]).optional(),
  status: z.enum(VALID_EMPLOYEE_STATUSES as [string, ...string[]]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const salaryDistributionQuerySchema = salaryInsightsQuerySchema.extend({
  bucketCount: z.coerce.number().int().min(2).max(20).optional(),
});

export const topEarnersQuerySchema = salaryInsightsQuerySchema.extend({
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const salaryTrendQuerySchema = z.object({
  department: z.enum(VALID_DEPARTMENTS as [string, ...string[]]).optional(),
  country: z.string().optional(),
  groupBy: z.enum(['month', 'quarter', 'year']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const departmentParamSchema = z.object({
  department: z.enum(VALID_DEPARTMENTS as [string, ...string[]]),
});

export const countryParamSchema = z.object({
  country: z.string().min(1),
});

export type SalaryInsightsQueryInput = z.infer<typeof salaryInsightsQuerySchema>;
export type SalaryDistributionQueryInput = z.infer<typeof salaryDistributionQuerySchema>;
export type TopEarnersQueryInput = z.infer<typeof topEarnersQuerySchema>;
export type SalaryTrendQueryInput = z.infer<typeof salaryTrendQuerySchema>;
export type DepartmentParamInput = z.infer<typeof departmentParamSchema>;
export type CountryParamInput = z.infer<typeof countryParamSchema>;

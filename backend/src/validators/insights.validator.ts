import { query, param } from 'express-validator';
import {
  VALID_DEPARTMENTS,
  VALID_EMPLOYMENT_TYPES,
  VALID_EMPLOYEE_STATUSES,
} from '../types/employee.types';

export const salaryInsightsQueryValidator = [
  query('department')
    .optional()
    .isIn(VALID_DEPARTMENTS)
    .withMessage(`Department must be one of: ${VALID_DEPARTMENTS.join(', ')}`),

  query('country').optional().trim(),

  query('employmentType')
    .optional()
    .isIn(VALID_EMPLOYMENT_TYPES)
    .withMessage(`Employment type must be one of: ${VALID_EMPLOYMENT_TYPES.join(', ')}`),

  query('status')
    .optional()
    .isIn(VALID_EMPLOYEE_STATUSES)
    .withMessage(`Status must be one of: ${VALID_EMPLOYEE_STATUSES.join(', ')}`),

  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),

  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
];

export const salaryDistributionQueryValidator = [
  ...salaryInsightsQueryValidator,
  query('bucketCount')
    .optional()
    .isInt({ min: 2, max: 20 })
    .withMessage('Bucket count must be between 2 and 20')
    .toInt(),
];

export const topEarnersQueryValidator = [
  ...salaryInsightsQueryValidator,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
];

export const salaryTrendQueryValidator = [
  query('department')
    .optional()
    .isIn(VALID_DEPARTMENTS)
    .withMessage(`Department must be one of: ${VALID_DEPARTMENTS.join(', ')}`),

  query('country').optional().trim(),

  query('groupBy')
    .optional()
    .isIn(['month', 'quarter', 'year'])
    .withMessage('Group by must be one of: month, quarter, year'),

  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),

  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
];

export const departmentParamValidator = [
  param('department')
    .notEmpty()
    .withMessage('Department is required')
    .isIn(VALID_DEPARTMENTS)
    .withMessage(`Department must be one of: ${VALID_DEPARTMENTS.join(', ')}`),
];

export const countryParamValidator = [
  param('country').trim().notEmpty().withMessage('Country is required'),
];

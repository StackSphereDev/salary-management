import { body, query } from 'express-validator';
import {
  VALID_DEPARTMENTS,
  VALID_EMPLOYMENT_TYPES,
  VALID_EMPLOYEE_STATUSES,
  VALID_CURRENCIES,
} from '../types/employee.types';

export const createEmployeeValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .isIn(VALID_DEPARTMENTS)
    .withMessage(`Department must be one of: ${VALID_DEPARTMENTS.join(', ')}`),

  body('jobTitle')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Job title must be between 2 and 100 characters'),

  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),

  body('salary')
    .notEmpty()
    .withMessage('Salary is required')
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),

  body('currency')
    .optional()
    .isIn(VALID_CURRENCIES)
    .withMessage(`Currency must be one of: ${VALID_CURRENCIES.join(', ')}`),

  body('joiningDate')
    .notEmpty()
    .withMessage('Joining date is required')
    .isISO8601()
    .withMessage('Joining date must be a valid date'),

  body('employmentType')
    .notEmpty()
    .withMessage('Employment type is required')
    .isIn(VALID_EMPLOYMENT_TYPES)
    .withMessage(`Employment type must be one of: ${VALID_EMPLOYMENT_TYPES.join(', ')}`),

  body('status')
    .optional()
    .isIn(VALID_EMPLOYEE_STATUSES)
    .withMessage(`Status must be one of: ${VALID_EMPLOYEE_STATUSES.join(', ')}`),
];

export const updateEmployeeValidator = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),

  body('email').optional().trim().isEmail().withMessage('Invalid email format').normalizeEmail(),

  body('department')
    .optional()
    .isIn(VALID_DEPARTMENTS)
    .withMessage(`Department must be one of: ${VALID_DEPARTMENTS.join(', ')}`),

  body('jobTitle')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Job title must be between 2 and 100 characters'),

  body('country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),

  body('salary').optional().isFloat({ min: 0 }).withMessage('Salary must be a positive number'),

  body('currency')
    .optional()
    .isIn(VALID_CURRENCIES)
    .withMessage(`Currency must be one of: ${VALID_CURRENCIES.join(', ')}`),

  body('joiningDate').optional().isISO8601().withMessage('Joining date must be a valid date'),

  body('employmentType')
    .optional()
    .isIn(VALID_EMPLOYMENT_TYPES)
    .withMessage(`Employment type must be one of: ${VALID_EMPLOYMENT_TYPES.join(', ')}`),

  body('status')
    .optional()
    .isIn(VALID_EMPLOYEE_STATUSES)
    .withMessage(`Status must be one of: ${VALID_EMPLOYEE_STATUSES.join(', ')}`),
];

export const listEmployeesValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Page size must be between 1 and 100')
    .toInt(),

  query('sortBy')
    .optional()
    .isIn([
      'fullName',
      'email',
      'department',
      'salary',
      'joiningDate',
      'createdAt',
      'country',
      'status',
      'name',
    ])
    .withMessage('Invalid sort field'),

  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc'),

  query('department').optional().trim(),

  query('status').optional().trim(),

  query('employmentType').optional().trim(),

  query('country').optional().trim(),

  query('search')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must be at most 100 characters'),

  query('minSalary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum salary must be a positive number')
    .toFloat(),

  query('maxSalary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum salary must be a positive number')
    .toFloat(),
];

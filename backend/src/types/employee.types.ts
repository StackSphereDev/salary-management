export enum Department {
  ENGINEERING = 'ENGINEERING',
  PRODUCT = 'PRODUCT',
  DESIGN = 'DESIGN',
  MARKETING = 'MARKETING',
  SALES = 'SALES',
  HUMAN_RESOURCES = 'HUMAN_RESOURCES',
  FINANCE = 'FINANCE',
  OPERATIONS = 'OPERATIONS',
  CUSTOMER_SUCCESS = 'CUSTOMER_SUCCESS',
  LEGAL = 'LEGAL',
  IT = 'IT',
  ADMINISTRATION = 'ADMINISTRATION',
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERN = 'INTERN',
  TEMPORARY = 'TEMPORARY',
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  PROBATION = 'PROBATION',
  TERMINATED = 'TERMINATED',
  RESIGNED = 'RESIGNED',
  RETIRED = 'RETIRED',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  INR = 'INR',
  CAD = 'CAD',
  AUD = 'AUD',
  SGD = 'SGD',
  JPY = 'JPY',
  CNY = 'CNY',
}

export const VALID_DEPARTMENTS = Object.values(Department);
export const VALID_EMPLOYMENT_TYPES = Object.values(EmploymentType);
export const VALID_EMPLOYEE_STATUSES = Object.values(EmployeeStatus);
export const VALID_CURRENCIES = Object.values(Currency);

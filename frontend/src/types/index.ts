export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

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

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  jobTitle: string;
  country: string;
  salary: number;
  currency: string;
  employmentType: string;
  status: string;
  joiningDate: Date | string;
  createdAt: Date | string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EmployeeFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  department?: string;
  status?: string;
  employmentType?: string;
  country?: string;
  search?: string;
  minSalary?: number;
  maxSalary?: number;
}

import { Request } from 'express';
import { ParsedQs } from 'qs';

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export interface TypedRequestQuery<T extends ParsedQs> extends Request {
  query: T;
}

export interface EmployeeResponse {
  id: string;
  name: string;
  email: string;
  department: string;
  salary: number;
  country?: string;
  createdAt: Date;
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

export interface ListEmployeesQuery {
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

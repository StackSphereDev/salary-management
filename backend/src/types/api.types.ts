import { Request } from 'express';

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export interface EmployeeResponse {
  id: string;
  name: string;
  email: string;
  department: string;
  salary: number;
  createdAt: Date;
}

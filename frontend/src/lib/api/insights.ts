import { apiClient } from '../api-client';
import type {
  OverallSalaryInsights,
  DepartmentSalaryInsight,
  CountrySalaryInsight,
  TotalPayrollResponse,
  DepartmentSalaryAverageResponse,
  EmployeesPerCountryResponse,
} from '@/types/insights';

export const insightsApi = {
  getOverallInsights: () => apiClient.get<OverallSalaryInsights>('/api/insights/overall'),

  getDepartmentInsights: () =>
    apiClient.get<DepartmentSalaryInsight[]>('/api/insights/by-department'),

  getCountryInsights: () => apiClient.get<CountrySalaryInsight[]>('/api/insights/by-country'),

  getTotalPayroll: () =>
    apiClient.get<TotalPayrollResponse>('/api/insights/analytics/total-payroll'),

  getDepartmentSalaryAverages: () =>
    apiClient.get<DepartmentSalaryAverageResponse[]>(
      '/api/insights/analytics/department-salary-averages'
    ),

  getEmployeesPerCountry: () =>
    apiClient.get<EmployeesPerCountryResponse[]>('/api/insights/analytics/employees-per-country'),
};

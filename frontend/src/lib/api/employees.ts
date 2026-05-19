import { apiClient } from '../api-client';
import { Employee, PaginatedResponse, EmployeeFilters } from '@/types';

export const employeesApi = {
  list: async (filters?: EmployeeFilters): Promise<PaginatedResponse<Employee>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/api/employees?${queryString}` : '/api/employees';

    return apiClient.get<PaginatedResponse<Employee>>(endpoint);
  },

  getById: async (id: string): Promise<Employee> => {
    return apiClient.get<Employee>(`/api/employees/${id}`);
  },

  create: async (data: Partial<Employee>): Promise<Employee> => {
    return apiClient.post<Employee>('/api/employees', data);
  },

  update: async (id: string, data: Partial<Employee>): Promise<Employee> => {
    return apiClient.put<Employee>(`/api/employees/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/api/employees/${id}`);
  },
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesApi } from '@/lib/api/employees';
import { EmployeeFilters, Employee } from '@/types';

export function useEmployees(filters?: EmployeeFilters) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeesApi.list(filters),
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Employee>) => employeesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) =>
      employeesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

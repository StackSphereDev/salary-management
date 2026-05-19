'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { EmployeeFilters } from './employee-filters';
import { EmployeeTableSkeleton } from './employee-table-skeleton';
import { EmployeeTableEmpty } from './employee-table-empty';
import { EmployeeStatusBadge } from './employee-status-badge';
import { employeesApi } from '@/lib/api/employees';
import { Employee, EmployeeFilters as EmployeeFiltersType } from '@/types';

export function EmployeeTable() {
  const [filters, setFilters] = useState<EmployeeFiltersType>({
    page: 1,
    limit: 10,
    search: '',
    department: '',
    country: '',
    status: '',
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['employees', filters],
    queryFn: () => {
      const cleanFilters = { ...filters };
      if (cleanFilters.department === 'all') delete cleanFilters.department;
      if (cleanFilters.country === 'all') delete cleanFilters.country;
      if (cleanFilters.status === 'all') delete cleanFilters.status;
      if (!cleanFilters.search) delete cleanFilters.search;
      return employeesApi.list(cleanFilters);
    },
  });

  const uniqueCountries = useMemo(() => {
    if (!data?.data) return [];
    const countries = new Set(data.data.map((emp) => emp.country).filter(Boolean));
    return Array.from(countries).sort();
  }, [data?.data]);

  const hasActiveFilters = Boolean(
    filters.search ||
    (filters.department && filters.department !== 'all') ||
    (filters.country && filters.country !== 'all') ||
    (filters.status && filters.status !== 'all')
  );

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleDepartmentChange = (value: string) => {
    setFilters((prev) => ({ ...prev, department: value, page: 1 }));
  };

  const handleCountryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, country: value, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      department: '',
      country: '',
      status: '',
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeFilters
            search={filters.search || ''}
            department={filters.department || 'all'}
            country={filters.country || 'all'}
            status={filters.status || 'all'}
            onSearchChange={handleSearchChange}
            onDepartmentChange={handleDepartmentChange}
            onCountryChange={handleCountryChange}
            onStatusChange={handleStatusChange}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
            countries={uniqueCountries}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Employees
              {data?.pagination && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({data.pagination.total} total)
                </span>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <EmployeeTableSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-destructive">
                Error loading employees: {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <EmployeeTableEmpty hasFilters={hasActiveFilters} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="hidden lg:table-cell">Job Title</TableHead>
                      <TableHead className="hidden xl:table-cell">Country</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Salary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((employee: Employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{employee.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">
                              {employee.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{employee.email}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {employee.department
                              .split('_')
                              .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                              .join(' ')}
                          </div>
                          <div className="text-xs text-muted-foreground lg:hidden">
                            {employee.jobTitle}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{employee.jobTitle}</TableCell>
                        <TableCell className="hidden xl:table-cell">{employee.country}</TableCell>
                        <TableCell>
                          <EmployeeStatusBadge status={employee.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(employee.salary, employee.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data.pagination && data.pagination.totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={data.pagination.page}
                    totalPages={data.pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

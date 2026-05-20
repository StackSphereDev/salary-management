'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { insightsApi } from '@/lib/api/insights';
import { DollarSign, Users, Building2 } from 'lucide-react';

export default function SalariesPage() {
  const { data: departmentAverages, isLoading: loadingDept } = useQuery({
    queryKey: ['department-salary-averages'],
    queryFn: () => insightsApi.getDepartmentSalaryAverages(),
  });

  const { data: employeesPerCountry, isLoading: loadingCountry } = useQuery({
    queryKey: ['employees-per-country'],
    queryFn: () => insightsApi.getEmployeesPerCountry(),
  });

  const { data: totalPayroll, isLoading: loadingPayroll } = useQuery({
    queryKey: ['total-payroll'],
    queryFn: () => insightsApi.getTotalPayroll(),
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Salaries</h1>
        <p className="text-muted-foreground">View and manage salary information</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingPayroll ? (
              <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {totalPayroll?.totalPayroll ? formatCurrency(totalPayroll.totalPayroll) : '$0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalPayroll?.employeeCount
                    ? `${formatNumber(totalPayroll.employeeCount)} employees`
                    : 'No data'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingDept ? (
              <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <>
                <div className="text-2xl font-bold">{departmentAverages?.length ?? 0}</div>
                <p className="text-xs text-muted-foreground">Active departments</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingCountry ? (
              <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <>
                <div className="text-2xl font-bold">{employeesPerCountry?.length ?? 0}</div>
                <p className="text-xs text-muted-foreground">Operating locations</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Salary Averages</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDept ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : departmentAverages && departmentAverages.length > 0 ? (
              <div className="space-y-4">
                {departmentAverages
                  .sort((a, b) => b.averageSalary - a.averageSalary)
                  .map((dept) => (
                    <div key={dept.department} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {dept.department
                              .split('_')
                              .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                              .join(' ')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(dept.employeeCount)} employees
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(dept.averageSalary)}</div>
                        <p className="text-xs text-muted-foreground">avg salary</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No department data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employees by Country</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCountry ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : employeesPerCountry && employeesPerCountry.length > 0 ? (
              <div className="space-y-4">
                {employeesPerCountry
                  .sort((a, b) => b.employeeCount - a.employeeCount)
                  .map((country) => (
                    <div key={country.country} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{country.country}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">
                            {formatNumber(country.employeeCount)}
                          </span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({country.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${country.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No country data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

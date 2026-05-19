'use client';

import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { KPICard } from '@/components/insights/kpi-card';
import { DepartmentMetrics } from '@/components/insights/department-metrics';
import { CountryMetrics } from '@/components/insights/country-metrics';
import { useInsights } from '@/hooks/use-insights';

export default function DashboardPage() {
  const { overallInsights, departmentInsights, countryInsights, totalPayroll, isLoading, error } =
    useInsights();

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

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salary Insights</h1>
          <p className="text-muted-foreground">Comprehensive salary analytics and metrics</p>
        </div>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">Error loading insights: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Salary Insights</h1>
        <p className="text-muted-foreground">Comprehensive salary analytics and metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Average Salary"
          value={overallInsights?.overall?.avg ? formatCurrency(overallInsights.overall.avg) : '$0'}
          subtitle={
            overallInsights?.overall?.count
              ? `Across ${formatNumber(overallInsights.overall.count)} employees`
              : 'No data'
          }
          icon={TrendingUp}
          isLoading={isLoading}
        />

        <KPICard
          title="Min Salary"
          value={overallInsights?.overall?.min ? formatCurrency(overallInsights.overall.min) : '$0'}
          subtitle="Lowest salary"
          icon={TrendingDown}
          isLoading={isLoading}
        />

        <KPICard
          title="Max Salary"
          value={overallInsights?.overall?.max ? formatCurrency(overallInsights.overall.max) : '$0'}
          subtitle="Highest salary"
          icon={TrendingUp}
          isLoading={isLoading}
        />

        <KPICard
          title="Total Payroll"
          value={totalPayroll?.totalPayroll ? formatCurrency(totalPayroll.totalPayroll) : '$0'}
          subtitle={
            totalPayroll?.employeeCount
              ? `${formatNumber(totalPayroll.employeeCount)} employees`
              : 'No data'
          }
          icon={DollarSign}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DepartmentMetrics data={departmentInsights} isLoading={isLoading} />
        <CountryMetrics data={countryInsights} isLoading={isLoading} />
      </div>

      {overallInsights?.overall && !isLoading && (
        <div className="grid gap-4 md:grid-cols-3">
          <KPICard
            title="Total Employees"
            value={formatNumber(overallInsights.overall.count)}
            subtitle="Active employees"
            icon={Users}
          />
          <KPICard
            title="Median Salary"
            value={formatCurrency(overallInsights.overall.median)}
            subtitle="Middle point"
            icon={TrendingUp}
          />
          <KPICard
            title="Departments"
            value={overallInsights.byDepartment?.length ?? 0}
            subtitle="Active departments"
            icon={Users}
          />
        </div>
      )}
    </div>
  );
}

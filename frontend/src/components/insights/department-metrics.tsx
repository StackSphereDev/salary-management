import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DepartmentSalaryInsight } from '@/types/insights';

interface DepartmentMetricsProps {
  data: DepartmentSalaryInsight[];
  isLoading?: boolean;
}

export function DepartmentMetrics({ data, isLoading }: DepartmentMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDepartmentName = (dept: string) => {
    return dept
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No department data available</p>
        </CardContent>
      </Card>
    );
  }

  const sortedData = Array.isArray(data)
    ? [...data].sort((a, b) => b.statistics.avg - a.statistics.avg)
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedData.map((dept) => (
            <div key={dept.department} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{formatDepartmentName(dept.department)}</h4>
                <span className="text-xs text-muted-foreground">
                  {dept.employeeCount} {dept.employeeCount === 1 ? 'employee' : 'employees'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Avg Salary</p>
                  <p className="font-semibold">{formatCurrency(dept.statistics.avg)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Min</p>
                  <p className="font-semibold">{formatCurrency(dept.statistics.min)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Max</p>
                  <p className="font-semibold">{formatCurrency(dept.statistics.max)}</p>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${(dept.statistics.avg / sortedData[0].statistics.avg) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

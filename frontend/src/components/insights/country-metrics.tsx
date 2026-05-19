import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { CountrySalaryInsight } from '@/types/insights';

interface CountryMetricsProps {
  data: CountrySalaryInsight[];
  isLoading?: boolean;
}

export function CountryMetrics({ data, isLoading }: CountryMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Country Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
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
          <CardTitle>Country Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No country data available</p>
        </CardContent>
      </Card>
    );
  }

  const sortedData = Array.isArray(data)
    ? [...data].sort((a, b) => b.employeeCount - a.employeeCount)
    : [];
  const totalEmployees = sortedData.reduce((sum, country) => sum + country.employeeCount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Country Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedData.map((country) => {
            const percentage = ((country.employeeCount / totalEmployees) * 100).toFixed(1);
            return (
              <div key={country.country} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{country.country}</h4>
                  <span className="text-xs text-muted-foreground">
                    {country.employeeCount} ({percentage}%)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Salary</p>
                    <p className="font-semibold">{formatCurrency(country.statistics.avg)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Min</p>
                    <p className="font-semibold">{formatCurrency(country.statistics.min)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Max</p>
                    <p className="font-semibold">{formatCurrency(country.statistics.max)}</p>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

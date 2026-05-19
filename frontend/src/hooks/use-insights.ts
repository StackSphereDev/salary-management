import { useEffect, useState } from 'react';
import { insightsApi } from '@/lib/api/insights';
import type {
  OverallSalaryInsights,
  DepartmentSalaryInsight,
  CountrySalaryInsight,
  TotalPayrollResponse,
} from '@/types/insights';

export function useInsights() {
  const [overallInsights, setOverallInsights] = useState<OverallSalaryInsights | null>(null);
  const [departmentInsights, setDepartmentInsights] = useState<DepartmentSalaryInsight[]>([]);
  const [countryInsights, setCountryInsights] = useState<CountrySalaryInsight[]>([]);
  const [totalPayroll, setTotalPayroll] = useState<TotalPayrollResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [overall, departments, countries, payroll] = await Promise.all([
          insightsApi.getOverallInsights(),
          insightsApi.getDepartmentInsights(),
          insightsApi.getCountryInsights(),
          insightsApi.getTotalPayroll(),
        ]);

        setOverallInsights(overall);
        setDepartmentInsights(departments);
        setCountryInsights(countries);
        setTotalPayroll(payroll);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch insights');
        console.error('Error fetching insights:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchInsights();
  }, []);

  return {
    overallInsights,
    departmentInsights,
    countryInsights,
    totalPayroll,
    isLoading,
    error,
  };
}

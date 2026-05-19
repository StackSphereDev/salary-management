export interface SalaryStatistics {
  min: number;
  max: number;
  avg: number;
  median: number;
  count: number;
}

export interface DepartmentSalaryInsight {
  department: string;
  statistics: SalaryStatistics;
  employeeCount: number;
}

export interface CountrySalaryInsight {
  country: string;
  statistics: SalaryStatistics;
  employeeCount: number;
}

export interface EmploymentTypeSalaryInsight {
  employmentType: string;
  statistics: SalaryStatistics;
  employeeCount: number;
}

export interface SalaryDistributionBucket {
  range: string;
  minSalary: number;
  maxSalary: number;
  count: number;
  percentage: number;
}

export interface SalaryTrendDataPoint {
  period: string;
  avgSalary: number;
  employeeCount: number;
  minSalary: number;
  maxSalary: number;
}

export interface TopEarnersInsight {
  id: string;
  name: string;
  department: string;
  jobTitle: string;
  salary: number;
  currency: string;
}

export interface SalaryInsightsQuery {
  department?: string;
  country?: string;
  employmentType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface SalaryDistributionQuery extends SalaryInsightsQuery {
  bucketCount?: number;
}

export interface TopEarnersQuery extends SalaryInsightsQuery {
  limit?: number;
}

export interface SalaryTrendQuery {
  department?: string;
  country?: string;
  groupBy?: 'month' | 'quarter' | 'year';
  startDate?: string;
  endDate?: string;
}

export interface OverallSalaryInsights {
  overall: SalaryStatistics;
  byDepartment: DepartmentSalaryInsight[];
  byCountry: CountrySalaryInsight[];
  byEmploymentType: EmploymentTypeSalaryInsight[];
}

export interface AggregationResult {
  _min: { salary: number | null };
  _max: { salary: number | null };
  _avg: { salary: number | null };
  _count: number;
}

export interface GroupedAggregationResult extends AggregationResult {
  department?: string;
  country?: string;
  employmentType?: string;
}

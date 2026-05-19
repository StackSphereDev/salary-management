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

export interface TotalPayrollResponse {
  totalPayroll: number;
  employeeCount: number;
  currency: string;
}

export interface DepartmentSalaryAverageResponse {
  department: string;
  averageSalary: number;
  employeeCount: number;
}

export interface EmployeesPerCountryResponse {
  country: string;
  employeeCount: number;
  percentage: number;
}

export interface OverallSalaryInsights {
  overall: SalaryStatistics;
  byDepartment: DepartmentSalaryInsight[];
  byCountry: CountrySalaryInsight[];
  byEmploymentType: EmploymentTypeSalaryInsight[];
}

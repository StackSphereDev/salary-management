import { PrismaClient, Prisma } from '@prisma/client';
import { GroupedAggregationResult, SalaryStatistics } from '../types/insights.types';

export class AggregationService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async getSalaryStatistics(where?: Prisma.EmployeeWhereInput): Promise<SalaryStatistics> {
    const [aggregation, employees] = await Promise.all([
      this.prisma.employee.aggregate({
        where,
        _min: { salary: true },
        _max: { salary: true },
        _avg: { salary: true },
        _count: true,
      }),
      this.prisma.employee.findMany({
        where,
        select: { salary: true },
        orderBy: { salary: 'asc' },
      }),
    ]);

    const median = this.calculateMedian(employees.map((e) => e.salary));

    return {
      min: aggregation._min.salary || 0,
      max: aggregation._max.salary || 0,
      avg: Math.round((aggregation._avg.salary || 0) * 100) / 100,
      median,
      count: aggregation._count,
    };
  }

  async groupByDepartment(where?: Prisma.EmployeeWhereInput): Promise<GroupedAggregationResult[]> {
    const results = await this.prisma.employee.groupBy({
      by: ['department'],
      where,
      _min: { salary: true },
      _max: { salary: true },
      _avg: { salary: true },
      _count: true,
      orderBy: { _avg: { salary: 'desc' } },
    });

    return results as GroupedAggregationResult[];
  }

  async groupByCountry(where?: Prisma.EmployeeWhereInput): Promise<GroupedAggregationResult[]> {
    const results = await this.prisma.employee.groupBy({
      by: ['country'],
      where,
      _min: { salary: true },
      _max: { salary: true },
      _avg: { salary: true },
      _count: true,
      orderBy: { _avg: { salary: 'desc' } },
    });

    return results as GroupedAggregationResult[];
  }

  async groupByEmploymentType(
    where?: Prisma.EmployeeWhereInput
  ): Promise<GroupedAggregationResult[]> {
    const results = await this.prisma.employee.groupBy({
      by: ['employmentType'],
      where,
      _min: { salary: true },
      _max: { salary: true },
      _avg: { salary: true },
      _count: true,
      orderBy: { _avg: { salary: 'desc' } },
    });

    return results as GroupedAggregationResult[];
  }

  async getMedianSalaryForGroup(where: Prisma.EmployeeWhereInput): Promise<number> {
    const employees = await this.prisma.employee.findMany({
      where,
      select: { salary: true },
      orderBy: { salary: 'asc' },
    });

    return this.calculateMedian(employees.map((e) => e.salary));
  }

  async getSalaryDistribution(
    bucketCount: number,
    where?: Prisma.EmployeeWhereInput
  ): Promise<{ range: string; minSalary: number; maxSalary: number; count: number }[]> {
    const aggregation = await this.prisma.employee.aggregate({
      where,
      _min: { salary: true },
      _max: { salary: true },
      _count: true,
    });

    const minSalary = aggregation._min.salary || 0;
    const maxSalary = aggregation._max.salary || 0;
    const totalCount = aggregation._count;

    if (totalCount === 0 || minSalary === maxSalary) {
      return [];
    }

    const bucketSize = (maxSalary - minSalary) / bucketCount;
    const buckets: { range: string; minSalary: number; maxSalary: number; count: number }[] = [];

    for (let i = 0; i < bucketCount; i++) {
      const bucketMin = minSalary + i * bucketSize;
      const bucketMax = i === bucketCount - 1 ? maxSalary : minSalary + (i + 1) * bucketSize;

      const count = await this.prisma.employee.count({
        where: {
          ...where,
          salary: {
            gte: bucketMin,
            lte: bucketMax,
          },
        },
      });

      buckets.push({
        range: `${Math.round(bucketMin)}-${Math.round(bucketMax)}`,
        minSalary: Math.round(bucketMin),
        maxSalary: Math.round(bucketMax),
        count,
      });
    }

    return buckets;
  }

  async getTopEarners(
    limit: number,
    where?: Prisma.EmployeeWhereInput
  ): Promise<
    Array<{
      id: string;
      fullName: string;
      department: string;
      jobTitle: string;
      salary: number;
      currency: string;
    }>
  > {
    return this.prisma.employee.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        department: true,
        jobTitle: true,
        salary: true,
        currency: true,
      },
      orderBy: { salary: 'desc' },
      take: limit,
    });
  }

  async getSalaryTrends(
    groupBy: 'month' | 'quarter' | 'year',
    where?: Prisma.EmployeeWhereInput
  ): Promise<
    Array<{
      period: string;
      avgSalary: number;
      employeeCount: number;
      minSalary: number;
      maxSalary: number;
    }>
  > {
    const employees = await this.prisma.employee.findMany({
      where,
      select: {
        joiningDate: true,
        salary: true,
      },
      orderBy: { joiningDate: 'asc' },
    });

    const grouped = new Map<
      string,
      { salaries: number[]; count: number; min: number; max: number }
    >();

    employees.forEach((emp) => {
      const period = this.formatPeriod(emp.joiningDate, groupBy);
      const existing = grouped.get(period) || {
        salaries: [],
        count: 0,
        min: Infinity,
        max: -Infinity,
      };

      existing.salaries.push(emp.salary);
      existing.count++;
      existing.min = Math.min(existing.min, emp.salary);
      existing.max = Math.max(existing.max, emp.salary);

      grouped.set(period, existing);
    });

    const trends: Array<{
      period: string;
      avgSalary: number;
      employeeCount: number;
      minSalary: number;
      maxSalary: number;
    }> = [];

    grouped.forEach((data, period) => {
      const avg = data.salaries.reduce((sum, sal) => sum + sal, 0) / data.count;
      trends.push({
        period,
        avgSalary: Math.round(avg * 100) / 100,
        employeeCount: data.count,
        minSalary: data.min,
        maxSalary: data.max,
      });
    });

    return trends.sort((a, b) => a.period.localeCompare(b.period));
  }

  private calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 100) / 100;
    }

    return sorted[mid];
  }

  private formatPeriod(date: Date, groupBy: 'month' | 'quarter' | 'year'): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    switch (groupBy) {
      case 'year':
        return `${year}`;
      case 'quarter': {
        const quarter = Math.ceil(month / 3);
        return `${year}-Q${quarter}`;
      }
      case 'month':
        return `${year}-${String(month).padStart(2, '0')}`;
      default:
        return `${year}`;
    }
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

import { Prisma } from '@prisma/client';
import { AggregationService } from './aggregation.service';
import {
  SalaryInsightsQuery,
  OverallSalaryInsights,
  DepartmentSalaryInsight,
  CountrySalaryInsight,
  EmploymentTypeSalaryInsight,
  SalaryDistributionBucket,
  SalaryDistributionQuery,
  TopEarnersInsight,
  TopEarnersQuery,
  SalaryTrendDataPoint,
  SalaryTrendQuery,
  SalaryStatistics,
} from '../types/insights.types';
import { DatabaseError } from '../utils/error-handler';

export class SalaryInsightsService {
  private aggregationService: AggregationService;

  constructor(aggregationService?: AggregationService) {
    this.aggregationService = aggregationService || new AggregationService();
  }

  async getOverallInsights(query: SalaryInsightsQuery): Promise<OverallSalaryInsights> {
    try {
      const where = this.buildWhereClause(query);

      const [overall, byDepartment, byCountry, byEmploymentType] = await Promise.all([
        this.aggregationService.getSalaryStatistics(where),
        this.getDepartmentInsights(where),
        this.getCountryInsights(where),
        this.getEmploymentTypeInsights(where),
      ]);

      return {
        overall,
        byDepartment,
        byCountry,
        byEmploymentType,
      };
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch salary insights'
      );
    }
  }

  async getDepartmentInsights(
    where?: Prisma.EmployeeWhereInput
  ): Promise<DepartmentSalaryInsight[]> {
    try {
      const results = await this.aggregationService.groupByDepartment(where);

      const insights = await Promise.all(
        results.map(async (result) => {
          const departmentWhere: Prisma.EmployeeWhereInput = {
            ...where,
            department: result.department,
          };

          const median = await this.aggregationService.getMedianSalaryForGroup(departmentWhere);

          return {
            department: result.department || 'Unknown',
            statistics: {
              min: result._min.salary || 0,
              max: result._max.salary || 0,
              avg: Math.round((result._avg.salary || 0) * 100) / 100,
              median,
              count: result._count,
            },
            employeeCount: result._count,
          };
        })
      );

      return insights;
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch department insights'
      );
    }
  }

  async getCountryInsights(where?: Prisma.EmployeeWhereInput): Promise<CountrySalaryInsight[]> {
    try {
      const results = await this.aggregationService.groupByCountry(where);

      const insights = await Promise.all(
        results.map(async (result) => {
          const countryWhere: Prisma.EmployeeWhereInput = {
            ...where,
            country: result.country,
          };

          const median = await this.aggregationService.getMedianSalaryForGroup(countryWhere);

          return {
            country: result.country || 'Unknown',
            statistics: {
              min: result._min.salary || 0,
              max: result._max.salary || 0,
              avg: Math.round((result._avg.salary || 0) * 100) / 100,
              median,
              count: result._count,
            },
            employeeCount: result._count,
          };
        })
      );

      return insights;
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch country insights'
      );
    }
  }

  async getEmploymentTypeInsights(
    where?: Prisma.EmployeeWhereInput
  ): Promise<EmploymentTypeSalaryInsight[]> {
    try {
      const results = await this.aggregationService.groupByEmploymentType(where);

      const insights = await Promise.all(
        results.map(async (result) => {
          const employmentTypeWhere: Prisma.EmployeeWhereInput = {
            ...where,
            employmentType: result.employmentType,
          };

          const median = await this.aggregationService.getMedianSalaryForGroup(employmentTypeWhere);

          return {
            employmentType: result.employmentType || 'Unknown',
            statistics: {
              min: result._min.salary || 0,
              max: result._max.salary || 0,
              avg: Math.round((result._avg.salary || 0) * 100) / 100,
              median,
              count: result._count,
            },
            employeeCount: result._count,
          };
        })
      );

      return insights;
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch employment type insights'
      );
    }
  }

  async getSalaryDistribution(query: SalaryDistributionQuery): Promise<SalaryDistributionBucket[]> {
    try {
      const where = this.buildWhereClause(query);
      const bucketCount = Math.min(query.bucketCount || 5, 20);

      const buckets = await this.aggregationService.getSalaryDistribution(bucketCount, where);

      const totalCount = buckets.reduce((sum, bucket) => sum + bucket.count, 0);

      return buckets.map((bucket) => ({
        ...bucket,
        percentage: totalCount > 0 ? Math.round((bucket.count / totalCount) * 10000) / 100 : 0,
      }));
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch salary distribution'
      );
    }
  }

  async getTopEarners(query: TopEarnersQuery): Promise<TopEarnersInsight[]> {
    try {
      const where = this.buildWhereClause(query);
      const limit = Math.min(query.limit || 10, 100);

      const topEarners = await this.aggregationService.getTopEarners(limit, where);

      return topEarners.map((employee) => ({
        id: employee.id,
        name: employee.fullName,
        department: employee.department,
        jobTitle: employee.jobTitle,
        salary: employee.salary,
        currency: employee.currency,
      }));
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch top earners'
      );
    }
  }

  async getSalaryTrends(query: SalaryTrendQuery): Promise<SalaryTrendDataPoint[]> {
    try {
      const where = this.buildTrendWhereClause(query);
      const groupBy = query.groupBy || 'month';

      const trends = await this.aggregationService.getSalaryTrends(groupBy, where);

      return trends;
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch salary trends'
      );
    }
  }

  async getStatisticsByDepartment(department: string): Promise<SalaryStatistics> {
    try {
      return await this.aggregationService.getSalaryStatistics({ department });
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch department statistics'
      );
    }
  }

  async getStatisticsByCountry(country: string): Promise<SalaryStatistics> {
    try {
      return await this.aggregationService.getSalaryStatistics({ country });
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch country statistics'
      );
    }
  }

  private buildWhereClause(query: SalaryInsightsQuery): Prisma.EmployeeWhereInput {
    const where: Prisma.EmployeeWhereInput = {};

    if (query.department) {
      where.department = query.department;
    }

    if (query.country) {
      where.country = query.country;
    }

    if (query.employmentType) {
      where.employmentType = query.employmentType;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.startDate || query.endDate) {
      where.joiningDate = {};
      if (query.startDate) {
        where.joiningDate.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.joiningDate.lte = new Date(query.endDate);
      }
    }

    return where;
  }

  private buildTrendWhereClause(query: SalaryTrendQuery): Prisma.EmployeeWhereInput {
    const where: Prisma.EmployeeWhereInput = {};

    if (query.department) {
      where.department = query.department;
    }

    if (query.country) {
      where.country = query.country;
    }

    if (query.startDate || query.endDate) {
      where.joiningDate = {};
      if (query.startDate) {
        where.joiningDate.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.joiningDate.lte = new Date(query.endDate);
      }
    }

    return where;
  }
}

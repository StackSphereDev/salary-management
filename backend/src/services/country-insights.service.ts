import { PrismaClient } from '@prisma/client';
import { DatabaseError, NotFoundError } from '../utils/error-handler';

export interface JobTitleSalaryInsight {
  jobTitle: string;
  avgSalary: number;
  count: number;
}

export interface CountryInsightResponse {
  country: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  employeeCount: number;
  avgSalaryByJobTitle: JobTitleSalaryInsight[];
}

export class CountryInsightsService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async getInsightsByCountry(country: string): Promise<CountryInsightResponse> {
    try {
      // First, find the actual country name (case-insensitive search)
      const allEmployees = await this.prisma.employee.findMany({
        select: { country: true },
        distinct: ['country'],
      });

      const actualCountry = allEmployees.find(
        (emp) => emp.country.toLowerCase() === country.toLowerCase()
      )?.country;

      if (!actualCountry) {
        throw new NotFoundError(`No employees found for country: ${country}`);
      }

      const [aggregation, jobTitleAggregations] = await Promise.all([
        this.prisma.employee.aggregate({
          where: { country: actualCountry },
          _min: { salary: true },
          _max: { salary: true },
          _avg: { salary: true },
          _count: true,
        }),
        this.prisma.employee.groupBy({
          by: ['jobTitle'],
          where: { country: actualCountry },
          _avg: { salary: true },
          _count: true,
        }),
      ]);

      const totalCount = aggregation._count as number;

      if (totalCount === 0) {
        throw new NotFoundError(`No employees found for country: ${country}`);
      }

      const avgSalaryByJobTitle: JobTitleSalaryInsight[] = jobTitleAggregations.map((jt) => ({
        jobTitle: jt.jobTitle,
        avgSalary: Math.round((jt._avg?.salary || 0) * 100) / 100,
        count: jt._count as number,
      }));

      return {
        country: actualCountry,
        minSalary: aggregation._min?.salary || 0,
        maxSalary: aggregation._max?.salary || 0,
        avgSalary: Math.round((aggregation._avg?.salary || 0) * 100) / 100,
        employeeCount: totalCount,
        avgSalaryByJobTitle,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch country insights'
      );
    }
  }
}

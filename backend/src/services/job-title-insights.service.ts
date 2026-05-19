import { PrismaClient } from '@prisma/client';
import { DatabaseError } from '../utils/error-handler';

export interface JobTitleInsightResponse {
  jobTitle: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  employeeCount: number;
}

export class JobTitleInsightsService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async getAllJobTitleInsights(): Promise<JobTitleInsightResponse[]> {
    try {
      const jobTitleAggregations = await this.prisma.employee.groupBy({
        by: ['jobTitle'],
        _min: { salary: true },
        _max: { salary: true },
        _avg: { salary: true },
        _count: true,
        orderBy: { jobTitle: 'asc' },
      });

      return jobTitleAggregations.map((jt) => ({
        jobTitle: jt.jobTitle,
        minSalary: jt._min.salary || 0,
        maxSalary: jt._max.salary || 0,
        avgSalary: Math.round((jt._avg.salary || 0) * 100) / 100,
        employeeCount: jt._count,
      }));
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch job title insights'
      );
    }
  }
}

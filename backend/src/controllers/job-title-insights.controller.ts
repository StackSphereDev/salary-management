import { Request, Response, NextFunction } from 'express';
import { JobTitleInsightsService } from '../services/job-title-insights.service';

export class JobTitleInsightsController {
  private service: JobTitleInsightsService;

  constructor(service?: JobTitleInsightsService) {
    this.service = service || new JobTitleInsightsService();
  }

  getAllJobTitleInsights = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const insights = await this.service.getAllJobTitleInsights();

      res.status(200).json(insights);
    } catch (error) {
      next(error);
    }
  };
}

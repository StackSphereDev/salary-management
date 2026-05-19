import { Request, Response, NextFunction } from 'express';
import { SalaryInsightsService } from '../services/salary-insights.service';

export class SalaryInsightsController {
  private service: SalaryInsightsService;

  constructor(service?: SalaryInsightsService) {
    this.service = service || new SalaryInsightsService();
  }

  getOverallInsights = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const insights = await this.service.getOverallInsights(req.query as any);

      res.status(200).json({
        success: true,
        data: insights,
      });
    } catch (error) {
      next(error);
    }
  };

  getDepartmentInsights = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const insights = await this.service.getDepartmentInsights(
        this.service['buildWhereClause'](req.query as any)
      );

      res.status(200).json({
        success: true,
        data: insights,
      });
    } catch (error) {
      next(error);
    }
  };

  getCountryInsights = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const insights = await this.service.getCountryInsights(
        this.service['buildWhereClause'](req.query as any)
      );

      res.status(200).json({
        success: true,
        data: insights,
      });
    } catch (error) {
      next(error);
    }
  };

  getEmploymentTypeInsights = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const insights = await this.service.getEmploymentTypeInsights(
        this.service['buildWhereClause'](req.query as any)
      );

      res.status(200).json({
        success: true,
        data: insights,
      });
    } catch (error) {
      next(error);
    }
  };

  getSalaryDistribution = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const distribution = await this.service.getSalaryDistribution(req.query as any);

      res.status(200).json({
        success: true,
        data: distribution,
      });
    } catch (error) {
      next(error);
    }
  };

  getTopEarners = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const topEarners = await this.service.getTopEarners(req.query as any);

      res.status(200).json({
        success: true,
        data: topEarners,
      });
    } catch (error) {
      next(error);
    }
  };

  getSalaryTrends = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const trends = await this.service.getSalaryTrends(req.query as any);

      res.status(200).json({
        success: true,
        data: trends,
      });
    } catch (error) {
      next(error);
    }
  };

  getStatisticsByDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { department } = req.params;
      const statistics = await this.service.getStatisticsByDepartment(department);

      res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  };

  getStatisticsByCountry = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { country } = req.params;
      const statistics = await this.service.getStatisticsByCountry(country);

      res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  };
}

import { Router, Request, Response, NextFunction } from 'express';
import { SalaryInsightsController } from '../controllers/salary-insights.controller';
import { CountryInsightsController } from '../controllers/country-insights.controller';
import { JobTitleInsightsController } from '../controllers/job-title-insights.controller';
import {
  salaryInsightsQueryValidator,
  salaryDistributionQueryValidator,
  topEarnersQueryValidator,
  salaryTrendQueryValidator,
  departmentParamValidator,
  countryParamValidator,
} from '../validators/insights.validator';
import { validationResult } from 'express-validator';

const router = Router();
const insightsController = new SalaryInsightsController();
const countryInsightsController = new CountryInsightsController();
const jobTitleInsightsController = new JobTitleInsightsController();

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .join(', ');
    res.status(400).json({ error: errorMessages });
    return;
  }
  next();
};

router.get('/insights/country/:country', (req: Request, res: Response, next: NextFunction) => {
  void countryInsightsController.getInsightsByCountry(req, res, next);
});

router.get('/insights/job-title', (req: Request, res: Response, next: NextFunction) => {
  void jobTitleInsightsController.getAllJobTitleInsights(req, res, next);
});

router.get(
  '/insights/overall',
  salaryInsightsQueryValidator,
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => {
    void insightsController.getOverallInsights(req, res, next);
  }
);

router.get(
  '/insights/by-department',
  salaryInsightsQueryValidator,
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => {
    void insightsController.getDepartmentInsights(req, res, next);
  }
);

router.get(
  '/insights/by-country',
  salaryInsightsQueryValidator,
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => {
    void insightsController.getCountryInsights(req, res, next);
  }
);

router.get(
  '/insights/by-employment-type',
  salaryInsightsQueryValidator,
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => {
    void insightsController.getEmploymentTypeInsights(req, res, next);
  }
);

router.get(
  '/insights/distribution',
  salaryDistributionQueryValidator,
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => {
    void insightsController.getSalaryDistribution(req, res, next);
  }
);

router.get(
  '/insights/top-earners',
  topEarnersQueryValidator,
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => {
    void insightsController.getTopEarners(req, res, next);
  }
);

router.get(
  '/insights/trends',
  salaryTrendQueryValidator,
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => {
    void insightsController.getSalaryTrends(req, res, next);
  }
);

router.get(
  '/insights/department/:department',
  departmentParamValidator,
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => {
    void insightsController.getStatisticsByDepartment(req, res, next);
  }
);

router.get(
  '/insights/country/:country',
  countryParamValidator,
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => {
    void insightsController.getStatisticsByCountry(req, res, next);
  }
);

export default router;

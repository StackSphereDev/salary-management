import { Request, Response, NextFunction } from 'express';
import { CountryInsightsService } from '../services/country-insights.service';

export class CountryInsightsController {
  private service: CountryInsightsService;

  constructor(service?: CountryInsightsService) {
    this.service = service || new CountryInsightsService();
  }

  getInsightsByCountry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { country } = req.params;
      const insights = await this.service.getInsightsByCountry(country);

      res.status(200).json(insights);
    } catch (error) {
      next(error);
    }
  };
}

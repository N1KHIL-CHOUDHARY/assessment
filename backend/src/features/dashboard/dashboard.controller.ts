import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';
import { sendSuccess } from '../../utils/apiResponse';

export class DashboardController {
  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const data = await dashboardService.getDashboardData(userId);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();

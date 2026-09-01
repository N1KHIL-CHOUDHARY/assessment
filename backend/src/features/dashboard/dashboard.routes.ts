import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Dashboard requires authentication
router.use(authenticate);

// GET /api/dashboard
router.get('/', dashboardController.getDashboard);

export default router;

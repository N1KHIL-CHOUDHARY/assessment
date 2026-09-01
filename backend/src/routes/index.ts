import { Router } from 'express';
import authRoutes from '../features/auth/auth.routes';
import topicRoutes from '../features/topics/topic.routes';
import sessionRoutes from '../features/sessions/session.routes';
import interactionRoutes from '../features/interactions/interaction.routes';
import dashboardRoutes from '../features/dashboard/dashboard.routes';
import { sendSuccess } from '../utils/apiResponse';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  sendSuccess(
    res,
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    'Cognibloom API is active'
  );
});

// Mount feature routers
router.use('/auth', authRoutes);
router.use('/topics', topicRoutes);
router.use('/sessions', sessionRoutes);
router.use('/interactions', interactionRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

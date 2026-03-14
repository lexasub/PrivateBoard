import express from 'express';
import authRoutes from './auth.js';
import boardsRoutes from './boards.js';
import adminRoutes from './admin.js';
import usersRoutes from './users.js';
import shareRoutes from './share.js';
import healthRoutes from './health.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/boards', boardsRoutes);
router.use('/admin', adminRoutes);
router.use('/users', usersRoutes);
router.use('/share', shareRoutes);
router.use('/health', healthRoutes);

export default router;

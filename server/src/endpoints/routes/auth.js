import express from 'express';
import { authService } from '../../services/auth.service.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Login with username and password
 */
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await authService.register(username, password);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/auth/password
 * Change password (authenticated)
 */
router.put('/password', authenticateToken, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/auth/me
 * Get current user info (authenticated)
 */
router.get('/me', authenticateToken, async (req, res, next) => {
    try {
        const result = await authService.getCurrentUser(req.user.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;

import express from 'express';
import { authService } from '../../services/auth.service.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/users
 * Get all users (for sharing dropdown)
 */
router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const users = await authService.getAllUsersExcept(req.user.id);
        res.json(users);
    } catch (error) {
        next(error);
    }
});

export default router;

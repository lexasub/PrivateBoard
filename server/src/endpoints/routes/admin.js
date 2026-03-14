import express from 'express';
import { authService } from '../../services/auth.service.js';
import { boardService } from '../../services/board.service.js';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
router.get('/users', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const users = await authService.getAllUsers();
        res.json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/admin/users/:userId/role
 * Update user role (admin only)
 */
router.put('/users/:userId/role', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        const result = await authService.updateUserRole(userId, role);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/admin/users/:userId
 * Delete user (admin only)
 */
router.delete('/users/:userId', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const result = await authService.deleteUser(userId, req.user.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/admin/boards
 * Get all boards (admin only)
 */
router.get('/boards', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const { userId } = req.query;
        
        let boards;
        if (userId) {
            boards = await boardService.getAllBoardsForUser(userId, 'user');
        } else {
            boards = await boardService.getAllBoardsForUser(req.user.id, 'admin');
        }
        
        res.json(boards);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/admin/boards/:id
 * Delete board (admin only)
 */
router.delete('/boards/:id', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const result = await boardService.deleteBoard(req.params.id, req.user.id, req.user.role);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;

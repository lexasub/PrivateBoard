import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import { userRepository } from '../repositories/user.repository.js';
import { boardService } from '../services/board.service.js';
import { hasPermission } from '../entity/board.js';

/**
 * Middleware to authenticate JWT token
 */
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

/**
 * Middleware to require admin role
 */
export async function requireAdmin(req, res, next) {
    try {
        const user = await userRepository.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Admin access required' });
    }
}

/**
 * Middleware to check board access
 * @param {string} requiredPermission - 'read', 'write', or 'admin'
 */
export function checkBoardAccess(requiredPermission = 'read') {
    return async (req, res, next) => {
        try {
            const boardId = req.params.id;
            const userId = req.user.id;
            const userRole = req.user.role;

            const accessInfo = await boardService.getBoardAccess(boardId, userId, userRole);

            if (!accessInfo.hasAccess) {
                return res.status(403).json({ error: 'Access denied' });
            }

            req.isOwner = accessInfo.isOwner;
            req.permission = accessInfo.permission;

            if (!hasPermission(accessInfo.permission, requiredPermission)) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            next();
        } catch (error) {
            if (error.message === 'Board not found') {
                return res.status(404).json({ error: 'Board not found' });
            }
            return res.status(500).json({ error: 'Database error' });
        }
    };
}

import express from 'express';
import { boardService } from '../../services/board.service.js';
import { authenticateToken, checkBoardAccess } from '../../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/boards
 * Get all boards for current user (owned + shared)
 */
router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const boards = await boardService.getAllBoardsForUser(req.user.id, req.user.role);
        res.json(boards);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/boards/shared-with-me
 * Get boards shared with current user
 */
router.get('/shared-with-me', authenticateToken, async (req, res, next) => {
    try {
        const boards = await boardService.getBoardsSharedWithMe(req.user.id);
        res.json(boards);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/boards/:id
 * Get single board by ID
 */
router.get('/:id', authenticateToken, checkBoardAccess('read'), async (req, res, next) => {
    try {
        const board = await boardService.getBoard(req.params.id, req.user.id, req.user.role);
        res.json(board);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/boards
 * Create a new board
 */
router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const { name } = req.body;
        const board = await boardService.createBoard(name, req.user.id);
        res.status(201).json(board);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/boards/:id
 * Update board (save)
 */
router.put('/:id', authenticateToken, checkBoardAccess('write'), async (req, res, next) => {
    try {
        const { name, data } = req.body;
        const result = await boardService.updateBoard(req.params.id, req.user.id, req.user.role, name, data);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/boards/:id
 * Delete board (owner or admin only)
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const result = await boardService.deleteBoard(req.params.id, req.user.id, req.user.role);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/boards/:id/last-update
 * Get board last update time (for polling)
 */
router.get('/:id/last-update', authenticateToken, async (req, res, next) => {
    try {
        const result = await boardService.getBoardUpdateTime(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/boards/:id/shares
 * Get board shares
 */
router.get('/:id/shares', authenticateToken, async (req, res, next) => {
    try {
        const shares = await boardService.getBoardShares(req.params.id, req.user.id, req.user.role);
        res.json(shares);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/boards/:id/shares
 * Share board with user
 */
router.post('/:id/shares', authenticateToken, async (req, res, next) => {
    try {
        const { userId, permissionLevel } = req.body;
        const result = await boardService.shareBoard(req.params.id, req.user.id, req.user.role, userId, permissionLevel);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/boards/:id/shares/:userId
 * Remove share
 */
router.delete('/:id/shares/:userId', authenticateToken, async (req, res, next) => {
    try {
        const result = await boardService.removeShare(req.params.id, req.user.id, req.user.role, req.params.userId);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/boards/:id/share-link
 * Create share link
 */
router.post('/:id/share-link', authenticateToken, async (req, res, next) => {
    try {
        const { permissionLevel, expiresDays } = req.body;
        const host = req.headers.host;
        const result = await boardService.createShareLink(req.params.id, req.user.id, req.user.role, permissionLevel, expiresDays, host);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/boards/:id/share-links
 * Get all share links for a board
 */
router.get('/:id/share-links', authenticateToken, async (req, res, next) => {
    try {
        const links = await boardService.getShareLinks(req.params.id, req.user.id, req.user.role);
        res.json(links);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/boards/:id/share-links/:tokenId
 * Delete share link
 */
router.delete('/:id/share-links/:tokenId', authenticateToken, async (req, res, next) => {
    try {
        const result = await boardService.deleteShareLink(req.params.id, req.user.id, req.user.role, req.params.tokenId);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;

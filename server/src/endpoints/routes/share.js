import express from 'express';
import { boardService } from '../../services/board.service.js';

const router = express.Router();

/**
 * GET /api/share/:token
 * Access board via share link (no auth required)
 */
router.get('/:token', async (req, res, next) => {
    try {
        const result = await boardService.accessBoardByToken(req.params.token);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/share/:token
 * Save board via share link
 */
router.put('/:token', async (req, res, next) => {
    try {
        const { data, name } = req.body;
        const result = await boardService.updateBoardByToken(req.params.token, data, name);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;

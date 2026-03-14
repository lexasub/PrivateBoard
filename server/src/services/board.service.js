import { v4 as uuidv4 } from 'uuid';
import { boardRepository } from '../repositories/board.repository.js';
import { boardShareRepository } from '../repositories/boardShare.repository.js';
import { shareTokenRepository } from '../repositories/shareToken.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { BoardValidators, hasPermission } from '../entity/board.js';

export const boardService = {
    async getAllBoardsForUser(userId, userRole) {
        // Admins can see all boards
        if (userRole === 'admin') {
            return await boardRepository.findAll();
        }

        const ownedBoards = await boardRepository.findByOwner(userId);
        const sharedBoards = await boardShareRepository.findByUserId(userId);

        const allBoards = [
            ...ownedBoards.map(b => ({ ...b, access_type: 'owner' })),
            ...sharedBoards.map(b => ({ ...b, access_type: 'shared', permission_level: b.permission_level }))
        ];

        return allBoards;
    },

    async getBoard(boardId, userId, userRole) {
        const board = await boardRepository.findById(boardId);
        if (!board) {
            throw new Error('Board not found');
        }

        const accessInfo = await this.getBoardAccess(boardId, userId, userRole);
        if (!accessInfo.hasAccess) {
            throw new Error('Access denied');
        }

        return {
            ...board,
            permission: accessInfo.permission,
            isOwner: accessInfo.isOwner
        };
    },

    async createBoard(name, userId) {
        const id = uuidv4();
        const boardName = name || 'Untitled Board';
        
        const board = await boardRepository.create(id, boardName, userId, '{}');
        return board;
    },

    async updateBoard(boardId, userId, userRole, name, data) {
        const accessInfo = await this.getBoardAccess(boardId, userId, userRole);
        if (!accessInfo.hasAccess || !hasPermission(accessInfo.permission, 'write')) {
            throw new Error('Write permission required');
        }

        const changes = await boardRepository.update(boardId, name, JSON.stringify(data));
        if (changes === 0) {
            throw new Error('Board not found');
        }

        return { success: true };
    },

    async deleteBoard(boardId, userId, userRole) {
        const board = await boardRepository.getOwnerId(boardId);
        if (!board) {
            throw new Error('Board not found');
        }

        const isAdmin = userRole === 'admin';
        const isOwner = board.owner_id === userId;

        if (!isOwner && !isAdmin) {
            throw new Error('Only owner or admin can delete board');
        }

        const changes = await boardRepository.delete(boardId);
        if (changes === 0) {
            throw new Error('Board not found');
        }

        return { success: true };
    },

    async getBoardUpdateTime(boardId) {
        const row = await boardRepository.getUpdateTime(boardId);
        if (!row) {
            throw new Error('Board not found');
        }
        return { updatedAt: row.updated_at };
    },

    async getBoardShares(boardId, userId, userRole) {
        const board = await boardRepository.getOwnerId(boardId);
        if (!board) {
            throw new Error('Board not found');
        }

        const isAdmin = userRole === 'admin';
        const isOwner = board.owner_id === userId;

        if (!isOwner && !isAdmin) {
            const share = await boardShareRepository.findByBoardAndUser(boardId, userId);
            if (!share || share.permission_level !== 'admin') {
                throw new Error('Access denied');
            }
        }

        return await boardShareRepository.findByBoardId(boardId);
    },

    async shareBoard(boardId, userId, userRole, targetUserId, permissionLevel) {
        const validation = BoardValidators.validateShareInput(targetUserId, permissionLevel);
        if (!validation.isValid) {
            throw new Error(validation.errors[0]);
        }

        const board = await boardRepository.getOwnerId(boardId);
        if (!board) {
            throw new Error('Board not found');
        }

        const canShare = await this.canManageShares(boardId, userId, userRole);
        if (!canShare) {
            throw new Error('Only owner or admin can share board');
        }

        const shareId = uuidv4();
        await boardShareRepository.create(shareId, boardId, targetUserId, permissionLevel);

        return { success: true, shareId };
    },

    async removeShare(boardId, userId, userRole, targetUserId) {
        const board = await boardRepository.getOwnerId(boardId);
        if (!board) {
            throw new Error('Board not found');
        }

        const canShare = await this.canManageShares(boardId, userId, userRole);
        if (!canShare) {
            throw new Error('Only owner or admin can manage shares');
        }

        const changes = await boardShareRepository.delete(boardId, targetUserId);
        return { success: true };
    },

    async getBoardsSharedWithMe(userId) {
        return await boardShareRepository.findByUserId(userId);
    },

    async createShareLink(boardId, userId, userRole, permissionLevel, expiresDays, host) {
        const validation = BoardValidators.validateShareLinkInput(permissionLevel, expiresDays);
        if (!validation.isValid) {
            throw new Error(validation.errors[0]);
        }

        const board = await boardRepository.getOwnerId(boardId);
        if (!board) {
            throw new Error('Board not found');
        }

        const isAdmin = userRole === 'admin';
        const isOwner = board.owner_id === userId;

        if (!isOwner && !isAdmin) {
            throw new Error('Only owner or admin can create share links');
        }

        const tokenId = uuidv4();
        const token = tokenId.replace(/-/g, '');
        const expiresAt = expiresDays
            ? new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString()
            : null;

        await shareTokenRepository.create(tokenId, boardId, token, permissionLevel, expiresAt);

        // Build share URL from host (from request) or use FRONTEND_URL env var
        const protocol = process.env.PROTOCOL || 'http';
        const frontendUrl = process.env.FRONTEND_URL || (host ? `${protocol}://${host}` : 'http://localhost:5173');
        const shareUrl = `${frontendUrl}/share/${token}`;

        return {
            success: true,
            tokenId,
            token,
            shareUrl,
            permissionLevel,
            expiresAt
        };
    },

    async getShareLinks(boardId, userId, userRole) {
        const board = await boardRepository.getOwnerId(boardId);
        if (!board) {
            throw new Error('Board not found');
        }

        const isAdmin = userRole === 'admin';
        const isOwner = board.owner_id === userId;

        if (!isOwner && !isAdmin) {
            throw new Error('Only owner or admin can view share links');
        }

        return await shareTokenRepository.findByBoardId(boardId);
    },

    async deleteShareLink(boardId, userId, userRole, tokenId) {
        const board = await boardRepository.getOwnerId(boardId);
        if (!board) {
            throw new Error('Board not found');
        }

        const isAdmin = userRole === 'admin';
        const isOwner = board.owner_id === userId;

        if (!isOwner && !isAdmin) {
            throw new Error('Only owner or admin can manage share links');
        }

        const changes = await shareTokenRepository.delete(tokenId);
        return { success: true };
    },

    async accessBoardByToken(token) {
        const shareToken = await shareTokenRepository.findByToken(token);
        if (!shareToken) {
            throw new Error('Invalid or expired share link');
        }

        if (shareToken.expires_at && new Date(shareToken.expires_at) < new Date()) {
            throw new Error('Share link has expired');
        }

        return {
            board: {
                id: shareToken.board_id,
                name: shareToken.name,
                data: shareToken.data,
                owner_username: shareToken.owner_username,
                updated_at: shareToken.updated_at
            },
            permission: shareToken.permission_level
        };
    },

    async updateBoardByToken(token, data, name) {
        const shareToken = await shareTokenRepository.findByToken(token);
        if (!shareToken) {
            throw new Error('Invalid share link');
        }

        if (shareToken.expires_at && new Date(shareToken.expires_at) < new Date()) {
            throw new Error('Share link has expired');
        }

        if (shareToken.permission_level === 'read') {
            throw new Error('Read-only access');
        }

        const changes = await boardRepository.update(shareToken.board_id, name, JSON.stringify(data));
        return { success: true };
    },

    // Helper methods
    async getBoardAccess(boardId, userId, userRole) {
        const board = await boardRepository.getOwnerId(boardId);
        if (!board) {
            return { hasAccess: false };
        }

        if (board.owner_id === userId) {
            return { hasAccess: true, permission: 'admin', isOwner: true };
        }

        if (userRole === 'admin') {
            return { hasAccess: true, permission: 'admin', isOwner: true };
        }

        const share = await boardShareRepository.findByBoardAndUser(boardId, userId);
        if (!share) {
            return { hasAccess: false };
        }

        return {
            hasAccess: true,
            permission: share.permission_level,
            isOwner: false
        };
    },

    async canManageShares(boardId, userId, userRole) {
        const board = await boardRepository.getOwnerId(boardId);
        if (!board) return false;

        if (board.owner_id === userId || userRole === 'admin') {
            return true;
        }

        const share = await boardShareRepository.findByBoardAndUser(boardId, userId);
        return share?.permission_level === 'admin';
    }
};

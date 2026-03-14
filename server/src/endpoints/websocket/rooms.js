import { websocketService } from '../../services/websocket.service.js';

/**
 * Room management utilities for WebSocket connections
 */

/**
 * Get all users in a board room
 * @param {string} boardId - Board ID
 * @returns {string[]} Array of usernames
 */
export function getBoardUsers(boardId) {
    return websocketService.getBoardUsers(boardId);
}

/**
 * Get connection count for a board
 * @param {string} boardId - Board ID
 * @returns {number} Number of connected clients
 */
export function getConnectionCount(boardId) {
    return websocketService.getConnectionCount(boardId);
}

/**
 * Check if a board has active connections
 * @param {string} boardId - Board ID
 * @returns {boolean}
 */
export function hasActiveConnections(boardId) {
    return websocketService.getConnectionCount(boardId) > 0;
}

/**
 * Broadcast a custom message to all users in a board
 * @param {string} boardId - Board ID
 * @param {object} message - Message to broadcast
 * @param {WebSocket} [excludeWs] - Optional WebSocket to exclude
 */
export function broadcastToBoard(boardId, message, excludeWs = null) {
    websocketService.broadcastToBoard(boardId, message, excludeWs);
}

/**
 * Clean up all connections for a board (e.g., when board is deleted)
 * @param {string} boardId - Board ID
 */
export function cleanupBoard(boardId) {
    websocketService.cleanupBoard(boardId);
}

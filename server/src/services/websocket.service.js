/**
 * WebSocket service for managing board connections and broadcasting
 */

export class WebSocketService {
    constructor() {
        // Map to store connected clients per board: boardId -> Set<{ws, userId, username}>
        this.boardConnections = new Map();
    }

    /**
     * Add a client to a board room
     */
    joinBoard(boardId, ws, userId, username) {
        if (!this.boardConnections.has(boardId)) {
            this.boardConnections.set(boardId, new Set());
        }

        const clientInfo = { ws, userId, username: username || 'Anonymous' };
        this.boardConnections.get(boardId).add(clientInfo);

        // Notify others in the room
        this.broadcastToBoard(boardId, {
            type: 'user-joined',
            payload: { username: username || 'Anonymous' }
        }, ws);

        // Send current list of users
        const users = Array.from(this.boardConnections.get(boardId))
            .map(c => c.username);
        ws.send(JSON.stringify({ type: 'users-list', payload: users }));

        console.log(`User ${username} joined board ${boardId}`);

        return clientInfo;
    }

    /**
     * Remove a client from a board room
     */
    leaveBoard(boardId, ws) {
        const clients = this.boardConnections.get(boardId);
        if (!clients) return null;

        let leftUser = null;
        for (const client of clients) {
            if (client.ws === ws) {
                leftUser = client.username;
                clients.delete(client);
                break;
            }
        }

        if (leftUser && clients.size > 0) {
            this.broadcastToBoard(boardId, {
                type: 'user-left',
                payload: { username: leftUser }
            }, null);
        }

        if (clients.size === 0) {
            this.boardConnections.delete(boardId);
        }

        console.log(`User left board ${boardId}`);
        return leftUser;
    }

    /**
     * Broadcast cursor position
     */
    broadcastCursor(boardId, userId, username, x, y, excludeWs) {
        if (boardId) {
            this.broadcastToBoard(boardId, {
                type: 'cursor',
                payload: {
                    userId,
                    username,
                    x,
                    y
                }
            }, excludeWs);
        }
    }

    /**
     * Broadcast canvas changes
     */
    broadcastChange(boardId, userId, username, snapshot, excludeWs) {
        if (boardId) {
            this.broadcastToBoard(boardId, {
                type: 'change',
                payload: {
                    userId,
                    username,
                    snapshot
                }
            }, excludeWs);
        }
    }

    /**
     * Broadcast to all clients on a board except sender
     */
    broadcastToBoard(boardId, message, excludeWs) {
        const clients = this.boardConnections.get(boardId);
        if (!clients) return;

        const messageStr = JSON.stringify(message);
        clients.forEach(client => {
            if (client.ws !== excludeWs && client.ws.readyState === 1) {
                client.ws.send(messageStr);
            }
        });
    }

    /**
     * Get connected users for a board
     */
    getBoardUsers(boardId) {
        const clients = this.boardConnections.get(boardId);
        if (!clients) return [];
        return Array.from(clients).map(c => c.username);
    }

    /**
     * Get connection count for a board
     */
    getConnectionCount(boardId) {
        const clients = this.boardConnections.get(boardId);
        return clients ? clients.size : 0;
    }

    /**
     * Clean up all connections for a board
     */
    cleanupBoard(boardId) {
        const clients = this.boardConnections.get(boardId);
        if (clients) {
            clients.forEach(client => {
                if (client.ws.readyState === 1) {
                    client.ws.close();
                }
            });
            this.boardConnections.delete(boardId);
        }
    }
}

// Export singleton instance
export const websocketService = new WebSocketService();

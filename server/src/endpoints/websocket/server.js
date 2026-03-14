import { WebSocketServer } from 'ws';
import { handleWebSocketMessage, handleWebSocketClose, handleWebSocketError } from './handlers.js';

/**
 * Setup WebSocket server
 * @param {http.Server} server - HTTP server to attach to
 * @returns {WebSocketServer}
 */
export function setupWebSocketServer(server) {
    const wss = new WebSocketServer({ server, path: '/ws' });

    wss.on('connection', (ws, req) => {
        console.log('New WebSocket connection');

        // Track current board and user for this connection
        let currentBoardId = null;
        let userId = null;

        ws.on('message', (message) => {
            handleWebSocketMessage(ws, message, (boardId, uid) => {
                currentBoardId = boardId;
                userId = uid;
            }, () => {
                currentBoardId = null;
            });
        });

        ws.on('close', () => {
            handleWebSocketClose(ws, currentBoardId);
        });

        ws.on('error', (err) => {
            handleWebSocketError(ws, currentBoardId, err);
        });
    });

    console.log('WebSocket server initialized');
    return wss;
}

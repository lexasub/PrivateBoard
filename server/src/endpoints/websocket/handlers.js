import { websocketService } from '../../services/websocket.service.js';

// WeakMap to track connection context
const connectionContext = new WeakMap();

/**
 * Handle incoming WebSocket message
 * @param {WebSocket} ws - WebSocket connection
 * @param {string} message - Raw message string
 * @param {function} setCurrentBoard - Callback to set current board context
 * @param {function} clearCurrentBoard - Callback to clear current board context
 */
export function handleWebSocketMessage(ws, message, setCurrentBoard, clearCurrentBoard) {
    try {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'join': {
                // Join a board room
                const { boardId, user } = data.payload;
                setCurrentBoard(boardId, user?.id);
                
                // Store context
                connectionContext.set(ws, { boardId, userId: user?.id });

                websocketService.joinBoard(boardId, ws, user?.id, user?.username || 'Anonymous');
                break;
            }

            case 'cursor': {
                // Broadcast cursor position
                const context = connectionContext.get(ws);
                const boardId = data.payload.boardId || context?.boardId;
                
                if (boardId) {
                    websocketService.broadcastCursor(
                        boardId,
                        data.payload.userId || context?.userId,
                        data.payload.username,
                        data.payload.x,
                        data.payload.y,
                        ws
                    );
                }
                break;
            }

            case 'change': {
                // Broadcast canvas changes (shapes, drawings, etc.)
                const context = connectionContext.get(ws);
                const boardId = data.payload.boardId || context?.boardId;
                
                if (boardId) {
                    websocketService.broadcastChange(
                        boardId,
                        data.payload.userId || context?.userId,
                        data.payload.username,
                        data.payload.snapshot,
                        ws
                    );
                }
                break;
            }

            case 'leave': {
                const context = connectionContext.get(ws);
                if (context?.boardId) {
                    websocketService.leaveBoard(context.boardId, ws);
                    clearCurrentBoard();
                    connectionContext.delete(ws);
                }
                break;
            }

            default:
                console.log('Unknown message type:', data.type);
        }
    } catch (err) {
        console.error('WebSocket message error:', err);
    }
}

/**
 * Handle WebSocket close event
 * @param {WebSocket} ws - WebSocket connection
 * @param {string} currentBoardId - Current board ID
 */
export function handleWebSocketClose(ws, currentBoardId) {
    const context = connectionContext.get(ws);
    const boardId = currentBoardId || context?.boardId;
    
    if (boardId) {
        websocketService.leaveBoard(boardId, ws);
        connectionContext.delete(ws);
    }
}

/**
 * Handle WebSocket error event
 * @param {WebSocket} ws - WebSocket connection
 * @param {string} currentBoardId - Current board ID
 * @param {Error} err - Error object
 */
export function handleWebSocketError(ws, currentBoardId, err) {
    console.error('WebSocket error:', err);
    const context = connectionContext.get(ws);
    const boardId = currentBoardId || context?.boardId;
    
    if (boardId) {
        websocketService.leaveBoard(boardId, ws);
    }
}

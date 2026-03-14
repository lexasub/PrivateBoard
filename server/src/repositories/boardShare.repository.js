import db from '../config/database.js';

export const boardShareRepository = {
    findByBoardAndUser(boardId, userId) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT permission_level FROM board_shares WHERE board_id = ? AND user_id = ?',
                [boardId, userId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    },

    findByBoardId(boardId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT bs.user_id, bs.permission_level, bs.created_at, u.username 
                 FROM board_shares bs 
                 JOIN users u ON bs.user_id = u.id 
                 WHERE bs.board_id = ?`,
                [boardId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    findByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT b.id, b.name, b.owner_id, b.created_at, b.updated_at, u.username as owner_username, bs.permission_level 
                 FROM boards b 
                 JOIN users u ON b.owner_id = u.id 
                 JOIN board_shares bs ON b.id = bs.board_id 
                 WHERE bs.user_id = ?`,
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    create(id, boardId, userId, permissionLevel) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT OR REPLACE INTO board_shares (id, board_id, user_id, permission_level) VALUES (?, ?, ?, ?)',
                [id, boardId, userId, permissionLevel],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id, board_id: boardId, user_id: userId, permission_level: permissionLevel });
                }
            );
        });
    },

    delete(boardId, userId) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM board_shares WHERE board_id = ? AND user_id = ?',
                [boardId, userId],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }
};

import db from '../config/database.js';

export const shareTokenRepository = {
    findByToken(token) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT st.*, b.name, b.owner_id, b.data, b.created_at, b.updated_at, u.username as owner_username 
                 FROM share_tokens st 
                 JOIN boards b ON st.board_id = b.id 
                 JOIN users u ON b.owner_id = u.id 
                 WHERE st.token = ?`,
                [token],
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
                'SELECT id, token, permission_level, created_at, expires_at FROM share_tokens WHERE board_id = ?',
                [boardId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    create(id, boardId, token, permissionLevel, expiresAt = null) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO share_tokens (id, board_id, token, permission_level, expires_at) VALUES (?, ?, ?, ?, ?)',
                [id, boardId, token, permissionLevel, expiresAt],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id, board_id: boardId, token, permission_level: permissionLevel, expires_at: expiresAt });
                }
            );
        });
    },

    delete(tokenId) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM share_tokens WHERE id = ?', [tokenId], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM share_tokens WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

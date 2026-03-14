import db from '../config/database.js';

export const boardRepository = {
    findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM boards WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    findByIdWithOwner(id) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT b.*, u.username as owner_username 
                 FROM boards b 
                 JOIN users u ON b.owner_id = u.id 
                 WHERE b.id = ?`,
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    },

    findByOwner(ownerId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT b.id, b.name, b.owner_id, b.created_at, b.updated_at, u.username as owner_username 
                 FROM boards b 
                 JOIN users u ON b.owner_id = u.id 
                 WHERE b.owner_id = ?`,
                [ownerId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    findAll() {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT b.id, b.name, b.owner_id, b.created_at, b.updated_at, u.username as owner_username 
                 FROM boards b 
                 JOIN users u ON b.owner_id = u.id 
                 ORDER BY b.updated_at DESC`,
                [],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    findAllByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT b.id, b.name, b.owner_id, b.created_at, b.updated_at, u.username as owner_username 
                 FROM boards b 
                 JOIN users u ON b.owner_id = u.id 
                 WHERE b.owner_id = ? 
                 ORDER BY b.updated_at DESC`,
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    create(id, name, ownerId, data = '{}') {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO boards (id, name, owner_id, data) VALUES (?, ?, ?, ?)',
                [id, name, ownerId, data],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id, name, owner_id: ownerId });
                }
            );
        });
    },

    update(id, name, data) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE boards SET name = COALESCE(?, name), data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [name, data, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    },

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM boards WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    getUpdateTime(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT updated_at FROM boards WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    getOwnerId(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT owner_id FROM boards WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

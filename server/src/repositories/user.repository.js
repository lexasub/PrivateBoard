import db from '../config/database.js';

export const userRepository = {
    findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    findByUsername(username) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    create(id, username, password, role = 'user') {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)',
                [id, username, password, role],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id, username, role });
                }
            );
        });
    },

    updatePassword(id, hash) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE users SET password = ? WHERE id = ?', [hash, id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    updateRole(id, role) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE users SET role = ? WHERE id = ?', [role, id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findAllExcept(id) {
        return new Promise((resolve, reject) => {
            db.all('SELECT id, username FROM users WHERE id != ? ORDER BY username', [id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findByIdWithRole(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT id, username, role FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    getRole(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT role FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

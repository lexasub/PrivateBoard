import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'boards.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
export function initDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table with role
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // Boards table
            db.run(`CREATE TABLE IF NOT EXISTS boards (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                owner_id TEXT NOT NULL,
                data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users(id)
            )`);

            // Board shares table (user-based sharing)
            db.run(`CREATE TABLE IF NOT EXISTS board_shares (
                id TEXT PRIMARY KEY,
                board_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                permission_level TEXT NOT NULL CHECK(permission_level IN ('read', 'write', 'admin')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(board_id, user_id)
            )`);

            // Share tokens table (link-based sharing)
            db.run(`CREATE TABLE IF NOT EXISTS share_tokens (
                id TEXT PRIMARY KEY,
                board_id TEXT NOT NULL,
                token TEXT UNIQUE NOT NULL,
                permission_level TEXT NOT NULL CHECK(permission_level IN ('read', 'write', 'admin')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                expires_at DATETIME,
                FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
            )`);

            console.log('Database initialized');
            resolve(db);
        });
    });
}

export default db;

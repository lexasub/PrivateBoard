import http from 'http';
import { createApp } from './app.js';
import { initDatabase } from './config/database.js';
import { setupWebSocketServer } from './endpoints/websocket/server.js';
import { userRepository } from './repositories/user.repository.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const PORT = process.env.PORT || 3001;

/**
 * Main entry point
 */
async function main() {
    try {
        // Initialize database
        await initDatabase();

        // Create default admin user if not exists
        await createDefaultAdmin();

        // Create Express app
        const app = createApp();

        // Create HTTP server
        const server = http.createServer(app);

        // Setup WebSocket server
        setupWebSocketServer(server);

        // Start server
        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`WebSocket server running on ws://localhost:${PORT}/ws`);
            console.log(`Default credentials: admin / admin`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

/**
 * Create default admin user if not exists
 */
async function createDefaultAdmin() {
    try {
        const existingAdmin = await userRepository.findByUsername('admin');
        
        if (!existingAdmin) {
            const adminId = uuidv4();
            const adminHash = bcrypt.hashSync('admin', 10);
            await userRepository.create(adminId, 'admin', adminHash, 'admin');
            console.log('Default admin created: admin/admin');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
}

// Start the server
main();

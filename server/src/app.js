import express from 'express';
import cors from 'cors';
import routes from './endpoints/routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

/**
 * Create and configure Express application
 * @returns {express.Application}
 */
export function createApp() {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json({ limit: '50mb' }));

    // API Routes
    app.use('/api', routes);

    // Error handling
    app.use(errorHandler);
    app.use(notFoundHandler);

    return app;
}

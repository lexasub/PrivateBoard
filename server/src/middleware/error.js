/**
 * Error handling middleware
 */
export function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: err.message,
            type: 'validation'
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Unauthorized',
            type: 'auth'
        });
    }

    // Handle known error messages
    const knownErrors = {
        'Invalid credentials': 401,
        'Access token required': 401,
        'Invalid or expired token': 403,
        'Admin access required': 403,
        'Access denied': 403,
        'Insufficient permissions': 403,
        'User not found': 404,
        'Board not found': 404,
        'Username already exists': 409,
        'Cannot delete yourself': 400,
        'Read-only access': 403,
        'Share link has expired': 403,
        'Invalid or expired share link': 404,
        'Invalid share link': 404,
        'Only owner or admin': 403,
        'Write permission required': 403,
        'New password must be at least 4 characters': 400,
        'Current password is incorrect': 401,
        'Username must be at least 3 characters': 400,
        'Password must be at least 4 characters': 400,
        'Valid username and password': 400,
        'Username and password required': 400,
        'Board name must be between': 400,
        'User ID required': 400,
        'Permission level must be': 400,
        'Invalid role': 400,
        'Database error': 500
    };

    for (const [message, status] of Object.entries(knownErrors)) {
        if (err.message && err.message.includes(message)) {
            return res.status(status).json({
                error: err.message,
                type: 'application'
            });
        }
    }

    // Default error response
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        type: 'internal'
    });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req, res, next) {
    res.status(404).json({
        error: 'Not found',
        path: req.path
    });
}

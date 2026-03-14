/**
 * Request validation middleware
 */

/**
 * Validate request body has required fields
 * @param {string[]} requiredFields - Array of required field names
 */
export function validateBody(...requiredFields) {
    return (req, res, next) => {
        const missingFields = requiredFields.filter(field => {
            return req.body[field] === undefined || req.body[field] === null;
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        next();
    };
}

/**
 * Validate request params has required fields
 * @param {string[]} requiredFields - Array of required field names
 */
export function validateParams(...requiredFields) {
    return (req, res, next) => {
        const missingFields = requiredFields.filter(field => {
            return req.params[field] === undefined || req.params[field] === null;
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required params: ${missingFields.join(', ')}`
            });
        }

        next();
    };
}

/**
 * Validate request query has required fields
 * @param {string[]} requiredFields - Array of required field names
 */
export function validateQuery(...requiredFields) {
    return (req, res, next) => {
        const missingFields = requiredFields.filter(field => {
            return req.query[field] === undefined || req.query[field] === null;
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required query params: ${missingFields.join(', ')}`
            });
        }

        next();
    };
}

/**
 * Validate string length
 * @param {string} field - Field name to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 */
export function validateStringLength(field, min, max) {
    return (req, res, next) => {
        const value = req.body[field];
        
        if (value !== undefined && (typeof value !== 'string' || value.length < min || value.length > max)) {
            return res.status(400).json({
                error: `${field} must be between ${min} and ${max} characters`
            });
        }

        next();
    };
}

/**
 * Validate enum value
 * @param {string} field - Field name to validate
 * @param {any[]} allowedValues - Array of allowed values
 */
export function validateEnum(field, ...allowedValues) {
    return (req, res, next) => {
        const value = req.body[field];
        
        if (value !== undefined && !allowedValues.includes(value)) {
            return res.status(400).json({
                error: `${field} must be one of: ${allowedValues.join(', ')}`
            });
        }

        next();
    };
}

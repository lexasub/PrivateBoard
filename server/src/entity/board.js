/**
 * Board entity validators
 */

export const BoardValidators = {
    isValidName(name) {
        return typeof name === 'string' && name.length > 0 && name.length <= 200;
    },

    isValidPermissionLevel(level) {
        return ['read', 'write', 'admin'].includes(level);
    },

    isValidBoardData(data) {
        // Board data should be a valid JSON object
        if (typeof data !== 'object' || data === null) {
            return false;
        }
        return true;
    },

    validateCreateInput(name) {
        const errors = [];
        
        if (!name || !this.isValidName(name)) {
            errors.push('Board name must be between 1 and 200 characters');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    validateShareInput(userId, permissionLevel) {
        const errors = [];
        
        if (!userId) {
            errors.push('User ID required');
        }
        
        if (!this.isValidPermissionLevel(permissionLevel)) {
            errors.push('Permission level must be read, write, or admin');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    validateShareLinkInput(permissionLevel, expiresDays) {
        const errors = [];
        
        if (!this.isValidPermissionLevel(permissionLevel)) {
            errors.push('Permission level must be read, write, or admin');
        }
        
        if (expiresDays !== undefined && (typeof expiresDays !== 'number' || expiresDays < 0)) {
            errors.push('Expires days must be a positive number');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

/**
 * Board entity factory
 */
export function createBoard(id, name, ownerId, data = '{}', createdAt = null, updatedAt = null) {
    return {
        id,
        name,
        owner_id: ownerId,
        data,
        created_at: createdAt,
        updated_at: updatedAt
    };
}

/**
 * Board access levels
 */
export const PermissionLevels = {
    READ: 'read',
    WRITE: 'write',
    ADMIN: 'admin'
};

/**
 * Permission comparison helper
 */
export function hasPermission(userPermission, requiredPermission) {
    const permissions = { read: 1, write: 2, admin: 3 };
    return permissions[userPermission] >= permissions[requiredPermission];
}

/**
 * User entity validators
 */

export const UserValidators = {
    isValidUsername(username) {
        return typeof username === 'string' && username.length >= 3;
    },

    isValidPassword(password) {
        return typeof password === 'string' && password.length >= 4;
    },

    isValidRole(role) {
        return role === 'user' || role === 'admin';
    },

    validateRegisterInput(username, password) {
        const errors = [];
        
        if (!this.isValidUsername(username)) {
            errors.push('Username must be at least 3 characters');
        }
        
        if (!this.isValidPassword(password)) {
            errors.push('Password must be at least 4 characters');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    validateLoginInput(username, password) {
        const errors = [];
        
        if (!username || !password) {
            errors.push('Username and password required');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    validatePasswordChange(currentPassword, newPassword) {
        const errors = [];
        
        if (!currentPassword) {
            errors.push('Current password required');
        }
        
        if (!this.isValidPassword(newPassword)) {
            errors.push('New password must be at least 4 characters');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

/**
 * User entity factory
 */
export function createUser(id, username, role = 'user', createdAt = null) {
    return {
        id,
        username,
        role,
        created_at: createdAt
    };
}

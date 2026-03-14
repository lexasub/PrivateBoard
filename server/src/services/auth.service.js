import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { userRepository } from '../repositories/user.repository.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';
import { UserValidators } from '../entity/user.js';

export const authService = {
    async login(username, password) {
        const validation = UserValidators.validateLoginInput(username, password);
        if (!validation.isValid) {
            throw new Error(validation.errors[0]);
        }

        const user = await userRepository.findByUsername(username);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        };
    },

    async register(username, password) {
        const validation = UserValidators.validateRegisterInput(username, password);
        if (!validation.isValid) {
            throw new Error(validation.errors[0]);
        }

        const existingUser = await userRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const id = uuidv4();
        const hash = bcrypt.hashSync(password, 10);
        const user = await userRepository.create(id, username, hash);

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return {
            token,
            user: { id: user.id, username: user.username }
        };
    },

    async changePassword(userId, currentPassword, newPassword) {
        const validation = UserValidators.validatePasswordChange(currentPassword, newPassword);
        if (!validation.isValid) {
            throw new Error(validation.errors[0]);
        }

        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (!bcrypt.compareSync(currentPassword, user.password)) {
            throw new Error('Current password is incorrect');
        }

        const newHash = bcrypt.hashSync(newPassword, 10);
        await userRepository.updatePassword(userId, newHash);

        return { success: true, message: 'Password changed successfully' };
    },

    async getCurrentUser(userId) {
        const user = await userRepository.findByIdWithRole(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return { user };
    },

    async getAllUsers() {
        return await userRepository.findAll();
    },

    async updateUserRole(userId, role) {
        if (!UserValidators.isValidRole(role)) {
            throw new Error('Invalid role');
        }

        const changes = await userRepository.updateRole(userId, role);
        if (changes === 0) {
            throw new Error('User not found');
        }

        return { success: true };
    },

    async deleteUser(userId, currentUserId) {
        if (userId === currentUserId) {
            throw new Error('Cannot delete yourself');
        }

        const changes = await userRepository.delete(userId);
        if (changes === 0) {
            throw new Error('User not found');
        }

        return { success: true };
    },

    async getAllUsersExcept(userId) {
        return await userRepository.findAllExcept(userId);
    },

    async getUserRole(userId) {
        const result = await userRepository.getRole(userId);
        return result?.role;
    }
};

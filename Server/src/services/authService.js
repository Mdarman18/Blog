import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

const signToken = (id) => {
    return jwt.sign({ id }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
};

export const registerUser = async ({ name, email, password, role }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('Email already in use', 400);
    }

    const newUser = await User.create({
        name,
        email,
        password,
        role: role || 'user',
    });

    const token = signToken(newUser._id);

    return { user: newUser, token };
};

export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new AppError('Incorrect email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Incorrect email or password', 401);
    }

    const token = signToken(user._id);

    return { user, token };
};

export const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    return user;
};

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import User from '../models/User';
import { BaseResponse } from '../interfaces/responses';

// Zod schema for signup validation
export const signupSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .regex(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[0-9]/, 'Password must include at least one number')
    .regex(/[!@#$%^&*]/, 'Password must include at least one special character'),
});

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Check for existing username/email (after validation middleware)
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      const response: BaseResponse = {
        success: false,
        message: 'Username already taken',
        errors: ['Username already taken'],
      };
      return res.status(400).json(response);
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      const response: BaseResponse = {
        success: false,
        message: 'Email already registered',
        errors: ['Email already registered'],
      };
      return res.status(400).json(response);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    // Success response (no password returned)
    const response: BaseResponse = {
      success: true,
      message: 'User registered successfully',
      object: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      errors: null,
    };
    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    const response: BaseResponse = {
      success: false,
      message: 'Server error',
      errors: ['An unexpected error occurred'],
    };
    res.status(500).json(response);
  }
};
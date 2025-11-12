import jwt, { type Secret } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import dotenv from 'dotenv';

dotenv.config();

const rawSecret = process.env.JWT_SECRET;
const rawExpiresIn = process.env.JWT_EXPIRES_IN ?? '7d';

if (!rawSecret) {
  throw new Error('JWT_SECRET is not defined in environment variables.');
}

const JWT_SECRET: Secret = rawSecret;
const JWT_EXPIRES_IN: StringValue | number = rawExpiresIn as StringValue | number;

export interface JWTPayload {
  id: string;
  username: string;
  email: string;
  role: 'Admin' | 'Customer';
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};
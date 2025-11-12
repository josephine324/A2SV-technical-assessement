import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';
import { BaseResponse } from '../interfaces/responses';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const response: BaseResponse = {
      success: false,
      message: 'Unauthorized',
      errors: ['Authorization header missing or malformed'],
    };
    return res.status(401).json(response);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    const response: BaseResponse = {
      success: false,
      message: 'Unauthorized',
      errors: ['Invalid or expired token'],
    };
    res.status(401).json(response);
  }
};

export const authorize = (...roles: Array<JWTPayload['role']>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      const response: BaseResponse = {
        success: false,
        message: 'Unauthorized',
        errors: ['User not authenticated'],
      };
      return res.status(401).json(response);
    }

    if (!roles.includes(user.role)) {
      const response: BaseResponse = {
        success: false,
        message: 'Forbidden',
        errors: ['Insufficient permissions'],
      };
      return res.status(403).json(response);
    }

    next();
  };
};


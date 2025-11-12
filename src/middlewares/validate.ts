import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { BaseResponse } from '../interfaces/responses';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => issue.message);
        const response: BaseResponse = {
          success: false,
          message: 'Validation failed',
          errors,
        };
        return res.status(400).json(response);
      }
      const response: BaseResponse = {
        success: false,
        message: 'Server error',
        errors: ['An unexpected error occurred'],
      };
      res.status(500).json(response);
    }
  };
};
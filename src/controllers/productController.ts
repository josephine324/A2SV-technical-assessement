import { Request, Response } from 'express';
import { z } from 'zod';
import Product from '../models/Product';
import { BaseResponse } from '../interfaces/responses';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().gt(0, 'Price must be greater than 0'),
  stock: z
    .coerce.number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
  category: z
    .string()
    .min(1, 'Category is required'),
});

type CreateProductInput = z.infer<typeof createProductSchema>;

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock, category } =
    req.body as CreateProductInput;

  try {
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
    });

    const response: BaseResponse = {
      success: true,
      message: 'Product created successfully',
      object: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
      errors: null,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create product error:', error);
    const response: BaseResponse = {
      success: false,
      message: 'Server error',
      errors: ['An unexpected error occurred'],
    };
    res.status(500).json(response);
  }
};


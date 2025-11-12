import { Request, Response } from 'express';
import { z } from 'zod';
import Product from '../models/Product';
import { BaseResponse } from '../interfaces/responses';

const baseProductSchema = {
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
};

export const createProductSchema = z.object(baseProductSchema);

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

export const updateProductSchema = z
  .object({
    name: baseProductSchema.name.optional(),
    description: baseProductSchema.description.optional(),
    price: baseProductSchema.price.optional(),
    stock: baseProductSchema.stock.optional(),
    category: baseProductSchema.category.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided'
  );

type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body as UpdateProductInput;

  try {
    const updatedProduct = await Product.findOneAndUpdate({ id }, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      const response: BaseResponse = {
        success: false,
        message: 'Product not found',
        errors: ['Product not found'],
      };
      return res.status(404).json(response);
    }

    const response: BaseResponse = {
      success: true,
      message: 'Product updated successfully',
      object: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        stock: updatedProduct.stock,
        category: updatedProduct.category,
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt,
      },
      errors: null,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Update product error:', error);
    const response: BaseResponse = {
      success: false,
      message: 'Server error',
      errors: ['An unexpected error occurred'],
    };
    res.status(500).json(response);
  }
};

export const listProducts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
  const pageSizeQuery =
    Number(req.query.limit ?? req.query.pageSize) || undefined;
  const pageSize = pageSizeQuery && pageSizeQuery > 0 ? pageSizeQuery : 10;
  const rawSearch = typeof req.query.search === 'string' ? req.query.search : '';
  const trimmedSearch = rawSearch.trim();
  const hasSearch = trimmedSearch.length > 0;

  const filter = hasSearch
    ? {
        name: { $regex: trimmedSearch, $options: 'i' },
      }
    : {};

  try {
    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / pageSize) || 1;

    const response: BaseResponse = {
      success: true,
      message: 'Products retrieved successfully',
      object: {
        currentPage: page,
        pageSize,
        totalPages,
        totalProducts,
        products: products.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        })),
      },
      errors: null,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('List products error:', error);
    const response: BaseResponse = {
      success: false,
      message: 'Server error',
      errors: ['An unexpected error occurred'],
    };
    res.status(500).json(response);
  }
};


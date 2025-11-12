import mongoose from 'mongoose';
import { generateUUID } from '../utils/generateUUID';

export interface IProduct extends mongoose.Document {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    id: {
      type: String,
      default: generateUUID,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 1 });
productSchema.index({ category: 1 });

export default mongoose.model<IProduct>('Product', productSchema);


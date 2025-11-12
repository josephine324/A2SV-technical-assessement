import mongoose from 'mongoose';
import { generateUUID } from '../utils/generateUUID';

export interface IUser extends mongoose.Document {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'Admin' | 'Customer';
}

const userSchema = new mongoose.Schema<IUser>(
  {
    id: {
      type: String,
      default: generateUUID,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'Customer'],
      default: 'Customer',
      required: true,
      index: true,
    },
  },
  { timestamps: false } // No auto timestamps for now
);

export default mongoose.model<IUser>('User', userSchema);
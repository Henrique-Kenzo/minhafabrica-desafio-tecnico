import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "admin" | "user";

// Interface para o documento User

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// O Schema do Banco

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true } 
);
export const UserModel = mongoose.model<IUser>('User', UserSchema);
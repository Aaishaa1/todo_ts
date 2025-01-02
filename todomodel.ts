import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Todo document
export interface ITodo extends Document {
  content: string;
  title: string;
  description: string;
  date: Date;
}

// Define the Todo schema with proper types
const todoSchema: Schema<ITodo> = new Schema(
  {
    content: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create and export the Todo model, using ITodo as the document interface
export const Todo = mongoose.model<ITodo>('Todo', todoSchema);

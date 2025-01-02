import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Todo } from './todomodel';  // Assuming the Todo model is in the same folder (adjust the path if necessary)

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());  // Middleware to parse incoming JSON data

const port = process.env.PORT || 8000;  // Use the port from environment variable or default to 8000

// Connect to MongoDB
async function connectDB(): Promise<void> {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in the .env file");
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);  // Exit the process if the connection fails
  }
}

// Get all Todos
app.get('/todos', async (req: Request, res: Response): Promise<Response> => {
  try {
    const todos = await Todo.find();
    return res.status(200).json({ todos });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Create a new Todo
app.post('/todos', async (req: Request, res: Response): Promise<Response> => {
  try {
    const newTodo = req.body;
    const todo = await Todo.create(newTodo);
    return res.status(201).json({ todo });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get a single Todo by ID
app.get('/todos/:id', async (req: Request, res: Response): Promise<Response> => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    return res.status(200).json({ todo });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update a Todo
app.put('/todos/:id', async (req: Request, res: Response): Promise<Response> => {
  try {
    const updatedData = req.body;
    const todo = await Todo.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    return res.status(200).json({ todo });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete a Todo
app.delete('/todos/:id', async (req: Request, res: Response): Promise<Response> => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    return res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Connect to MongoDB
connectDB();

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/auth', authRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('E-Commerce API is running!');
});

// Connect DB and start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
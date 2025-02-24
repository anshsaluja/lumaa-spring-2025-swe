import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import { authenticateToken } from './middlerware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route for root URL
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Management API is running',
    endpoints: {
      auth: {
        register: '/api/auth/register',
        login: '/api/auth/login'
      },
      tasks: {
        list: '/api/tasks',
        create: '/api/tasks',
        update: '/api/tasks/:id',
        delete: '/api/tasks/:id'
      }
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
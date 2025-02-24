// backend/src/controllers/auth.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if user already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, hashedPassword]
        );

        // Generate token
        const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};
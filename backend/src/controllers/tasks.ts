import { Request, Response } from 'express';
import pool from '../db';
import { AuthRequest } from '../middlerware/auth';

type AuthenticatedRequest = Request & AuthRequest;

export const getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user!.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { title, description } = req.body;
        const result = await pool.query(
            'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
            [title, description, req.user!.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create task' });
    }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, is_complete } = req.body;
        
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, is_complete = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [title, description, is_complete, id, req.user!.id]
        );
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update task' });
    }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user!.id]
        );
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete task' });
    }
};
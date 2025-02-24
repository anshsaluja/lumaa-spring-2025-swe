import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/tasks';
import { authenticateToken } from '../middlerware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
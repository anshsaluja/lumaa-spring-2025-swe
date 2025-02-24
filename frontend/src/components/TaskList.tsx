import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
    id: number;
    title: string;
    description: string;
    is_complete: boolean;
}

interface TaskListProps {
    onLogout: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ onLogout }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [editedTasks, setEditedTasks] = useState<{ [key: number]: Task }>({});
    const api = axios.create({
        baseURL: 'http://localhost:3000/api',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const fetchTasks = async () => {
        try {
            const { data } = await api.get<Task[]>('/tasks');
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/tasks', newTask);
            setNewTask({ title: '', description: '' });
            fetchTasks();
        } catch (error) {
            console.error('Failed to create task');
        }
    };

    const handleToggleComplete = async (task: Task) => {
        try {
            await api.put(`/tasks/${task.id}`, {
                ...task,
                is_complete: !task.is_complete
            });
            fetchTasks();
        } catch (error) {
            console.error('Failed to update task');
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error('Failed to delete task');
        }
    };
    const handleUpdateTask = async (task: Task) => {
        try {
            await api.put(`/tasks/${task.id}`, {
                ...task,
                title: editedTasks[task.id].title,
                description: editedTasks[task.id].description
            });
            setEditedTasks((prev) => {
                const { [task.id]: _, ...rest } = prev;
                return rest;
            });
            fetchTasks();
        } catch (error) {
            console.error('Failed to update task');
        }
    };
    const handleInputChange = (id: number, field: 'title' | 'description', value: string) => {
        setEditedTasks((prev) => ({
            ...prev,
            [id]: {
                ...tasks.find((task) => task.id === id)!,
                [field]: value,
            },
        }));
    };

    return (
        <div>
            <h2>Tasks</h2>
            <button onClick={onLogout}>Logout</button>

            <form onSubmit={handleCreateTask}>
                <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <button type="submit">Add Task</button>
            </form>

            <ul>
            {tasks.map((task) => {
                const isEdited = editedTasks[task.id] && (
                    editedTasks[task.id].title !== task.title ||
                    editedTasks[task.id].description !== task.description
                );

                return (
                    <li key={task.id}>
                        <input
                            type="checkbox"
                            checked={task.is_complete}
                            onChange={() => handleToggleComplete(task)}
                        />
                        <input
                            type="text"
                            value={editedTasks[task.id]?.title || task.title}
                            onChange={(e) => handleInputChange(task.id, 'title', e.target.value)}
                        />
                        <input
                            type="text"
                            value={editedTasks[task.id]?.description || task.description}
                            onChange={(e) => handleInputChange(task.id, 'description', e.target.value)}
                        />
                        {isEdited ? (
                            <>
                                <button onClick={() => handleUpdateTask(editedTasks[task.id])}>Update</button>
                                <button onClick={() => setEditedTasks((prev) => {
                                    const { [task.id]: _, ...rest } = prev;
                                    return rest;
                                })}>Revert</button>
                            </>
                        ) : (
                            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        )}
                    </li>
                );
            })}
        </ul>
        </div>
    );
};

export default TaskList;
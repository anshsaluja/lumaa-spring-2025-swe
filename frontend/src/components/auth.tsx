import React, { useState } from 'react';
import axios from 'axios';

interface AuthProps {
    onLogin: (token: string) => void;
}

interface AuthResponse {
    token: string;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const api = axios.create({
        baseURL: 'http://localhost:3000/api'  // Add this line - adjust port if your backend uses different port
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const { data } = await api.post<AuthResponse>(endpoint, { username, password });
            localStorage.setItem('token', data.token);
            onLogin(data.token);
        } catch (err) {
            setError('Authentication failed');
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
            </button>
        </div>
    );
};

export default Auth;
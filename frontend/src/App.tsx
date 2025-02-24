import React, { useState, useEffect } from 'react';
import Auth from './components/auth';
import TaskList from './components/TaskList';

const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const handleLogin = (newToken: string) => {
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <div className="App">
            {token ? (
                <TaskList onLogout={handleLogout} />
            ) : (
                <Auth onLogin={handleLogin} />
            )}
        </div>
    );
};

export default App;
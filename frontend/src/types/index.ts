export interface User {
    id: number;
    username: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    is_complete: boolean;
}

export interface AuthResponse {
    user: User;
    token: string;
}
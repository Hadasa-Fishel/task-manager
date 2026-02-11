export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Team {
    id: number;           // מספר, לפי התמונה
    name: string;
    members_count?: number; // לפי התמונה (עם קו תחתון)
    created_at?: string;    // לפי התמונה
}

export interface Project {
    id: number;
    name: string;
    description?: string;
    teamId: number;       // מזהה הצוות הוא מספר
    created_at?: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    projectId: number;
    created_at?: string;
    priority?: 'HIGH' | 'MEDIUM' | 'LOW'; // הוספנו עדיפות
}

// מודלים לשליחת נתונים (Payloads)
export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}
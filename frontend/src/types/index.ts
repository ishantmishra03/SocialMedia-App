// Auth Slice
export interface User{
    _id: string;
    username: string;
    avatar: string;
};

export interface AuthState{
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}
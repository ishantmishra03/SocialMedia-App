import { AuthState, User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: AuthState = {
    user: null,
    loading: false,
    isAuthenticated: false,
    error: null,
};

// Async Thunks



// Slice 
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout : (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },

        setUser : (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
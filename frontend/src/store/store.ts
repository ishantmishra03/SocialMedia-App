import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import postReducer from "./slices/post.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
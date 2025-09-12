"use client";

import { ThemeContextProvider } from "@/contexts/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import ToastProvider from "@/providers/ToastProvider";
import AuthProvider from "./AuthProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <ThemeContextProvider>
          <ToastProvider />
            <AuthProvider>
              {children}
            </AuthProvider>
        </ThemeContextProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}

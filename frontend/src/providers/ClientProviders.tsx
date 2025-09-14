"use client";

import { ThemeContextProvider } from "@/contexts/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import ToastProvider from "@/providers/ToastProvider";
import AuthProvider from "./AuthProvider";
import { NotificationContextProvider } from "@/contexts/NotificationContext";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <ThemeContextProvider>
          <ToastProvider />
          <NotificationContextProvider>
            <AuthProvider>{children}</AuthProvider>
          </NotificationContextProvider>
        </ThemeContextProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}

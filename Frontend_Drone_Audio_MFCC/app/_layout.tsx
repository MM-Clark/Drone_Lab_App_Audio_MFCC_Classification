import { useAuth } from "@/context/context";
import { AuthProvider } from "@/utils/AuthProvider";
import { Stack } from "expo-router";
import React from "react";

// 1. The Child: Consumes the auth state and protects the routes
function ProtectedLayout() {
  const { user } = useAuth();
  const isAuth = user !== null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0373BB" },
        headerTintColor: "white",
        contentStyle: { backgroundColor: "white" },
      }}
    >
      {/* This acts as your "fallback" for unauthenticated users. 
        If isAuth is false, the (tabs) guard below fails, and Expo automatically 
        routes them to the first available screen, which is this index (Login). 
      */}
      <Stack.Protected guard={!isAuth}>
        <Stack.Screen
          name="index"
          options={{ title: "Welcome!", headerShown: false }}
        />
      </Stack.Protected>

      {/* This protects your main app. 
        If isAuth is true, the index guard above fails, and Expo automatically 
        routes them to the first available screen, which is (tabs).
      */}
      <Stack.Protected guard={isAuth}>
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
      </Stack.Protected>
    </Stack>
  );
}

// 2. The Parent: Wraps the app in the Auth Provider so the Child can read it
export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedLayout />
    </AuthProvider>
  );
}
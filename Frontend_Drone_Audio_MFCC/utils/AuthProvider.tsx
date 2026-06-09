import React, { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "@/context/context";
import { supabase } from "@/services/supabase"; // Adjust path to your supabase.ts
import { User } from "@supabase/supabase-js"; // Use Supabase's native User type

export const AuthProvider = ({children}: {children: ReactNode}) => {
    // We now use the native Supabase User object
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Check active session on initial load
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // 2. Listen for auth changes (Login, Logout, Token Refresh)
        // Supabase handles the secure storage automatically behind the scenes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);
    
    const login = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            
            if (error) throw error;
            return true; // The onAuthStateChange listener will automatically update the user state
        } catch (e) {
            console.error("Login Error: ", e);
            return false;
        }
    };

    // FIXED: Renamed from signUp to register to match your LoginScreen.tsx
    const register = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });
            
            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Registration Error: ", e);
            return false;
        }
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Logout Error: ", error);
    };

    if (isLoading) {
        return null; // Or return a <SplashScreen /> component
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
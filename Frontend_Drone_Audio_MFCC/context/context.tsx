// import { User } from "@/interfaces/interfaces";
import { User } from "@supabase/supabase-js";
import { createContext, useContext } from 'react';

interface AuthContextInterface {
    user: User | null,
    login: (email: string, password: string) => Promise<boolean>,
    register: (email: string, password: string) => Promise<boolean>, 
    logout: () => void,
}

export const AuthContext = createContext<AuthContextInterface>({
    user: null,
    login: async () => false,
    register: async () => false,
    logout: () => {}
});

export const useAuth =() => useContext(AuthContext);


import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users
const DEMO_USERS = {
  'admin@uni.com': {
    email: 'admin@uni.com',
    role: 'Admin',
    id: '1',
  },
  'faculty@uni.com': {
    email: 'faculty@uni.com',
    role: 'Faculty',
    id: '2',
  },
  'student@uni.com': {
    email: 'student@uni.com',
    role: 'Student',
    id: '3',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];
      
      if (password === 'password123' && demoUser) {
        setUser({ 
          id: demoUser.id,
          email: demoUser.email,
          // Add other required User properties
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: {},
          user_metadata: {},
          created_at: '',
        } as User);
        
        setProfile({
          id: demoUser.id,
          role: demoUser.role,
        });
        
        return { error: null };
      }
      
      return { 
        error: { 
          message: 'Invalid login credentials' 
        } 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    isLoading,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
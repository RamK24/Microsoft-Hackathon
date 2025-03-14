
import React, { createContext, useState, useEffect, useContext } from 'react';

interface Coach {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  coach: Coach | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session on mount
    const checkAuth = async () => {
      const savedCoach = localStorage.getItem('bridge_coach');
      if (savedCoach) {
        try {
          setCoach(JSON.parse(savedCoach));
        } catch (e) {
          console.error('Failed to parse saved coach data');
          localStorage.removeItem('bridge_coach');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Mock authentication - in a real app, this would be an API call
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login (would be an actual API call)
      if (email && password) {
        const mockCoach: Coach = {
          id: '1',
          name: email.split('@')[0],
          email: email,
        };
        
        setCoach(mockCoach);
        localStorage.setItem('bridge_coach', JSON.stringify(mockCoach));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCoach(null);
    localStorage.removeItem('bridge_coach');
  };

  return (
    <AuthContext.Provider
      value={{
        coach,
        isAuthenticated: !!coach,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

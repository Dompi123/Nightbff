import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { loginUser, signupUser } from '@/services/api/mockService';
import { Alert } from 'react-native';

// User type consistent with mockService response
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userToken: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (details: { name: string; email: string; password: string }) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // All state hooks declared at the top level
  const [isLoading, setIsLoading] = useState(true); // Start loading initially
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // All hooks must be defined at the top level, not inside other hooks
  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[AuthContext] Login attempt initiated for', email);
      const response = await loginUser(email, password);
      console.log('[AuthContext] Login successful, token received:', response.token.substring(0, 10) + '...');
      setUserToken(response.token);
      setUser(response.user);
      console.log('[AuthContext] Authentication state updated - isAuthenticated now TRUE');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('[AuthContext] Login failed:', errorMessage);
      setError(errorMessage);
      console.log('[AuthContext] Error state updated in context');
    } finally {
      setIsLoading(false);
      console.log('[AuthContext] Loading state finished');
    }
  }, []);

  const signup = useCallback(async (details: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[AuthContext] Signup attempt for', details.email);
      const response = await signupUser(details);
      setUserToken(response.token);
      setUser(response.user);
      console.log('[AuthContext] Signup successful');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('[AuthContext] Signup failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    console.log('[AuthContext] Logout - Clearing auth state');
    
    // Show a logout confirmation dialog
    Alert.alert(
      "Logging Out", 
      "You will be redirected to the login screen.",
      [
        {
          text: "OK",
          onPress: () => {
            // Clear auth state
            setUserToken(null);
            setUser(null);
            console.log('[AuthContext] Auth state cleared - userToken and user set to null');
            
            // This would be where you'd clear persistent storage
            // await SecureStore.deleteItemAsync('userToken');

            // Force an immediate authentication check
            setTimeout(() => {
              console.log('[AuthContext] Verifying auth state after logout:', { 
                token: null, 
                user: null,
                isAuthenticated: false
              });
            }, 100);
          }
        }
      ]
    );
  }, []);

  // Simulate checking stored token on initial load
  useEffect(() => {
    const bootstrapAsync = async () => {
      let token: string | null = null;
      try {
        // Replace with actual token retrieval (e.g., from SecureStore)
        // token = await SecureStore.getItemAsync('userToken');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async check
        
        // For testing purposes, explicitly set token to null to ensure we start unauthenticated
        token = null;
        console.log('[AuthContext] Initial bootstrap - setting token to null');
      } catch (e) {
        console.error("Restoring token failed", e);
      }
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  // Computed value, not a hook
  const isAuthenticated = userToken !== null && user !== null;

  // Create the context value object outside of useMemo or useCallback
  const authContextValue: AuthContextType = {
    isAuthenticated,
    userToken,
    user,
    isLoading,
    error,
    login,
    logout,
    signup,
    clearError,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
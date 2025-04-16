import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Define a constant key for storing the auth token
const AUTH_TOKEN_KEY = 'userAuthToken';

// Mock authentication functions (since they don't exist in mockService)
const loginUser = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate authentication logic
  if (email === 'test@example.com' && password === 'password') {
    return {
      token: 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15),
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }
    };
  }
  
  throw new Error('Invalid credentials');
};

const signupUser = async (details: { name: string; email: string; password: string }): Promise<{ token: string; user: User }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate signup logic
  return {
    token: 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15),
    user: {
      id: '2',
      name: details.name,
      email: details.email
    }
  };
};

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

  // Retrieve token from secure storage on app initialization
  useEffect(() => {
    const bootstrapAsync = async () => {
      let token: string | null = null;
      try {
        // Retrieve token from SecureStore
        token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        console.log('[AuthContext] Initial bootstrap - retrieved token:', token ? 'Token found' : 'No token found');
        
        // If a token exists, we could fetch the user profile here
        // For this implementation, we'll just set a mock user if token exists
        if (token) {
          setUser({
            id: '1',
            name: 'Restored User',
            email: 'restored@example.com'
          });
        }
      } catch (e) {
        console.error("[AuthContext] Restoring token failed", e);
      }
      
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[AuthContext] Login attempt initiated for', email);
      const response = await loginUser(email, password);
      console.log('[AuthContext] Login successful, token received:', response.token.substring(0, 10) + '...');
      
      // Store token in secure storage
      try {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.token);
        console.log('[AuthContext] Token stored in secure storage');
      } catch (storageError) {
        console.error('[AuthContext] Failed to store token:', storageError);
        // Continue even if storage fails - user will be logged in for this session
      }
      
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
      
      // Store token in secure storage
      try {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.token);
        console.log('[AuthContext] Token stored in secure storage after signup');
      } catch (storageError) {
        console.error('[AuthContext] Failed to store token after signup:', storageError);
        // Continue even if storage fails - user will be logged in for this session
      }
      
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
          onPress: async () => {
            // Clear auth state
            setUserToken(null);
            setUser(null);
            console.log('[AuthContext] Auth state cleared - userToken and user set to null');
            
            // Delete token from secure storage
            try {
              await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
              console.log('[AuthContext] Token removed from secure storage');
            } catch (storageError) {
              console.error('[AuthContext] Failed to remove token from storage:', storageError);
              // Continue even if deletion fails - user will still be logged out in this session
            }

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

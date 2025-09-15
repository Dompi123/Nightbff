// --- This file has been manually updated with robust token validation and session handling ---
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useQueryClient } from "@tanstack/react-query";
import eventEmitter from "../utils/eventEmitter";
import { loginUser, signupUser } from "@/services/api/mockService"; // Import from our corrected mockService
import { LoginCredentials, SignUpCredentials } from "@/types/auth"; // Import from our new auth types file

// Define a constant key for storing the auth token
export const AUTH_TOKEN_KEY = "userAuthToken";
const CLOCK_SKEW_SECONDS = 300; // 5 minutes tolerance for clock skew

// User type consistent with mockService response
export interface User {
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
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: (options?: { navigate?: boolean }) => Promise<void>;
  signup: (credentials: SignUpCredentials) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const queryClient = useQueryClient(); // Get queryClient instance for cache clearing
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const clearError = useCallback(() => setError(null), []);

  const logout = useCallback(
    async (options: { navigate?: boolean } = { navigate: true }) => {
      console.log("[AuthContext] Logout - Starting logout sequence");

      try {
        // Clear React Query cache first
        queryClient.clear();
        console.log("[AuthContext] React Query cache cleared");

        // Remove token from secure storage
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
        console.log("[AuthContext] Token removed from secure storage");
      } catch (error) {
        console.error("[AuthContext] Error during storage or cache clear in logout:", error);
      } finally {
        // Always clear state and navigate regardless of upstream errors
        setUserToken(null);
        setUser(null);
        setIsAuthenticated(false);
        console.log("[AuthContext] Auth state cleared");

        if (options.navigate) {
          router.replace("/login");
          console.log("[AuthContext] Navigation to /login triggered");
        }
      }
    },
    [router, queryClient],
  );
  
  // Subscribe to auth error events from the API interceptor
  useEffect(() => {
    const handleAuthError = () => {
      console.log("[AuthContext] Received authError event, triggering logout.");
      logout({ navigate: true });
    };

    eventEmitter.on("authError", handleAuthError);
    return () => {
      eventEmitter.off("authError", handleAuthError);
    };
  }, [logout]);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token: string | null = null;
      try {
        token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        console.log("[AuthContext] Initial bootstrap - retrieved token:", token ? "Token found" : "No token found");

        // NEW ROBUST VALIDATION BLOCK
        if (token && typeof token === 'string' && token.split('.').length === 3) {
          // Token looks like a valid JWT, now try to decode and check expiry
          try {
            const decodedToken: { exp: number, name: string, email: string, sub: string } = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp && decodedToken.exp + CLOCK_SKEW_SECONDS < currentTime) {
              console.warn("[AuthContext] Stored token is expired. Clearing session.");
              await logout({ navigate: false }); // Logout without navigating, as we're already handling state
            } else {
              // Token is valid and not expired, restore session
              setUser({ id: decodedToken.sub, name: decodedToken.name, email: decodedToken.email });
              setUserToken(token);
              setIsAuthenticated(true);
            }
          } catch (decodeError) {
            console.error("[AuthContext] Error decoding a structurally valid token. Discarding.", decodeError);
            await logout({ navigate: false });
          }
        } else if (token) {
          // Token was found, but it's malformed (the "zombie token" case)
          console.warn(`[AuthContext] A malformed token was found and is being discarded. Token: ${token}`);
          await logout({ navigate: false });
        } else {
          // No token was found
          setIsAuthenticated(false);
        }
      } catch (e) {
        console.error("[AuthContext] Restoring token failed", e);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, [logout]); // logout is a stable dependency due to useCallback

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("[AuthContext] Login attempt initiated for", credentials.email);
      const response = await loginUser(credentials);
      
      // NEW ROBUST VALIDATION BLOCK
      if (response.token && typeof response.token === 'string' && response.token.split('.').length === 3) {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.token);
        setUser(response.user);
        setUserToken(response.token);
        setIsAuthenticated(true);
        console.log("[AuthContext] Login successful, valid token stored.");
      } else {
        console.error(`[AuthContext] Login failed: Received an invalid or malformed token from the API. Token: ${response.token}`);
        throw new Error('Authentication failed. Invalid token received.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error("[AuthContext] Login failed:", errorMessage);
      setError(errorMessage);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (credentials: SignUpCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("[AuthContext] Signup attempt for", credentials.email);
      const response = await signupUser(credentials);

      // NEW ROBUST VALIDATION BLOCK
      if (response.token && typeof response.token === 'string' && response.token.split('.').length === 3) {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.token);
        setUser(response.user);
        setUserToken(response.token);
        setIsAuthenticated(true);
        console.log("[AuthContext] Signup successful, valid token stored.");
      } else {
        console.error(`[AuthContext] Signup failed: Received an invalid or malformed token from the API. Token: ${response.token}`);
        throw new Error('Signup failed. Invalid token received.');
      }
      
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("[AuthContext] Signup failed:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
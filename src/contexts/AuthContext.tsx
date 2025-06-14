// Provides authentication context (state and actions) for the application.
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

// Define a constant key for storing the auth token
const AUTH_TOKEN_KEY = "userAuthToken";
const CLOCK_SKEW_SECONDS = 300; // 5 minutes tolerance for clock skew

// Mock authentication functions (since they don't exist in mockService)
const loginUser = async (
  email: string,
  password: string,
): Promise<{ token: string; user: User }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate authentication logic - Allow test@test.com
  if (
    (email === "test@example.com" && password === "password") ||
    email === "test@test.com"
  ) {
    console.log(`[Mock API] Login successful for: ${email}`); // Added log
    return {
      token: "mock-jwt-token-" + Math.random().toString(36).substring(2, 15),
      user: {
        id: email === "test@test.com" ? "test-user-id" : "1", // Use specific ID for test user
        name:
          email === "test@test.com" ? "Test User (Local Mock)" : "Example User", // Specific name
        email: email, // Return the email used for login
      },
    };
  }

  console.error(`[Mock API] Login failed for: ${email}`); // Added error log
  throw new Error("Invalid credentials");
};

const signupUser = async (details: {
  name: string;
  email: string;
  password: string;
}): Promise<{ token: string; user: User }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate signup logic
  return {
    token: "mock-jwt-token-" + Math.random().toString(36).substring(2, 15),
    user: {
      id: "2",
      name: details.name,
      email: details.email,
    },
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
  logout: (options?: { navigate?: boolean }) => Promise<void>;
  signup: (details: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const clearError = useCallback(() => setError(null), []);

  // Subscribe to auth error events
  useEffect(() => {
    const handleAuthError = () => {
      console.log("[AuthContext] Received auth error event, triggering logout");
      logout({ navigate: true });
    };

    eventEmitter.on("authError", handleAuthError);
    return () => {
      eventEmitter.off("authError", handleAuthError);
    };
  }, []);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token: string | null = null;
      try {
        token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        console.log(
          "[AuthContext] Initial bootstrap - retrieved token:",
          token ? "Token found" : "No token found",
        );

        if (token) {
          try {
            // Decode and check token expiration
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (
              decodedToken.exp &&
              decodedToken.exp + CLOCK_SKEW_SECONDS < currentTime
            ) {
              console.log("[AuthContext] Token expired, clearing session");
              await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
              setUserToken(null);
              setUser(null);
              setIsAuthenticated(false);
              return;
            }

            // Token is valid, set authenticated state
            setUser({
              id: "1",
              name: "Restored User",
              email: "restored@example.com",
            });
            setUserToken(token);
            setIsAuthenticated(true);
          } catch (decodeError) {
            console.error("[AuthContext] Token decode failed:", decodeError);
            await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
            setUserToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
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
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("[AuthContext] Login attempt initiated for", email);
      const response = await loginUser(email, password);
      console.log(
        "[AuthContext] Login successful, token received:",
        response.token.substring(0, 10) + "...",
      );

      try {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.token);
        console.log("[AuthContext] Token stored in secure storage");
      } catch (storageError) {
        console.error("[AuthContext] Failed to store token:", storageError);
      }

      setUserToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      console.log(
        "[AuthContext] Authentication state updated - isAuthenticated now TRUE",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("[AuthContext] Login failed:", errorMessage);
      setError(errorMessage);
      setIsAuthenticated(false);
      console.log("[AuthContext] Error state updated in context");
    } finally {
      setIsLoading(false);
      console.log("[AuthContext] Loading state finished");
    }
  }, []);

  const signup = useCallback(
    async (details: { name: string; email: string; password: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("[AuthContext] Signup attempt for", details.email);
        const response = await signupUser(details);

        try {
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.token);
          console.log(
            "[AuthContext] Token stored in secure storage after signup",
          );
        } catch (storageError) {
          console.error(
            "[AuthContext] Failed to store token after signup:",
            storageError,
          );
        }

        setUserToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        console.log("[AuthContext] Signup successful");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        console.error("[AuthContext] Signup failed:", errorMessage);
        setError(errorMessage);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

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

        // Clear auth state
        setUserToken(null);
        setUser(null);
        setIsAuthenticated(false);
        console.log("[AuthContext] Auth state cleared");

        // Navigate if requested
        if (options.navigate) {
          router.replace("/login");
          console.log("[AuthContext] Navigation to /login triggered");
        }
      } catch (error) {
        console.error("[AuthContext] Error during logout:", error);
        // Still clear state even if storage operation fails
        setUserToken(null);
        setUser(null);
        setIsAuthenticated(false);

        if (options.navigate) {
          router.replace("/login");
        }
      }
    },
    [router, queryClient],
  );

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

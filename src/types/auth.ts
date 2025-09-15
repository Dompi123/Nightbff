// src/types/auth.ts

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name?: string;
  email: string;
  password: string;
}

import { create } from 'zustand';

interface User {
  id: string;
  name?: string;
  email?: string;
  mobile: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (mobile: string) => void;
  signup: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (mobile: string) =>
    set({
      user: { id: '1', mobile },
      isAuthenticated: true,
    }),
  signup: (user: User) =>
    set({
      user,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
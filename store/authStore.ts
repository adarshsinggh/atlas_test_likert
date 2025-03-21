import { create } from 'zustand';

interface User {
  id: string;
  mobile: string;
  email?: string;
  age?: number;
  qualification?: string;
  target?: string;
  isProfileComplete?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOtpVerified: boolean;
  login: (mobile: string) => void;
  verifyOtp: (otp: string) => boolean;
  updateProfile: (userData: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isOtpVerified: false,
  login: (mobile: string) =>
    set({
      user: { id: '1', mobile },
      isAuthenticated: false,
      isOtpVerified: false,
    }),
  verifyOtp: (otp: string) => {
    if (otp === '000000') {
      set({ isOtpVerified: true });
      return true;
    }
    return false;
  },
  updateProfile: (userData: Partial<User>) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userData, isProfileComplete: true } : null,
      isAuthenticated: true,
    })),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isOtpVerified: false,
    }),
}));
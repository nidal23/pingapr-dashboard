// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
  org_id: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', { name, email, password });
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false
          });
          // Set auth token for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false
          });
          // Set auth token for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
        // Remove auth token
        delete api.defaults.headers.common['Authorization'];
      },
      
      getCurrentUser: async () => {
        const { token, isAuthenticated } = get();
        
        if (!token || !isAuthenticated) return;
        
        try {
          const { data } = await api.get('/auth/me');
          set({
            user: data.user,
            isAuthenticated: true
          });
        } catch (error) {
          console.error('Failed to fetch current user:', error);
          // If unauthorized, log user out
          if ((error as any)?.response?.status === 401) {
            get().logout();
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);